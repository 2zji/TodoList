from fastapi import FastAPI
from sqlalchemy import UniqueConstraint, create_engine, Column, Integer, String, Text, Enum, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")

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
    likes = relationship("Like", back_populates="user", cascade="all, delete-orphan")
    sent_requests = relationship("Friends", foreign_keys="[Friends.requester_id]", back_populates="requester")
    received_requests = relationship("Friends", foreign_keys="[Friends.addressee_id]", back_populates="addressee")


#투두 테이블
class Todo(Base):
    __tablename__ = "todo"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(100))
    description = Column(Text)
    status = Column(Enum('pending','in_progress','completed'), default='pending')
    priority = Column(Enum('high','medium','low'), default='medium')
    is_public = Column(Boolean, default=False)  #공개 여부
    created_at = Column(DateTime, default=datetime.now)
    completed_at = Column(DateTime, nullable=True)

    #로그인한 사용자 연결용 외래키
    user_id = Column(Integer, ForeignKey("todo_user.id", ondelete="CASCADE"), nullable=False)

    #관계 설정
    user = relationship("TodoUser", back_populates="todos")
    likes = relationship("Like", back_populates="todo", cascade="all, delete-orphan")

#친구 테이블
class Friends(Base):
    __tablename__ = "friends"
    id = Column(Integer, primary_key=True, index=True)
    requester_id = Column(Integer, ForeignKey("todo_user.id", ondelete="CASCADE"))
    addressee_id = Column(Integer, ForeignKey("todo_user.id", ondelete="CASCADE"))
    status = Column(Enum("pending", "accepted", "rejected"), default="pending")
    created_at = Column(DateTime, default=datetime.now)

    __table_args__ = (UniqueConstraint('requester_id','addressee_id', name='uq_friend_pair'),)

    requester = relationship("TodoUser", foreign_keys=[requester_id], back_populates="sent_requests")
    addressee = relationship("TodoUser", foreign_keys=[addressee_id], back_populates="received_requests")

#좋아요 테이블
class Like(Base):
    __tablename__ = "likes"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("todo_user.id", ondelete="CASCADE"), nullable=False)
    todo_id = Column(Integer, ForeignKey("todo.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.now)

    __table_args__ = (UniqueConstraint('user_id','todo_id', name='uq_user_todo_like'),)

    user = relationship("TodoUser", back_populates="likes")
    todo = relationship("Todo", back_populates="likes")

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
