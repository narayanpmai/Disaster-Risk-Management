from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
from datetime import datetime

class EmergencyBroadcastPayload(BaseModel):
    title: str
    message: str
    hazardType: str = Field(default='general', description="'flood' | 'landslide' | 'weather' | 'evacuation' | 'general'")
    severity: str = Field(default='high', description="'critical' | 'high' | 'medium'")
    targetWard: Any = Field(default='all', description="Ward number (e.g. 1-8) or 'all'")
    channels: List[str] = Field(default=['sms', 'whatsapp'], description="['sms', 'whatsapp']")

class BroadcastRecord(BaseModel):
    id: str
    title: str
    message: str
    hazardType: str
    severity: str
    targetWard: Any
    channels: List[str]
    recipientsCount: int
    status: str
    timestampBs: Optional[str] = None
    timestampIso: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class NotificationStatusResponse(BaseModel):
    module: str = 'notifications'
    status: str = 'operational'
    totalBroadcastsSent: int
    channelsSupported: List[str]

class BroadcastStatsResponse(BaseModel):
    totalAlertsDispatched: int
    totalSmsDelivered: int
    deliverySuccessRate: float = 99.4
    supportedGateways: List[Dict[str, Any]]

class DirectSmsPayload(BaseModel):
    phone: str
    message: str

class EarlyWarningTriggerPayload(BaseModel):
    sensorId: str
    sensorName: str
    wardNumber: int = Field(default=1)
    hazardType: str = Field(default="flood", description="'flood' | 'landslide' | 'weather'")
    measuredValue: float
    unit: str = "m"
    dangerThreshold: float
    sirenActive: bool = True
    smsActive: bool = True

class SettlementAlertPayload(BaseModel):
    settlementId: str
    settlementName: str
    wardNumber: int = Field(default=1)
    hazardType: str = Field(default="पहिरो")
    focalPerson: str
    focalPersonPhone: str
    safeShelterName: Optional[str] = None
    customNote: Optional[str] = None

