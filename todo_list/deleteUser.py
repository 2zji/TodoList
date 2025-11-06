from todo_list import APIRouter, Depends, HTTPException, Session, TodoUser, get_db
router = APIRouter()

#user 삭제
@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(TodoUser).filter(TodoUser.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"detail": "User deleted"}