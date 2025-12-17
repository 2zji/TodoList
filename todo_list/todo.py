from todo_list import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    Session,
    Todo,
    TodoUser,
    get_db,
    TodoCreate,
    TodoResponse,
    TodoUpdate,
)
from todo_list.auth import get_current_user

router = APIRouter(prefix="/todo", tags=["todo"])

# todo 생성
@router.post("/", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(
    todo: TodoCreate,
    db: Session = Depends(get_db),
    current_user: TodoUser = Depends(get_current_user),
):
    new_todo = Todo(**todo.model_dump(), user_id=current_user.id)
    db.add(new_todo)
    db.commit()  # 트랜젝션 처리(커밋 후 refresh)
    db.refresh(new_todo)
    return new_todo

# #특정 todo 조회
# @router.get("/todo/{todo_id}", response_model=TodoResponse)
# def read_todo(todo_id: int, db: Session = Depends(get_db)):
#     todo = db.query(Todo).filter(Todo.id == todo_id).first() #첫번째 항목 반환
#     if todo is None:
#         raise HTTPException(status_code=404, detail="Todo not found")  #예외처리
#     return todo

# 내 todo 목록 조회
@router.get("/", response_model=list[TodoResponse])
def read_my_todos(
    db: Session = Depends(get_db), current_user: TodoUser = Depends(get_current_user)
):
    todo = db.query(Todo).filter(Todo.user_id == current_user.id).all()
    return todo

# todo 수정 (인증된 사용자만)
@router.put("/{todo_id}", response_model=TodoResponse)
def update_todo(
    todo_id: int,
    todo_data: TodoUpdate,
    db: Session = Depends(get_db),
    current_user: TodoUser = Depends(get_current_user),
):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    if todo.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to modify this todo"
        )

    for key, value in todo_data.model_dump(exclude_unset=True).items():
        setattr(todo, key, value)

    db.commit()
    db.refresh(todo)
    return todo

# todo 삭제 (인증된 사용자만)
@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: TodoUser = Depends(get_current_user),
):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    if todo.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to delete this todo"
        )

    db.delete(todo)
    db.commit()
    return

# 내 공개된 todo 목록 조회
@router.get("/my/public", response_model=list[TodoResponse])
def read_my_public_todos(
    db: Session = Depends(get_db), current_user: TodoUser = Depends(get_current_user)
):
    todos = (
        db.query(Todo)
        .filter(Todo.user_id == current_user.id, Todo.publicity == True)
        .all()
    )
    return todos

# 내 비공개된 todo 목록 조회
@router.get("/my/private", response_model=list[TodoResponse])
def read_my_private_todos(
    db: Session = Depends(get_db), current_user: TodoUser = Depends(get_current_user)
):
    todos = (
        db.query(Todo)
        .filter(Todo.user_id == current_user.id, Todo.publicity == False)
        .all()
    )
    return todos
