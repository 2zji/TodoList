from fastapi import FastAPI
from todo_list import createTodo, readTodo, updateTodo, deleteTodo, createUser, deleteUser, auth

app = FastAPI()

app.include_router(createUser.router)
app.include_router(auth.router)
app.include_router(createTodo.router)
app.include_router(readTodo.router)
app.include_router(updateTodo.router)
app.include_router(deleteTodo.router)
app.include_router(deleteUser.router)