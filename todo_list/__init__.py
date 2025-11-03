from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .db_connect import SessionLocal, get_db, Todo, TodoUser
from .schemas import TodoCreate, TodoResponse, TodoUpdate, UserCreate, UserResponse