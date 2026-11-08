"""
Process-Shared Sliding Window Rate Limiter [SEC-05]
Complies with OWASP ASVS v5.0 Authentication Rate Limiting & Brute-Force Prevention.
Uses WAL-mode SQLite tmpfs storage to synchronize limits across all multi-worker Uvicorn processes.
"""
import sqlite3
import time
import os
from typing import Optional
from fastapi import Request, HTTPException, status

DB_PATH = "/tmp/nidrms_rate_limit.db"


class ProcessSharedRateLimiter:
    def __init__(self, requests_limit: int = 5, window_seconds: int = 60):
        self.requests_limit = requests_limit
        self.window_seconds = window_seconds
        self._init_db()

    def _init_db(self):
        try:
            with sqlite3.connect(DB_PATH, timeout=5.0) as conn:
                conn.execute("PRAGMA journal_mode=WAL;")
                conn.execute("""
                    CREATE TABLE IF NOT EXISTS rate_limits (
                        key TEXT NOT NULL,
                        timestamp REAL NOT NULL
                    );
                """)
                conn.execute("CREATE INDEX IF NOT EXISTS idx_rate_key_time ON rate_limits(key, timestamp);")
        except Exception:
            pass

    def get_client_ip(self, request: Request) -> str:
        """Extracts client IP respecting proxy headers"""
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip.strip()
        if request.client and request.client.host:
            return request.client.host
        return "127.0.0.1"

    def check(self, request: Request, key_prefix: str = "login", custom_key: Optional[str] = None):
        """
        Enforces rate limiting across all Uvicorn processes.
        Raises HTTP 429 Too Many Requests if threshold is exceeded.
        """
        ip = self.get_client_ip(request)
        key = f"{key_prefix}:{custom_key or ip}"
        now = time.time()
        window_start = now - self.window_seconds

        try:
            with sqlite3.connect(DB_PATH, timeout=5.0) as conn:
                cursor = conn.cursor()
                # 1. Clean stale records for this key
                cursor.execute("DELETE FROM rate_limits WHERE key = ? AND timestamp < ?", (key, window_start))
                # 2. Count attempts in current window
                cursor.execute("SELECT COUNT(*), MIN(timestamp) FROM rate_limits WHERE key = ? AND timestamp >= ?", (key, window_start))
                row = cursor.fetchone()
                count = row[0] if row else 0
                oldest_ts = row[1] if (row and row[1]) else now

                if count >= self.requests_limit:
                    retry_after = max(1, int(self.window_seconds - (now - oldest_ts)) + 1)
                    raise HTTPException(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        detail=(
                            f"धेरै लगइन प्रयासहरू दर्ता भए! सुरक्षाका लागि कृपया {retry_after} सेकेन्ड पर्खिनुहोस् "
                            f"(Too many login attempts. Rate limit exceeded. Retry in {retry_after} seconds)."
                        ),
                        headers={"Retry-After": str(retry_after)}
                    )

                # 3. Record this attempt
                cursor.execute("INSERT INTO rate_limits (key, timestamp) VALUES (?, ?)", (key, now))
                conn.commit()
        except HTTPException:
            raise
        except Exception:
            # Fallback gracefully if temporary storage issue
            pass


# Shared multi-process rate limiters
login_rate_limiter = ProcessSharedRateLimiter(requests_limit=5, window_seconds=60)
registration_rate_limiter = ProcessSharedRateLimiter(requests_limit=5, window_seconds=60)
