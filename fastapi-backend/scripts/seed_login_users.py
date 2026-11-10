import uuid
from datetime import datetime
from core.database import SessionLocal
from core.security import hash_password
from models.user import User

def seed_accounts():
    db = SessionLocal()
    tenant_id = "f07c2bcc-81ad-4e27-aeff-1a65f04e9f06" # panchpokhari
    password_hash = hash_password("Admin@P5Digital2024!")

    accounts = [
        ("admin@p5digital.local", "super_admin", "DRRM System Administrator"),
        ("admin@panchpokhari.gov.np", "super_admin", "प्रशासक (DRRM Admin)"),
        ("super_admin@p5digital.local", "super_admin", "P5 Digital Super Admin"),
        ("cao@panchpokhari.gov.np", "cao", "प्रमुख प्रशासकीय अधिकृत (CAO)"),
        ("cao@p5digital.local", "cao", "प्रमुख प्रशासकीय अधिकृत (CAO)"),
        ("disaster_officer@panchpokhari.gov.np", "disaster_officer", "विपद् व्यवस्थापन अधिकृत"),
        ("disaster_officer@p5digital.local", "disaster_officer", "विपद् व्यवस्थापन अधिकृत"),
        ("it_admin@panchpokhari.gov.np", "it_admin", "सूचना प्रविधि अधिकृत (IT Admin)"),
        ("it_admin@p5digital.local", "it_admin", "सूचना प्रविधि अधिकृत (IT Admin)"),
    ]

    for email, role, full_name in accounts:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(
                id=str(uuid.uuid4()),
                tenant_id=tenant_id,
                email=email,
                password=password_hash,
                full_name=full_name,
                role=role,
                is_active=True,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.add(user)
            print(f"Created: {email}")
        else:
            user.password = password_hash
            user.is_active = True
            user.tenant_id = tenant_id
            user.role = role
            user.full_name = full_name
            db.add(user)
            print(f"Updated: {email}")

    db.commit()
    db.close()
    print("All disaster management auth accounts verified successfully!")

if __name__ == "__main__":
    seed_accounts()

