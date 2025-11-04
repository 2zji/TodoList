from fastapi import FastAPI
from .createTodo import router as create_router
from .readTodo import router as read_router
from .updateTodo import router as update_router
from .deleteTodo import router as delete_router
from .createUser import router as create_user
from .deleteUser import router as delete_user
from .auth import router as auth_router

app = FastAPI(title="TodoList")

app.include_router(create_router)
app.include_router(read_router)
app.include_router(update_router)
app.include_router(delete_router)
app.include_router(create_user)
app.include_router(delete_user)
app.include_router(auth_router)