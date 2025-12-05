from todo_list import APIRouter, Depends, HTTPException, Session, status, get_db, TodoUser, UserCreate, UserResponse
from passlib.context import CryptContext
from datetime import datetime, timedelta
from todo_list.auth import get_current_user  #로그인한 사용자 가져오기 (JWT)
from sqlalchemy import and_

router = APIRouter(prefix="/users", tags=["users"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#내 정보 조회
@router.get("/me", response_model=UserResponse)
def get_my_info(
    db: Session = Depends(get_db),
    current_user: TodoUser = Depends(get_current_user)
):
    user = db.query(TodoUser).filter(
        TodoUser.id == current_user.id,
        TodoUser.is_deleted == False
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

#회원가입
@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    #중복 이메일 체크
    existing = db.query(TodoUser).filter(TodoUser.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = pwd_context.hash(user.passwd) #비밀번호 해시 (bcrypt)
     
    new_user = TodoUser(email=user.email, passwd=hashed, name=user.name)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


#user 삭제 (soft delete)
@router.delete("/me", status_code=status.HTTP_200_OK)
def delete_my_account(
    db: Session = Depends(get_db),
    current_user: TodoUser = Depends(get_current_user)
):
    user = db.query(TodoUser).filter(
        TodoUser.id == current_user.id,
        TodoUser.is_deleted == False
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found or already deleted")

    user.is_deleted = True
    user.deleted_at = datetime.now()
    db.commit()

    return {"message": "Your account will be completely deleted after 7 days"}


#user 삭제 후 7일 뒤 완전 삭제
@router.delete("/cleanup", include_in_schema=False)
def cleanup_deleted_users(db: Session = Depends(get_db)):
    expired_time = datetime.now() - timedelta(days=7)
    expired_users = db.query(TodoUser).filter(
        and_(TodoUser.is_deleted == True, TodoUser.deleted_at <= expired_time)
    ).all()

    count = len(expired_users)
    for user in expired_users:
        db.delete(user)

    db.commit()
    return {"message": f"{count} users permanently deleted."}
