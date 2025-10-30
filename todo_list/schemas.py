from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class TodoBase(BaseModel):
    email: EmailStr
    title: str
    description: Optional[str] = None
    status: Optional[str] = "pending"
    priority: Optional[str] = "medium"


class TodoCreate(TodoBase):
    pass


class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None


class TodoResponse(TodoBase):
    id: int
    created_at: datetime
    completed_at: Optional[datetime]

    class Config:
        orm_mode = True


class UserCreate(BaseModel):
    email: EmailStr
    passwd: str
    name: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: Optional[str] = None

    class Config:
        orm_mode = True
