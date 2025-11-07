from sqlalchemy import create_engine, Column, Integer, String, Text, Enum, DateTime, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from datetime import datetime
from dotenv import load_dotenv
import os

from fastapi import FastAPI

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")

app = FastAPI(title="TodoList")

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

#사용자 테이블
class TodoUser(Base):
    __tablename__ = "todo_user"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True)
    passwd = Column(String(255))
    name = Column(String(50))
    is_deleted = Column(Boolean, default=False)  #soft delete
    deleted_at = Column(DateTime, nullable=True)  #삭제된 시간
    
    #1:N 관계 설정
    todos = relationship("Todo", back_populates="user", cascade="all, delete-orphan")

#투두 테이블
class Todo(Base):
    __tablename__ = "todo"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100))
    description = Column(Text)
    status = Column(Enum('pending', 'in_progress', 'completed'), default='pending')
    priority = Column(Enum('high', 'medium', 'low'), default='medium')
    created_at = Column(DateTime, default=datetime.now)
    completed_at = Column(DateTime, nullable=True)

    #로그인한 사용자 연결용 외래키
    user_id = Column(Integer, ForeignKey("todo_user.id"), nullable=False)

    #관계 설정
    user = relationship("TodoUser", back_populates="todos")

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