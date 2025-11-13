from fastapi import FastAPI
from todo_list import auth, todo, user, friends, like
from contextlib import asynccontextmanager
from todo_list.db_connect import init_db

#db 초기화(테이블 초기화)
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(todo.router)
app.include_router(friends.router)
app.include_router(like.router)
