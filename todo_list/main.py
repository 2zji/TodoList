from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from db_connect import SessionLocal, init_db, Todo, TodoUser
import schemas
from typing import List

app = FastAPI(title="TodoList")

#db 연결
def get_db():
    db = SessionLocal()
    try:
        yield db    #의존성 주입
    finally:
        db.close()

#db 초기화(테이블 초기화)
@app.on_event("startup")
def on_startup():
    init_db()


#user 생성
@app.post("/users", response_model=schemas.UserResponse)    #schemas로 유효성 검사
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = TodoUser(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

#todo 생성
@app.post("/todo", response_model=schemas.TodoResponse)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    db_todo = Todo(**todo.dict())
    db.add(db_todo)
    db.commit() #트랜젝션 처리(커밋 후 refresh)
    db.refresh(db_todo)
    return db_todo

