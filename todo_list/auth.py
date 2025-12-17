from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
from typing import Optional
from os import getenv
from dotenv import load_dotenv
from todo_list.db_connect import get_db, get_active_db, ActiveSession, TodoUser
from todo_list.schemas import UserLogin

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

load_dotenv()

SECRET_KEY = getenv("SECRET_KEY", "fallback_secret_key")
ALGORITHM = "HS256"  # JWT 토큰 암호화 알고리즘(대칭키)
ACCESS_TOKEN_EXPIRE_MINUTES = int(getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 토큰 유효 시간(24시간/하루)

# JWT 토큰 추출용 OAuth2 스키마
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# 토큰 생성 함수
def create_access_token(subject: str, expires_delta: int | None = None):
    expire = datetime.now() + timedelta(minutes=(expires_delta or ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode = {"sub": subject, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# 로그인 API
@router.post("/login")
def login(form_data: UserLogin, db: ActiveSession = Depends(get_active_db)):
    # ActiveSession이 is_deleted=False 필터링
    user = db.query(TodoUser).filter(TodoUser.email == form_data.email).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if not pwd_context.verify(form_data.passwd, user.passwd):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer"}

# 현재 로그인한 사용자 정보 반환
def get_current_user(token: str = Depends(oauth2_scheme), db: ActiveSession = Depends(get_active_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # JWT 디코딩
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: Optional[str] = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # ActiveSession이 is_deleted=False 필터링
    user = db.query(TodoUser).filter(TodoUser.email == email).first()

    if user is None:
        raise credentials_exception

    return user