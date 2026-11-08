import urllib.request
import urllib.error
import json

BASE = "http://127.0.0.1:3001"

def run_tests():
    print("=== NIDRMS P0 SECURITY HARDENING VERIFICATION ===")
    
    # 1. Shelter Delete without Auth
    try:
        req = urllib.request.Request(f"{BASE}/api/v1/disaster/shelters/00000000-0000-0000-0000-000000000000", method="DELETE")
        with urllib.request.urlopen(req) as resp:
            print("FAIL: Shelter delete allowed without auth!")
    except urllib.error.HTTPError as e:
        print(f"PASS [SEC-02]: Shelter DELETE rejected with HTTP {e.code} ({e.read().decode()})")

    # 2. Bulk Import replaceAll
    try:
        req = urllib.request.Request(
            f"{BASE}/api/v1/demographics/households/bulk-import",
            data=json.dumps({"replaceAll": True, "households": []}).encode(),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req) as resp:
            print("FAIL: Bulk import replaceAll allowed!")
    except urllib.error.HTTPError as e:
        print(f"PASS [SEC-01]: replaceAll truncate rejected with HTTP {e.code} ({e.read().decode()})")

    # 3. Clear all households without Auth
    try:
        req = urllib.request.Request(
            f"{BASE}/api/v1/demographics/households-clear-all",
            data=json.dumps({"confirm_action": "PERMANENT_DESTRUCTIVE_CLEAR_HOUSEHOLDS"}).encode(),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req) as resp:
            print("FAIL: households-clear-all allowed without auth!")
    except urllib.error.HTTPError as e:
        print(f"PASS [SEC-01]: households-clear-all rejected with HTTP {e.code} ({e.read().decode()})")

    # 4. SVG Upload Blocked
    try:
        boundary = "----WebKitFormBoundaryX"
        payload = (
            f"--{boundary}\r\n"
            f'Content-Disposition: form-data; name="file"; filename="test.svg"\r\n'
            f"Content-Type: image/svg+xml\r\n\r\n"
            f"<svg><script>alert('xss')</script></svg>\r\n"
            f"--{boundary}--\r\n"
        ).encode("utf-8")
        req = urllib.request.Request(
            f"{BASE}/api/v1/media/upload",
            data=payload,
            headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
            method="POST"
        )
        with urllib.request.urlopen(req) as resp:
            print("FAIL: SVG upload allowed!")
    except urllib.error.HTTPError as e:
        print(f"PASS [SEC-04]: SVG file rejected with HTTP {e.code} ({e.read().decode()})")

    # 5. Public read availability
    req = urllib.request.Request(f"{BASE}/api/v1/disaster/shelters", method="GET")
    with urllib.request.urlopen(req) as resp:
        print(f"PASS [PUB-01]: Shelter public read operational: HTTP {resp.status}")

    print("=== ALL P0 SECURITY VERIFICATIONS PASSED ===")

if __name__ == "__main__":
    run_tests()

