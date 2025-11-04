from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt

from todo_list.db_connect import get_db, TodoUser
from todo_list.schemas import UserLogin

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

from os import getenv
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = getenv("SECRET_KEY", "fallback_secret_key")
ALGORITHM = "HS256" #JWT 토큰 암호화 알고리즘(대칭키)
ACCESS_TOKEN_EXPIRE_MINUTES = int(getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))    #토큰 유효 시간을 24시간으로 설정(하루)

def create_access_token(subject: str, expires_delta: int | None = None):
    expire = datetime.now() + timedelta(minutes=(expires_delta or ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode = {"sub": subject, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/login")
def login(form_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(TodoUser).filter(TodoUser.email == form_data.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if not pwd_context.verify(form_data.password, user.passwd):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer"}
