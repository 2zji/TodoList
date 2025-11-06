from todo_list import APIRouter, Depends, HTTPException, Session, status, get_db, TodoUser, UserCreate, UserResponse
from passlib.context import CryptContext

router = APIRouter(prefix="/users", tags=["users"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # 중복 이메일 체크
    existing = db.query(TodoUser).filter(TodoUser.email == user.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    hashed = pwd_context.hash(user.passwd)  #비밀번호 해시 (bcrypt)

    new_user = TodoUser(email=user.email, passwd=hashed, name=user.name)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

