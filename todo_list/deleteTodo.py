from todo_list import APIRouter, Depends, HTTPException, status, Session, Todo, TodoUser, get_db
from todo_list.auth import get_current_user

router = APIRouter(prefix="/todo", tags=["todo"])

#todo 삭제 (인증된 사용자만)
@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int, db: Session = Depends(get_db), current_user: TodoUser = Depends(get_current_user)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    if todo.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this todo")

    db.delete(todo)
    db.commit()
    return