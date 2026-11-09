from sqlalchemy import Column, String, Integer, Float, Boolean, Date, DateTime, Numeric, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import datetime
import uuid

class DisasterPreparednessItem(Base):
    """Tracks emergency stock, rescue equipment, shelters, and volunteers."""
    __tablename__ = 'drrm_preparedness_items'
    
    tenant_id = Column(String, index=True, nullable=True)
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    item_type = Column(String, nullable=False) # Rescue Equipment, Relief Stock, Shelter, Ambulance, Volunteer
    name_or_title = Column(String, nullable=False)
    quantity_capacity = Column(Float, default=1.0)
    current_location = Column(String, nullable=True)
    contact_person_id = Column(String, nullable=True) # Employee or Citizen ID
    contact_phone = Column(String, nullable=True)
    status = Column(String, default='Ready') # Ready, Under Maintenance, Deployed
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)


class DisasterIncident(Base):
    """Logs when a disaster actually strikes."""
    __tablename__ = 'drrm_incidents'
    
    tenant_id = Column(String, index=True, nullable=True)
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_type = Column(String, nullable=False) # Flood, Landslide, Fire, Earthquake, Epidemic
    incident_date = Column(DateTime(timezone=True), nullable=False)
    ward_id = Column(String, nullable=True)
    severity = Column(String, default='Medium') # Critical, High, Medium, Low
    description = Column(Text, nullable=False)
    gis_location = Column(JSON, nullable=True) # GeoJSON Point
    status = Column(String, default='Active') # Active, Contained, Closed
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    damage_reports = relationship("IncidentDamageReport", back_populates="incident")
    recovery_projects = relationship("RecoveryProject", back_populates="incident")
    verifications = relationship("IncidentVerification", back_populates="incident")
    lessons_learned = relationship("DisasterLessonsLearned", back_populates="incident")

    def to_dict(self):
        return {
            "id": self.id,
            "tenant_id": self.tenant_id,
            "incident_type": self.incident_type,
            "incident_date": self.incident_date.isoformat() if self.incident_date else None,
            "ward_id": self.ward_id,
            "severity": self.severity,
            "description": self.description,
            "gis_location": self.gis_location,
            "status": self.status,
            "verifications_count": len(self.verifications) if self.verifications else 0,
            "damage_reports_count": len(self.damage_reports) if self.damage_reports else 0,
            "recovery_projects_count": len(self.recovery_projects) if self.recovery_projects else 0,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class IncidentDamageReport(Base):
    """Post-incident rapid assessment for damages and casualties."""
    __tablename__ = 'drrm_damage_reports'
    
    tenant_id = Column(String, index=True, nullable=True)
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_id = Column(String, ForeignKey('drrm_incidents.id'), nullable=False)
    
    affected_household_id = Column(String, nullable=True) # Link to HouseholdMaster
    affected_infrastructure_id = Column(String, nullable=True) # Link to InfrastructureMaster
    
    human_casualties = Column(Integer, default=0)
    injured_count = Column(Integer, default=0)
    estimated_loss_amount = Column(Numeric(15, 2), default=0.00)
    relief_provided = Column(JSON, nullable=True) # Details of immediate relief (cash, food tents)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    incident = relationship("DisasterIncident", back_populates="damage_reports")

    def to_dict(self):
        return {
            "id": self.id,
            "tenant_id": self.tenant_id,
            "incident_id": self.incident_id,
            "incident_description": self.incident.description if self.incident else None,
            "affected_household_id": self.affected_household_id,
            "affected_infrastructure_id": self.affected_infrastructure_id,
            "human_casualties": self.human_casualties or 0,
            "injured_count": self.injured_count or 0,
            "estimated_loss_amount": float(self.estimated_loss_amount or 0),
            "relief_provided": self.relief_provided or {},
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class RecoveryProject(Base):
    """Long-term recovery efforts, linked back to Phase 4 Projects."""
    __tablename__ = 'drrm_recovery_projects'
    
    tenant_id = Column(String, index=True, nullable=True)
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_id = Column(String, ForeignKey('drrm_incidents.id'), nullable=False)
    project_id = Column(String, nullable=True) # FK to Phase 4 ProjectExecution
    
    reconstruction_type = Column(String, nullable=False) # Housing, Road, Health Facility
    beneficiary_household_id = Column(String, nullable=True)
    recovery_status = Column(String, default='Planned') # Planned, In Progress, Completed
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    incident = relationship("DisasterIncident", back_populates="recovery_projects")

    def to_dict(self):
        return {
            "id": self.id,
            "tenant_id": self.tenant_id,
            "incident_id": self.incident_id,
            "incident_type": self.incident.incident_type if self.incident else None,
            "incident_description": self.incident.description if self.incident else None,
            "ward_id": self.incident.ward_id if self.incident else None,
            "project_id": self.project_id,
            "reconstruction_type": self.reconstruction_type,
            "beneficiary_household_id": self.beneficiary_household_id,
            "recovery_status": self.recovery_status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class IncidentVerification(Base):
    """
    Formal Incident Verification Workflow [DOM-01]:
    Enables authorized Ward Officers or LEOC Commanders to verify reported incidents,
    adjust severity, assess authenticity, and approve for emergency dispatch.
    """
    __tablename__ = 'drrm_incident_verifications'
    __table_args__ = {'extend_existing': True}
    
    tenant_id = Column(String, index=True, nullable=True)
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_id = Column(String, ForeignKey('drrm_incidents.id'), nullable=False)
    
    verification_status = Column(String, default='VERIFIED')  # VERIFIED, REJECTED, ESCALATED, UNDER_REVIEW
    verified_by_user_id = Column(String, nullable=True)
    verified_by_name = Column(String, nullable=False)
    verified_by_role = Column(String, nullable=True)
    
    original_severity = Column(String, nullable=True)
    confirmed_severity = Column(String, nullable=False)
    
    is_life_safety_threat = Column(Boolean, default=False)
    immediate_action_required = Column(String, nullable=True)  # SAR Dispatch, Evacuation, Relief, Alert Sirens
    verification_notes = Column(Text, nullable=True)
    
    verified_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    incident = relationship("DisasterIncident", back_populates="verifications")

    def to_dict(self):
        return {
            "id": self.id,
            "tenant_id": self.tenant_id,
            "incident_id": self.incident_id,
            "verification_status": self.verification_status,
            "verified_by_user_id": self.verified_by_user_id,
            "verified_by_name": self.verified_by_name,
            "verified_by_role": self.verified_by_role,
            "original_severity": self.original_severity,
            "confirmed_severity": self.confirmed_severity,
            "is_life_safety_threat": bool(self.is_life_safety_threat),
            "immediate_action_required": self.immediate_action_required,
            "verification_notes": self.verification_notes or "",
            "verified_at": self.verified_at.isoformat() if self.verified_at else None,
        }


class DisasterLessonsLearned(Base):
    """
    Post-Disaster After Action Review (AAR) & Lessons Learned [DOM-01]:
    Completes the Sendai Framework Disaster Lifecycle.
    Documents operational successes, response bottlenecks, and policy recommendations.
    """
    __tablename__ = 'drrm_lessons_learned'
    __table_args__ = {'extend_existing': True}
    
    tenant_id = Column(String, index=True, nullable=True)
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_id = Column(String, ForeignKey('drrm_incidents.id'), nullable=False)
    
    title = Column(String, nullable=False)
    disaster_type = Column(String, nullable=True)
    lead_evaluator = Column(String, nullable=False)
    
    response_strengths = Column(Text, nullable=True)
    challenges_faced = Column(Text, nullable=True)
    policy_recommendations = Column(Text, nullable=True)
    infrastructure_improvements = Column(Text, nullable=True)
    overall_rating = Column(String, default='Satisfactory')  # Exemplary, Satisfactory, Needs Improvement
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    incident = relationship("DisasterIncident", back_populates="lessons_learned")

    def to_dict(self):
        return {
            "id": self.id,
            "tenant_id": self.tenant_id,
            "incident_id": self.incident_id,
            "title": self.title,
            "disaster_type": self.disaster_type,
            "lead_evaluator": self.lead_evaluator,
            "response_strengths": self.response_strengths or "",
            "challenges_faced": self.challenges_faced or "",
            "policy_recommendations": self.policy_recommendations or "",
            "infrastructure_improvements": self.infrastructure_improvements or "",
            "overall_rating": self.overall_rating,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
