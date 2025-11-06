from todo_list import APIRouter, Depends, HTTPException, Session, Todo, get_db, Todo, TodoUser, TodoResponse
from todo_list.auth import get_current_user

router = APIRouter(prefix="/todo", tags=["todo"])

# #특정 todo 조회
# @router.get("/todo/{todo_id}", response_model=TodoResponse)
# def read_todo(todo_id: int, db: Session = Depends(get_db)):
#     todo = db.query(Todo).filter(Todo.id == todo_id).first() #첫번째 항목 반환
#     if todo is None:
#         raise HTTPException(status_code=404, detail="Todo not found")  #예외처리
#     return todo

#내 todo 목록 조회
@router.get("/", response_model=list[TodoResponse])
def read_my_todos(db: Session = Depends(get_db), current_user: TodoUser = Depends(get_current_user)):
    todo = db.query(Todo).filter(Todo.user_id == current_user.id).all()
    return todo