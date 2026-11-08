"""
Environmental & Riverine Mining Regulation API Router (वातावरण तथा नदीजन्य खानी नियमन IEE/वन)
Disaster Risk Management & Multi-Sectoral Risk Assessment System (DRM-MSRA)
Provides complete endpoints for:
1. Riverine sand/gravel/stone mining sites & crusher plant monitoring
2. Initial Environmental Examination (IEE / EIA) compliance & extraction quotas
3. Community forests & watershed conservation for landslide/erosion mitigation
4. Environmental inspection logs, early warnings, and penalty records
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status, Body
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import List, Optional, Any, Dict
from core.database import get_db
from models.gis_resources import NaturalResourceMaster, EnvironmentalRiskZone
import uuid
from datetime import datetime

router = APIRouter(
    prefix="/api/v1/environmental-mining",
    tags=["Environmental & Riverine Mining Regulation (वातावरण तथा नदीजन्य खानी नियमन)"]
)

# In-memory store fallback for demo & persistence alongside GIS resources
MINING_SITES_MOCK: List[Dict[str, Any]] = [
    {
        "id": "MINE-001",
        "name": "मेलम्ची खोला बगर नदीजन्य ढुङ्गा-बालुवा उत्खनन क्षेत्र",
        "operatorName": "इन्द्रावती एग्रिगेट्स एण्ड सप्लायर्स प्रा.लि.",
        "wardNumber": 2,
        "riverBasin": "मेलम्ची-इन्द्रावती जलाधार",
        "resourceType": "बालुवा/गिट्टी/ढुङ्गा",
        "ieeStatus": "स्वीकृत (Approved)",
        "ieeRegistrationNo": "IEE-ENV-२०८०-०४२",
        "approvedQuotaCuM": 45000,
        "extractedVolumeCuM": 32800,
        "contractPeriod": "२०८०-०७-०१ देखि २०८१-०२-३० सम्म",
        "royaltyAmountNPR": 3650000,
        "riskLevel": "उच्च (बाढी संवेदनशीलता)",
        "monitoringStatus": "सक्रिय अनुगमन",
        "crusherDistanceKm": 1.2,
        "gpsCoordinates": {"lat": 27.9150, "lng": 85.5890},
        "lastInspectedBs": "२०८१-०५-१०",
        "complianceScore": 78
    },
    {
        "id": "MINE-002",
        "name": "याङ्ग्री खोला तटीय बालुवा संकलन डिपो",
        "operatorName": "पाँचपोखरी कन्सट्रक्सन एण्ड क्रसर प्रा.लि.",
        "wardNumber": 3,
        "riverBasin": "याङ्ग्री खोला जलाधार",
        "resourceType": "बालुवा/ग्राभेल",
        "ieeStatus": "स्वीकृत (Approved)",
        "ieeRegistrationNo": "IEE-ENV-२०८०-०८९",
        "approvedQuotaCuM": 28000,
        "extractedVolumeCuM": 14200,
        "contractPeriod": "२०८०-०८-१५ देखि २०८१-०२-१५ सम्म",
        "royaltyAmountNPR": 2240000,
        "riskLevel": "मध्यम",
        "monitoringStatus": "नियमित",
        "crusherDistanceKm": 2.5,
        "gpsCoordinates": {"lat": 27.9850, "lng": 85.6320},
        "lastInspectedBs": "२०८१-०५-०२",
        "complianceScore": 88
    },
    {
        "id": "MINE-003",
        "name": "गुन्सा परम्परागत स्लेट तथा ढुङ्गा खानी (Gunsa Traditional Slate Quarry)",
        "operatorName": "गुन्सा स्लेट संरक्षण तथा उत्खनन उपभोक्ता समिति",
        "wardNumber": 5,
        "riverBasin": "मानेखर्क उप-जलाधार",
        "resourceType": "घर छाउने स्लेट/ढुङ्गा",
        "ieeStatus": "स्थानीय कार्यविधि पालना",
        "ieeRegistrationNo": "MUN-IEE-२०७९-१४",
        "approvedQuotaCuM": 12000,
        "extractedVolumeCuM": 8500,
        "contractPeriod": "२०७९-०४-०१ देखि २०८२-०३-३० सम्म",
        "royaltyAmountNPR": 720000,
        "riskLevel": "उच्च (पहिरो जोखिम)",
        "monitoringStatus": "सतर्कता निर्देशन",
        "crusherDistanceKm": 0,
        "gpsCoordinates": {"lat": 27.9220, "lng": 85.6080},
        "lastInspectedBs": "२०८१-०४-२८",
        "complianceScore": 65
    },
    {
        "id": "MINE-004",
        "name": "भोताङ लेकाली गेग्रान तथा खोला ढुङ्गा उत्खनन बिन्दु",
        "operatorName": "अवैध/अनधिकृत संकलन रोक्का बिन्दु",
        "wardNumber": 3,
        "riverBasin": "भोताङ खोला",
        "resourceType": "ढुङ्गा/गेग्रान",
        "ieeStatus": "अस्वीकृत / रोक्का (Suspended)",
        "ieeRegistrationNo": "N/A",
        "approvedQuotaCuM": 0,
        "extractedVolumeCuM": 4100,
        "contractPeriod": "रोक्का गरिएको",
        "royaltyAmountNPR": 0,
        "riskLevel": "अति उच्च (पहिरो तथा नदी कटान)",
        "monitoringStatus": "कारबाही तथा रोक्का",
        "crusherDistanceKm": 0.8,
        "gpsCoordinates": {"lat": 28.0180, "lng": 85.5780},
        "lastInspectedBs": "२०८१-०५-१४",
        "complianceScore": 25
    }
]

IEE_RECORDS_MOCK: List[Dict[str, Any]] = [
    {
        "id": "IEE-001",
        "projectTitle": "मेलम्ची तथा याङ्ग्री जलाधार नदीजन्य पदार्थ उत्खनन प्रारम्भिक वातावरणीय परीक्षण (IEE)",
        "proponent": "पाँचपोखरी थाङपाल गाउँपालिका कार्यपालिका कार्यालय",
        "consultant": "ग्रीन नेपाल इन्भाएरोन्मेन्टल सोलुसन्स प्रा.लि.",
        "approvalDateBs": "२०८०-०६-२४",
        "monitoringAuthority": "गाउँ कार्यपालिका तथा जिल्ला विपद् व्यवस्थापन समिति (DDMC)",
        "status": "कार्यान्वयनमा (Active)",
        "keyRecommendations": "नदीको मुख्य धारबाट कम्तीमा ५० मिटर छाडेर मात्र उत्खनन गर्ने, वर्षायाम (असार १ - भदौ मसान्त) मा पूर्ण प्रतिबन्ध",
        "allocatedMitigationBudgetNPR": 1850000,
        "treePlantationTarget": 5000,
        "treesPlanted": 3400
    },
    {
        "id": "IEE-002",
        "projectTitle": "मानेखर्क-भोताङ ग्रामीण कृषि सडक निर्माण वातावरणीय अध्ययन प्रतिवेदन",
        "proponent": "पूर्वाधार विकास शाखा, पाँचपोखरी थाङपाल",
        "consultant": "हिमालयन इन्जिनियरिङ कन्सल्ट्यान्ट्स",
        "approvalDateBs": "२०७९-११-१२",
        "monitoringAuthority": "वातावरण तथा वन उपशाखा",
        "status": "अनुगमन जारी",
        "keyRecommendations": "भिरालो जमिनमा बायो-इन्जिनियरिङ, ग्याबियन वाल अनिवार्य गर्ने, वन क्षेत्रमा कटान न्युनतम गर्ने",
        "allocatedMitigationBudgetNPR": 2400000,
        "treePlantationTarget": 3500,
        "treesPlanted": 3100
    },
    {
        "id": "IEE-003",
        "projectTitle": "थाङपालधाप फोहरमैला व्यवस्थापन तथा जैविक कम्पोस्ट प्लान्ट IEE",
        "proponent": "सरसफाइ तथा वातावरण शाखा",
        "consultant": "इको-फोकस कन्सल्टिङ",
        "approvalDateBs": "२०८०-०२-१८",
        "monitoringAuthority": "वातावरण विभाग / गाउँपालिका",
        "status": "सम्पन्न / सञ्चालनमा",
        "keyRecommendations": "लिचेट संकलन ट्याङ्की वाटरप्रुफ हुनुपर्ने, नजिकैको जलस्रोतमा ढल मिसाउन नपाइने",
        "allocatedMitigationBudgetNPR": 1200000,
        "treePlantationTarget": 1200,
        "treesPlanted": 1200
    }
]

COMMUNITY_FORESTS_MOCK: List[Dict[str, Any]] = [
    {
        "id": "CF-001",
        "name": "तार्केघ्याङ धुपी, सल्ला तथा गुराँस सामुदायिक वन",
        "wardNumber": 2,
        "cfugName": "तार्केघ्याङ सामुदायिक वन उपभोक्ता समूह",
        "areaHectares": 385.0,
        "totalHouseholds": 182,
        "conservationRole": "पहिरो रोकथाम तथा हिमाली जलाधार संरक्षण",
        "forestFireRisk": "मध्यम",
        "patrolTeamCount": 12,
        "treeSpecies": "धुपी सल्ला, खस्रु, गुराँस, लोक्ता",
        "status": "सक्रिय संरक्षण"
    },
    {
        "id": "CF-002",
        "name": "बाँसखर्क साल तथा चिलाउने जैविक विविधता सामुदायिक वन",
        "wardNumber": 1,
        "cfugName": "बाँसखर्क वन उपभोक्ता समूह",
        "areaHectares": 215.0,
        "totalHouseholds": 145,
        "conservationRole": "भू-क्षय नियन्त्रण तथा मुहान संरक्षण",
        "forestFireRisk": "उच्च (फागुन-वैशाख सतर्कता)",
        "patrolTeamCount": 16,
        "treeSpecies": "साल, चिलाउने, कटुस, बाँस",
        "status": "सक्रिय संरक्षण"
    },
    {
        "id": "CF-003",
        "name": "मानेखर्क हरियाली जलाधार सामुदायिक वन",
        "wardNumber": 5,
        "cfugName": "मानेखर्क हरियाली उपभोक्ता समिति",
        "areaHectares": 168.5,
        "totalHouseholds": 120,
        "conservationRole": "भिरालो बस्ती संरक्षण तथा बायो-इन्जिनियरिङ",
        "forestFireRisk": "मध्यम",
        "patrolTeamCount": 10,
        "treeSpecies": "उत्तिस, चिलाउने, सल्ला",
        "status": "सक्रिय संरक्षण"
    }
]

INSPECTIONS_MOCK: List[Dict[str, Any]] = [
    {
        "id": "INSP-001",
        "siteId": "MINE-004",
        "siteName": "भोताङ लेकाली गेग्रान संकलन बिन्दु",
        "inspectionDateBs": "२०८१-०५-१४",
        "inspectorName": "सुजन श्रेष्ठ (वातावरण अधिकृत)",
        "violationsFound": "स्वीकृत बिना नदी किनारमा डोजर प्रयोग गरी अवैध उत्खनन, नदीको प्राकृतिक धार अवरुद्ध",
        "actionTaken": "तत्काल काम रोक्का, हेभी मेसिनरी नियन्त्रण तथा रु ५०,००० जरिवाना",
        "status": "कारबाही सम्पन्न"
    },
    {
        "id": "INSP-002",
        "siteId": "MINE-001",
        "siteName": "मेलम्ची खोला बगर नदीजन्य उत्खनन क्षेत्र",
        "inspectionDateBs": "२०८१-०५-१०",
        "inspectorName": "ई. नवराज खड्का (प्राविधिक शाखा) र वातावरण टोली",
        "violationsFound": "तोकिएको सीमाभन्दा ३० मिटर नदी किनार नजिक खनेको भेटिएको",
        "actionTaken": "नदी किनारबाट पछाडि हट्न ७ दिने चेतावनी पत्र (Show-cause Notice) जारी",
        "status": "सुधारात्मक अनुगमनमा"
    }
]


# ── 1. STATS ────────────────────────────────────────────────────────────────
@router.get("/stats")
def get_environmental_mining_stats(db: Session = Depends(get_db)):
    total_sites = len(MINING_SITES_MOCK)
    active_sites = sum(1 for s in MINING_SITES_MOCK if "सक्रिय" in s.get("monitoringStatus", "") or "नियमित" in s.get("monitoringStatus", ""))
    suspended_sites = sum(1 for s in MINING_SITES_MOCK if "रोक्का" in s.get("monitoringStatus", "") or "अस्वीकृत" in s.get("ieeStatus", ""))
    total_extracted = sum(s.get("extractedVolumeCuM", 0) for s in MINING_SITES_MOCK)
    total_quota = sum(s.get("approvedQuotaCuM", 0) for s in MINING_SITES_MOCK)
    total_royalty = sum(s.get("royaltyAmountNPR", 0) for s in MINING_SITES_MOCK)
    
    total_forest_area = sum(f.get("areaHectares", 0) for f in COMMUNITY_FORESTS_MOCK)
    total_tree_plantation = sum(i.get("treesPlanted", 0) for i in IEE_RECORDS_MOCK)

    return {
        "totalMiningSites": total_sites,
        "activeMiningSites": active_sites,
        "suspendedMiningSites": suspended_sites,
        "totalQuotaCuM": total_quota,
        "totalExtractedCuM": total_extracted,
        "extractionPercent": round((total_extracted / total_quota * 100), 1) if total_quota > 0 else 0,
        "totalRoyaltyNPR": total_royalty,
        "totalIeeRecords": len(IEE_RECORDS_MOCK),
        "totalCommunityForests": len(COMMUNITY_FORESTS_MOCK),
        "totalForestAreaHectares": total_forest_area,
        "totalTreesPlanted": total_tree_plantation,
        "totalInspections": len(INSPECTIONS_MOCK)
    }


# ── 2. MINING SITES ─────────────────────────────────────────────────────────
@router.get("/mining-sites")
def get_mining_sites(
    ward: Optional[int] = Query(None),
    status_filter: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    results = MINING_SITES_MOCK
    if ward and ward > 0:
        results = [s for s in results if s.get("wardNumber") == ward]
    if status_filter and status_filter != "all":
        results = [s for s in results if status_filter.lower() in s.get("monitoringStatus", "").lower() or status_filter.lower() in s.get("ieeStatus", "").lower()]
    if risk_level and risk_level != "all":
        results = [s for s in results if risk_level.lower() in s.get("riskLevel", "").lower()]
    if search:
        q = search.lower()
        results = [
            s for s in results
            if q in s.get("name", "").lower()
            or q in s.get("operatorName", "").lower()
            or q in s.get("riverBasin", "").lower()
            or q in s.get("resourceType", "").lower()
        ]
    return results


@router.post("/mining-sites")
def create_mining_site(data: Dict[str, Any] = Body(...)):
    new_id = f"MINE-{str(uuid.uuid4())[:6].upper()}"
    new_site = {
        "id": new_id,
        "name": data.get("name", "नयाँ नदीजन्य उत्खनन क्षेत्र"),
        "operatorName": data.get("operatorName", "अज्ञात ठेकेदार"),
        "wardNumber": int(data.get("wardNumber", 1)),
        "riverBasin": data.get("riverBasin", "नदी जलाधार"),
        "resourceType": data.get("resourceType", "बालुवा/गिट्टी"),
        "ieeStatus": data.get("ieeStatus", "प्रक्रियामा"),
        "ieeRegistrationNo": data.get("ieeRegistrationNo", "N/A"),
        "approvedQuotaCuM": float(data.get("approvedQuotaCuM", 0)),
        "extractedVolumeCuM": float(data.get("extractedVolumeCuM", 0)),
        "contractPeriod": data.get("contractPeriod", "२०८१"),
        "royaltyAmountNPR": float(data.get("royaltyAmountNPR", 0)),
        "riskLevel": data.get("riskLevel", "मध्यम"),
        "monitoringStatus": data.get("monitoringStatus", "नियमित"),
        "crusherDistanceKm": float(data.get("crusherDistanceKm", 1.0)),
        "gpsCoordinates": data.get("gpsCoordinates", {"lat": 27.9500, "lng": 85.6000}),
        "lastInspectedBs": data.get("lastInspectedBs", "२०८१-०५-०१"),
        "complianceScore": int(data.get("complianceScore", 80))
    }
    MINING_SITES_MOCK.insert(0, new_site)
    return new_site


# ── 3. IEE RECORDS ──────────────────────────────────────────────────────────
@router.get("/iee-records")
def get_iee_records():
    return IEE_RECORDS_MOCK


@router.post("/iee-records")
def create_iee_record(data: Dict[str, Any] = Body(...)):
    new_id = f"IEE-{str(uuid.uuid4())[:6].upper()}"
    new_rec = {
        "id": new_id,
        "projectTitle": data.get("projectTitle", "नयाँ वातावरणीय परीक्षण"),
        "proponent": data.get("proponent", "गाउँ कार्यपालिका"),
        "consultant": data.get("consultant", "परामर्शदाता"),
        "approvalDateBs": data.get("approvalDateBs", "२०८१-०१-०१"),
        "monitoringAuthority": data.get("monitoringAuthority", "वातावरण शाखा"),
        "status": data.get("status", "कार्यान्वयनमा"),
        "keyRecommendations": data.get("keyRecommendations", "मापदण्ड पालना"),
        "allocatedMitigationBudgetNPR": float(data.get("allocatedMitigationBudgetNPR", 0)),
        "treePlantationTarget": int(data.get("treePlantationTarget", 1000)),
        "treesPlanted": int(data.get("treesPlanted", 0))
    }
    IEE_RECORDS_MOCK.insert(0, new_rec)
    return new_rec


# ── 4. COMMUNITY FORESTS ────────────────────────────────────────────────────
@router.get("/community-forests")
def get_community_forests():
    return COMMUNITY_FORESTS_MOCK


# ── 5. INSPECTIONS ──────────────────────────────────────────────────────────
@router.get("/inspections")
def get_inspections():
    return INSPECTIONS_MOCK


@router.post("/inspections")
def create_inspection(data: Dict[str, Any] = Body(...)):
    new_id = f"INSP-{str(uuid.uuid4())[:6].upper()}"
    new_insp = {
        "id": new_id,
        "siteId": data.get("siteId", ""),
        "siteName": data.get("siteName", "अनुगमन गरिएको खानी क्षेत्र"),
        "inspectionDateBs": data.get("inspectionDateBs", "२०८१-०५-१५"),
        "inspectorName": data.get("inspectorName", "वातावरण अनुगमन टोली"),
        "violationsFound": data.get("violationsFound", "कुनै गम्भीर कैफियत नदेखिएको"),
        "actionTaken": data.get("actionTaken", "नियमित अनुगमन निर्देशन"),
        "status": data.get("status", "सम्पन्न")
    }
    INSPECTIONS_MOCK.insert(0, new_insp)
    return new_insp

