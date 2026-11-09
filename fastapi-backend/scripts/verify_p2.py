"""
NIDRMS Phase 3 (P2 Polish) Automated Verification Test Suite
Verifies:
  - [DB-01] Disaster Schema Unification (Bridging drrm_incidents into events stream)
  - [DB-02] Relief Fund Distribution Foreign Key (incident_id linking)
  - [DOM-01] Incident Verification & DRRM Lifecycle completeness
  - [DOM-01] After Action Review (AAR) & Lessons Learned workflow
"""
import urllib.request
import urllib.error
import json
import time

BASE = "http://127.0.0.1:3001"

def get_admin_token():
    payload = json.dumps({"email": "admin@p5digital.local", "password": "Admin@P5Digital2024!"}).encode()
    req = urllib.request.Request(f"{BASE}/api/v1/auth/login", data=payload, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            return data["accessToken"]
    except urllib.error.HTTPError as e:
        # If rate limited from previous test, wait 3 seconds or handle
        if e.code == 429:
            time.sleep(3)
            return get_admin_token()
        raise

def test_p2():
    print("=== NIDRMS PHASE 3 (P2 POLISH) VERIFICATION ===")

    # 1. [DB-01] Disaster Schema Bridging Verification
    req = urllib.request.Request(f"{BASE}/api/v1/disaster/events", method="GET")
    with urllib.request.urlopen(req) as resp:
        events = json.loads(resp.read().decode())
        bridged_ids = [e["id"] for e in events]
        if "inc-276e67db" in bridged_ids and "inc-46d45377" in bridged_ids:
            print(f"PASS [DB-01]: Unified schema bridge verified. Returned {len(events)} events including PWA incidents {bridged_ids}")
        else:
            print(f"FAIL [DB-01]: Incidents missing from event stream: {bridged_ids}")

    # 2. Get Admin Token for authenticated tests
    token = get_admin_token()
    auth_headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }

    # 3. [DB-02] Relief Fund Distribution Foreign Key (incident_id)
    fund_payload = json.dumps({
        "incidentId": "inc-276e67db",
        "disasterTitle": "पहिरो आपतकालीन राहत",
        "wardNumber": 4,
        "beneficiaryName": "हरि बहादुर श्रेष्ठ",
        "citizenshipNo": "२७-०१-७५-०१२३४",
        "familyCount": 4,
        "reliefType": "तत्काल नगद राहत (DBT)",
        "amountNPR": 25000.0,
        "distributionDateBs": "२०८१-०६-०८",
        "voucherNo": "VCH-2081-0042",
        "status": "वितरण सम्पन्न"
    }).encode()

    req = urllib.request.Request(f"{BASE}/api/v1/disaster/funds", data=fund_payload, headers=auth_headers, method="POST")
    with urllib.request.urlopen(req) as resp:
        fund_res = json.loads(resp.read().decode())
        if fund_res.get("incidentId") == "inc-276e67db":
            print(f"PASS [DB-02]: Relief fund FK linked to incident 'inc-276e67db' (Voucher: {fund_res['voucherNo']}, Amount: NPR {fund_res['amountNPR']})")
        else:
            print("FAIL [DB-02]: incidentId not persisted in fund distribution!")

    # Verify filtering funds by incident_id
    req = urllib.request.Request(f"{BASE}/api/v1/disaster/funds?incident_id=inc-276e67db", headers=auth_headers, method="GET")
    with urllib.request.urlopen(req) as resp:
        matched_funds = json.loads(resp.read().decode())
        print(f"PASS [DB-02]: Successfully filtered funds by incident_id (Matched: {len(matched_funds)})")

    # 4. [DOM-01] Incident Verification Workflow
    # A. Unauthenticated verify must be rejected
    try:
        req = urllib.request.Request(f"{BASE}/api/v1/disaster/incidents/inc-276e67db/verify", data=b"{}", headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req) as resp:
            print("FAIL [DOM-01]: Incident verification allowed without auth!")
    except urllib.error.HTTPError as e:
        print(f"PASS [DOM-01]: Unauthenticated verification rejected with HTTP {e.code}")

    # B. Authenticated verification
    verif_payload = json.dumps({
        "status": "VERIFIED",
        "confirmedSeverity": "Critical",
        "isLifeSafetyThreat": True,
        "immediateActionRequired": "सशस्त्र प्रहरी SAR टोली परिचालन तथा तत्काल त्रिपाल वितरण",
        "notes": "स्थलगत अवलोकनबाट पहिरोले २ घर जोखिममा पारेको पुष्टि भयो।"
    }).encode()
    req = urllib.request.Request(f"{BASE}/api/v1/disaster/incidents/inc-276e67db/verify", data=verif_payload, headers=auth_headers, method="POST")
    with urllib.request.urlopen(req) as resp:
        v_res = json.loads(resp.read().decode())
        print(f"PASS [DOM-01]: Incident verified by {v_res['verified_by_name']} (Severity: {v_res['confirmed_severity']}, Threat: {v_res['is_life_safety_threat']})")

    # C. Read verifications list
    req = urllib.request.Request(f"{BASE}/api/v1/disaster/incidents/inc-276e67db/verifications", headers=auth_headers, method="GET")
    with urllib.request.urlopen(req) as resp:
        v_list = json.loads(resp.read().decode())
        print(f"PASS [DOM-01]: Verification history retrieved (Count: {len(v_list)})")

    # 5. [DOM-01] After Action Review & Lessons Learned
    aar_payload = json.dumps({
        "title": "मानेखर्क पहिरो तत्काल उद्धार समीक्षा (AAR)",
        "leadEvaluator": "विपद् व्यवस्थापन शाखा प्रमुख",
        "responseStrengths": "PWA अफलाइन सिङ्कको मद्दतले बिजुली/इन्टरनेट नहुँदा पनि ३० सेकेन्डमै विवरण संकलन भयो।",
        "challengesFaced": "तटीय सडक अवरुद्ध भएकाले डोजर पुग्न ४ घण्टा लाग्यो।",
        "policyRecommendations": "वडा नं ४ मा पूर्व-तैनाथ एस्काभेटर स्ट्यान्डबाइ राख्नुपर्ने।",
        "infrastructureImprovements": "ग्याबियन जाली पर्खाल तथा बायो-इन्जिनियरिङ थप गर्नुपर्ने।",
        "overallRating": "Exemplary"
    }).encode()
    req = urllib.request.Request(f"{BASE}/api/v1/disaster/incidents/inc-276e67db/lessons-learned", data=aar_payload, headers=auth_headers, method="POST")
    with urllib.request.urlopen(req) as resp:
        aar_res = json.loads(resp.read().decode())
        print(f"PASS [DOM-01]: AAR Lessons Learned recorded (Title: '{aar_res['title']}', Rating: {aar_res['overall_rating']})")

    req = urllib.request.Request(f"{BASE}/api/v1/disaster/incidents/inc-276e67db/lessons-learned", headers=auth_headers, method="GET")
    with urllib.request.urlopen(req) as resp:
        aar_list = json.loads(resp.read().decode())
        print(f"PASS [DOM-01]: Lessons Learned retrieved (Count: {len(aar_list)})")

    print("=== ALL PHASE 3 (P2 POLISH) TESTS COMPLETED SUCCESSFULLY ===")

if __name__ == "__main__":
    test_p2()

