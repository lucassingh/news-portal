from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy import Enum as SQLEnum
from app.database import Base

from enum import Enum as PyEnum

class UserRole(str, PyEnum):
    ADMIN = "admin"
    USER = "user"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(200))
    is_active = Column(Boolean, default=True)
    role = Column(SQLEnum(UserRole), default=UserRole.USER)

    class Config:
        from_attributes = True
        json_encoders = {
            UserRole: lambda v: v.value
        }
    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role.value if self.role else None,
            "is_active": self.is_active
        }