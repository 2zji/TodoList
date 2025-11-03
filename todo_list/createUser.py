from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .db_connect import TodoUser, get_db
from .schemas import UserCreate, UserResponse

router = APIRouter()

#user 생성
@router.post("/users/", response_model=UserResponse)    #schemas로 유효성 검사
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = TodoUser(**user.model_dump())   #언패킹 기법으로 dict형식을 클래스에 전달
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
