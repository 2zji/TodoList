from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from .db_connect import SessionLocal, init_db, Todo, TodoUser
from .schemas import TodoCreate, TodoResponse, TodoUpdate, UserCreate, UserResponse
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
@app.post("/users/", response_model=UserResponse)    #schemas로 유효성 검사
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = TodoUser(**user.dict())   #언패킹 기법으로 dict형식을 클래스에 전달
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

#todo 생성
@app.post("/todo/", response_model=TodoResponse)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    db_todo = Todo(**todo.dict())
    db.add(db_todo)
    db.commit() #트랜젝션 처리(커밋 후 refresh)
    db.refresh(db_todo)
    return db_todo

#특정 todo 조회
@app.get("/todo/{todo_id}", response_model=TodoResponse)
def read_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first() #첫번째 항목 반환
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")  #예외처리
    return todo

#todo 수정
@app.put("/todo/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, todo: TodoUpdate, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    for key, value in todo.dict(exclude_unset=True).items():
        setattr(db_todo, key, value)
    db.commit()
    db.refresh(db_todo)
    return db_todo

#todo 삭제
@app.delete("/todo/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(db_todo)
    db.commit()
    return {"detail": "Todo deleted"}

#user 삭제
@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(TodoUser).filter(TodoUser.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"detail": "User deleted"}