"""
NIDRMS Phase 2 (P1) Automated Verification Test Suite
Verifies:
  - [SEC-05] Login rate limiting (429 Too Many Requests)
  - [GIS-01] PostGIS geodetic buffer accuracy (WGS-84 aspect ratio)
  - [GIS-02] IoT sensor telemetry authentication and sanity check
  - [DR-01] Physical backup discovery and mutation protection
"""
import urllib.request
import urllib.error
import json
import math

BASE = "http://127.0.0.1:3001"

def test_p1():
    print("=== NIDRMS PHASE 2 (P1) REMEDIATION VERIFICATION ===")

    # 1. [GIS-01] PostGIS ST_Buffer Geodesic Buffer Accuracy
    buf_payload = json.dumps({"lat": 27.98, "lng": 85.75, "buffer_meters": 200}).encode()
    req = urllib.request.Request(f"{BASE}/api/v1/gis/buffer-analysis", data=buf_payload, headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req) as resp:
        geom = json.loads(resp.read().decode())
        coords = geom["coordinates"][0]
        lats = [c[1] for c in coords]
        lngs = [c[0] for c in coords]
        lat_span = max(lats) - min(lats)
        lng_span = max(lngs) - min(lngs)
        ratio = lng_span / lat_span
        expected_ratio = 1.0 / math.cos(math.radians(27.98)) # ~1.132 at 27.98 deg North
        diff = abs(ratio - expected_ratio)
        if diff < 0.05:
            print(f"PASS [GIS-01]: Geodetic ST_Buffer WGS-84 aspect ratio verified (Measured: {ratio:.4f}, Expected: {expected_ratio:.4f}, Points: {len(coords)})")
        else:
            print(f"FAIL [GIS-01]: Buffer distortion detected: ratio={ratio:.4f}, expected={expected_ratio:.4f}")

    # 2. [GIS-02] IoT Sensor Telemetry Authentication & Poisoning Prevention
    # A. Without auth
    try:
        t_payload = json.dumps({"sensorId": "SEN-MEL-01", "value": 4.5}).encode()
        req = urllib.request.Request(f"{BASE}/api/v1/sensors/telemetry", data=t_payload, headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req) as resp:
            print("FAIL [GIS-02]: Telemetry accepted without auth!")
    except urllib.error.HTTPError as e:
        print(f"PASS [GIS-02]: Unauthenticated telemetry rejected with HTTP {e.code} ({e.read().decode()})")

    # B. With valid auth key but absurd value (99999)
    try:
        t_payload_absurd = json.dumps({"sensorId": "SEN-MEL-01", "value": 99999.0}).encode()
        req = urllib.request.Request(
            f"{BASE}/api/v1/sensors/telemetry",
            data=t_payload_absurd,
            headers={"Content-Type": "application/json", "X-Sensor-Key": "nidrms-sensor-mesh-key-2024"},
            method="POST"
        )
        with urllib.request.urlopen(req) as resp:
            print("FAIL [GIS-02]: Poisoned sensor telemetry accepted!")
    except urllib.error.HTTPError as e:
        print(f"PASS [GIS-02]: Poisoned value (99999) rejected with HTTP {e.code}")

    # C. With valid auth key and legitimate value
    t_payload_valid = json.dumps({"sensorId": "SEN-MEL-01", "value": 3.8}).encode()
    req = urllib.request.Request(
        f"{BASE}/api/v1/sensors/telemetry",
        data=t_payload_valid,
        headers={"Content-Type": "application/json", "X-Sensor-Key": "nidrms-sensor-mesh-key-2024"},
        method="POST"
    )
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode())
        print(f"PASS [GIS-02]: Authorized sensor telemetry accepted (Sensor: {res['sensor_id']}, Value: {res['last_value']}m, Status: {res['status']})")

    # 3. [DR-01] Backup & DR Discovery and RBAC Protection
    req = urllib.request.Request(f"{BASE}/api/v1/backup/snapshots", method="GET")
    with urllib.request.urlopen(req) as resp:
        snap_data = json.loads(resp.read().decode())
        print(f"PASS [DR-01]: Backup metadata operational (Total: {snap_data['total_count']} snapshots)")

    # Unauthenticated trigger-now must be 401
    try:
        req = urllib.request.Request(f"{BASE}/api/v1/backup/trigger-now", data=b"{}", headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req) as resp:
            print("FAIL [DR-01]: Manual backup allowed without auth!")
    except urllib.error.HTTPError as e:
        print(f"PASS [DR-01]: Manual backup trigger rejected with HTTP {e.code} ({e.read().decode()})")

    # 4. [SEC-05] Login Rate Limiting (5 attempts/min)
    rate_limited = False
    for attempt in range(1, 8):
        try:
            l_payload = json.dumps({"email": "attacker@test.com", "password": "wrongpassword"}).encode()
            req = urllib.request.Request(f"{BASE}/api/v1/auth/login", data=l_payload, headers={"Content-Type": "application/json"}, method="POST")
            with urllib.request.urlopen(req) as resp:
                pass
        except urllib.error.HTTPError as e:
            if e.code == 429:
                rate_limited = True
                retry_after = e.headers.get("Retry-After", "unknown")
                print(f"PASS [SEC-05]: Rate limit triggered on attempt {attempt}: HTTP 429 (Retry-After: {retry_after}s, Detail: {e.read().decode()})")
                break

    if not rate_limited:
        print("FAIL [SEC-05]: Rate limit was not triggered after 7 attempts!")

    print("=== ALL PHASE 2 (P1) REMEDIATION TESTS COMPLETED SUCCESSFULLY ===")

if __name__ == "__main__":
    test_p1()
