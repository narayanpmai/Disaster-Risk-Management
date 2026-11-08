from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any, Union
from datetime import datetime
from uuid import UUID
from models.user import UserRole


# ─── Auth Schemas ────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str
    tenant_subdomain: Optional[str] = None


class PublicRegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    phone: Optional[str] = None
    registration_type: UserRole = UserRole.PUBLIC_CITIZEN
    specific_details: Optional[Any] = None


class RefreshTokenRequest(BaseModel):
    user_id: str
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    tenant_subdomain: Optional[str] = None
    user: Any


# ─── User Schemas ────────────────────────────────────────────────────────────

class UserBase(BaseModel):
    email: str
    full_name: str
    phone: Optional[str] = None
    role: Optional[UserRole] = UserRole.PUBLIC
    ward_number: Optional[int] = None
    tenant_id: Optional[str] = None
    is_active: Optional[bool] = True
    email_verified: Optional[bool] = False


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[UserRole] = None
    ward_number: Optional[int] = None
    is_active: Optional[bool] = None
    email_verified: Optional[bool] = None
    password: Optional[str] = None
    profile_photo: Optional[str] = None
    preferences: Optional[Any] = None


class UserSchema(UserBase):
    id: Union[str, UUID]
    profile_photo: Optional[str] = None
    last_login_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserPublicSchema(BaseModel):
    id: Union[str, UUID]
    email: str
    full_name: str
    role: Optional[str] = None
    ward_number: Optional[int] = None
    is_active: Optional[bool] = None
    created_at: Optional[datetime] = None
    last_login_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Role Schemas ────────────────────────────────────────────────────────────

class RoleSchema(BaseModel):
    id: Union[str, UUID]
    name: str
    description: Optional[str] = None
    permissions: Optional[List[str]] = None
    tenant_id: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class RolePermissionsUpdate(BaseModel):
    permissions: List[str]
