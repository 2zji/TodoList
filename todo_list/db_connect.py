from sqlalchemy import create_engine, Column, Integer, String, Text, Enum, DateTime, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime

from fastapi import FastAPI

app = FastAPI(title="TodoList")

DATABASE_URL = "mysql+pymysql://root:111111@localhost:3306/todo_list"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class TodoUser(Base):
    __tablename__ = "todo_user"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True)
    passwd = Column(String(255))
    name = Column(String(50))

class Todo(Base):
    __tablename__ = "todo"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100))
    title = Column(String(100))
    description = Column(Text)
    status = Column(Enum('pending', 'in_progress', 'completed'), default='pending')
    priority = Column(Enum('high', 'medium', 'low'), default='medium')
    created_at = Column(DateTime, default=datetime.now)
    completed_at = Column(DateTime, nullable=True)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#db 초기화(테이블 초기화)
@app.on_event("startup")
def on_startup():
    init_db()