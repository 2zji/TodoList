from todo_list import APIRouter, Depends, status, Session, Todo, TodoUser, get_db, TodoCreate, TodoResponse
from todo_list.auth import get_current_user

router = APIRouter(prefix="/todo", tags=["todo"])

#todo 생성
@router.post("/", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db), current_user: TodoUser = Depends(get_current_user)):
    new_todo = Todo(**todo.model_dump(), user_id=current_user.id)
    db.add(new_todo)
    db.commit() #트랜젝션 처리(커밋 후 refresh)
    db.refresh(new_todo)
    return new_todo