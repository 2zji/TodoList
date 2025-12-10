from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from todo_list import Like, Friends, Todo, TodoUser, get_db, get_current_user, LikeResponse

router = APIRouter(prefix="/like", tags=["like"])

#내가 좋아요한 todo 목록 조회
@router.get("/my")
def get_my_liked_todo_detail(db: Session = Depends(get_db), current_user: TodoUser = Depends(get_current_user)):
    liked_todos = db.query(Like).filter(Like.user_id == current_user.id).all()

    if not liked_todos:
        return []

    result = []
    for like in liked_todos:
        todo = db.query(Todo).filter(Todo.id == like.todo_id).first()
        if todo:
            friend = db.query(TodoUser).filter(TodoUser.id == todo.user_id).first()
            likes_count = db.query(Like).filter(Like.todo_id == todo.id).count()
            result.append({
                "todo_id": todo.id,
                "friend_name": friend.name if friend else "Unknown",
                "title": todo.title,
                "description": todo.description,
                "status": todo.status,
                "priority": todo.priority,
                "created_at": todo.created_at,
                "likes_count": likes_count
            })

    return result


#좋아요 추가
@router.post("/{todo_id}", response_model=LikeResponse)
def add_like(todo_id: int, db: Session = Depends(get_db), current_user: TodoUser = Depends(get_current_user)):
    todo = db.query(Todo).filter(Todo.id == todo_id, Todo.publicity == True).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found or not public")

    #친구 관계인지 확인
    is_friend = db.query(Friends).filter(
        (
            ((Friends.requester_id == current_user.id) & (Friends.addressee_id == todo.user_id)) |
            ((Friends.requester_id == todo.user_id) & (Friends.addressee_id == current_user.id))
        ),
        Friends.status == 'accepted'
    ).first()

    if not is_friend:
        raise HTTPException(status_code=403, detail="Only friends can like this todo")

    existing_like = db.query(Like).filter(Like.user_id == current_user.id, Like.todo_id == todo_id).first()
    if existing_like:
        raise HTTPException(status_code=400, detail="Already liked this todo")

    like = Like(user_id=current_user.id, todo_id=todo_id)
    db.add(like)
    db.commit()

    likes_count = db.query(Like).filter(Like.todo_id == todo_id).count()
    return LikeResponse(todo_id=todo_id, likes_count=likes_count)

#좋아요 취소
@router.delete("/{todo_id}", response_model=LikeResponse)
def remove_like(todo_id: int, db: Session = Depends(get_db), current_user: TodoUser = Depends(get_current_user)):
    like = db.query(Like).filter(Like.user_id == current_user.id, Like.todo_id == todo_id).first()
    if not like:
        raise HTTPException(status_code=404, detail="Like not found")
    db.delete(like)
    db.commit()
    likes_count = db.query(Like).filter(Like.todo_id == todo_id).count()
    return LikeResponse(todo_id=todo_id, likes_count=likes_count)

#공개된 todo 좋아요 개수 조회
@router.get("/{todo_id}", response_model=LikeResponse)
def get_likes_count(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id, Todo.publicity == True).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found or not public")

    likes_count = db.query(Like).filter(Like.todo_id == todo_id).count()
    return LikeResponse(todo_id=todo_id, likes_count=likes_count)

# 좋아요 상태 확인
@router.get("/check/{todo_id}")
def check_like_status(
    todo_id: int, 
    db: Session = Depends(get_db), 
    current_user: TodoUser = Depends(get_current_user)
):
    like = db.query(Like).filter(
        Like.user_id == current_user.id,
        Like.todo_id == todo_id
    ).first()
    
    return {"is_liked": like is not None}