from fastapi import FastAPI
from todo_list import auth, todo, user

app = FastAPI()

app.include_router(auth.router)
app.include_router(todo.router)
app.include_router(user.router)