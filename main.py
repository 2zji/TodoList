from fastapi import FastAPI
from typing import Union
from db_connect import connect_todo_db

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.get("/status")
def read_status():
    return {"status": "ok"}


if __name__ == "__main__":    
	import uvicorn
	uvicorn.run("Main:app", host="0.0.0.0", port=9080, reload=True)