from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from db_connect import SessionLocal, init_db, Todo, TodoUser
import schemas
from typing import List

app = FastAPI(title="TodoList")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.on_event("startup")
def on_startup():
    init_db()



@app.post("/users", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = TodoUser(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user



@app.post("/todo", response_model=schemas.TodoResponse)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    db_todo = Todo(**todo.dict())
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

