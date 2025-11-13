FROM python:3.14-alpine

WORKDIR /app

COPY ./todo_list /app/todo_list
COPY ./pyproject.toml /app/pyproject.toml

RUN pip install .

CMD uvicorn todo_list.main:app --host 0.0.0.0 --port 8000 --reload
