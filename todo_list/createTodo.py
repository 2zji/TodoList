from todo_list import APIRouter, Depends, Session, Todo, get_db, TodoCreate, TodoResponse

router = APIRouter()

#todo 생성
@router.post("/todo/", response_model=TodoResponse)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    db_todo = Todo(**todo.model_dump())
    db.add(db_todo)
    db.commit() #트랜젝션 처리(커밋 후 refresh)
    db.refresh(db_todo)
    return db_todo