from todo_list import APIRouter, Depends, HTTPException, Session, Todo, get_db, TodoResponse

router = APIRouter()

#특정 todo 조회
@router.get("/todo/{todo_id}", response_model=TodoResponse)
def read_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first() #첫번째 항목 반환
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")  #예외처리
    return todo