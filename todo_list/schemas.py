from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

#Todo 스키마
class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "pending"
    priority: Optional[str] = "medium"

class TodoCreate(TodoBase):
#Todo 생성 시 요청 본문
    pass

class TodoUpdate(BaseModel):
#Todo 수정 시 요청 본문
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None

class TodoResponse(TodoBase):
#Todo 조회 시 응답
    id: int
    created_at: datetime
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

#User 스키마
class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None

class UserCreate(UserBase):
#회원가입 요청 본문
    passwd: str

class UserResponse(UserBase):
#회원정보 응답
    id: int

    model_config = ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
#로그인 요청
    email: EmailStr
    passwd: str

#JWT  스키마
class Token(BaseModel):
#로그인 성공 시 토큰 반환
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
#JWT payload 데이터
    email: Optional[str] = None
