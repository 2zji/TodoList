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
    title: Optional[str]
    description: Optional[str]
    status: Optional[str]
    priority: Optional[str]


class TodoResponse(TodoBase):
    id: int
    created_at: datetime
    completed_at: Optional[datetime]

    class Config:
        orm_mode = True


class UserCreate(BaseModel):
    email: EmailStr
    passwd: str
    name: Optional[str]


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: Optional[str]

    class Config:
        orm_mode = True
