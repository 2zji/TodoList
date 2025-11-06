from todo_list import APIRouter, Depends, HTTPException, status, Session, Todo, TodoUser, get_db, TodoResponse, TodoUpdate
from todo_list.auth import get_current_user

router = APIRouter(prefix="/todo", tags=["todo"])

#todo 수정 (인증된 사용자만)
@router.put("/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, todo_data: TodoUpdate, db: Session = Depends(get_db), current_user: TodoUser = Depends(get_current_user)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    if todo.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this todo")

    for key, value in todo_data.model_dump(exclude_unset=True).items():
        setattr(todo, key, value)

    db.commit()
    db.refresh(todo)
    return todo