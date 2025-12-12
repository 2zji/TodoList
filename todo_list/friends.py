from todo_list import APIRouter, Depends, HTTPException, status, Session, TodoUser, get_db, Friends, Todo, get_current_user, FriendsResponse
from sqlalchemy import or_

router = APIRouter(prefix="/friends", tags=["friends"])

#친구 추가 요청
@router.post("/{addressee_id}", response_model=FriendsResponse)
def send_friend_request(addressee_id: int, db: Session = Depends(get_db), current_user: TodoUser = Depends(get_current_user)):
    if addressee_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot add yourself as a friend")

    #이미 친구 요청 존재하는지 확인
    existing = db.query(Friends).filter(
        or_(
            (Friends.requester_id == current_user.id) & (Friends.addressee_id == addressee_id),
            (Friends.requester_id == addressee_id) & (Friends.addressee_id == current_user.id)
        )
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Friend request already exists or already friends")

    friend_req = Friends(
        requester_id=current_user.id,
        addressee_id=addressee_id,
        status='pending'
    )
    db.add(friend_req)
    db.commit()
    db.refresh(friend_req)
    return friend_req

#친구 요청 수락
@router.put("/{request_id}/accept", response_model=FriendsResponse)
def accept_friend_request(request_id: int, db: Session = Depends(get_db), current_user: TodoUser = Depends(get_current_user)):
    request = db.query(Friends).filter(Friends.id == request_id, Friends.addressee_id == current_user.id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Friend request not found")
    request.status = 'accepted'
    db.commit()
    db.refresh(request)
    return request

#친구 요청 거절
@router.put("/{request_id}/reject", response_model=FriendsResponse)
def reject_friend_request(request_id: int, db: Session = Depends(get_db), current_user: TodoUser = Depends(get_current_user)):
    request = db.query(Friends).filter(Friends.id == request_id, Friends.addressee_id == current_user.id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Friend request not found")
    request.status = 'rejected'
    db.commit()
    db.refresh(request)
    return request

#친구 목록 조회
@router.get("/")
def get_my_friends(db: Session = Depends(get_db), current_user: TodoUser = Depends(get_current_user)):
    friends = db.query(Friends).filter(
        ((Friends.requester_id == current_user.id) | (Friends.addressee_id == current_user.id)),
        Friends.status == 'accepted'
    ).all()

    friend_list = []
    for f in friends:
        friend_id = f.addressee_id if f.requester_id == current_user.id else f.requester_id
        friend_user = db.query(TodoUser).filter(TodoUser.id == friend_id).first()
        friend_list.append({
            "friend_id": friend_user.id,
            "friend_name": friend_user.name,
            "status": f.status,
            "created_at": f.created_at
        })
    return friend_list

#새로 온 친구 요청 목록 조회
@router.get("/requests")
def get_friend_requests(db: Session = Depends(get_db), current_user: TodoUser = Depends(get_current_user)):
    requests = db.query(Friends).filter(
        Friends.addressee_id == current_user.id,
        Friends.status == 'pending'
    ).all()

    result = []
    for req in requests:
        requester = db.query(TodoUser).filter(TodoUser.id == req.requester_id).first()
        result.append({
            "request_id": req.id,
            "requester_name": requester.name,
            "status": req.status,
            "created_at": req.created_at
        })
    return result

#친구 삭제
@router.delete("/{friend_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_friend(friend_id: int, db: Session = Depends(get_db), current_user: TodoUser = Depends(get_current_user)):
    friendship = db.query(Friends).filter(
        or_(
            (Friends.requester_id == current_user.id) & (Friends.addressee_id == friend_id),
            (Friends.requester_id == friend_id) & (Friends.addressee_id == current_user.id)
        ),
        Friends.status == 'accepted'
    ).first()

    if not friendship:
        raise HTTPException(status_code=404, detail="Friendship not found")

    db.delete(friendship)
    db.commit()
    return

#친구의 public todo 목록 조회
@router.get("/{friend_id}/todos")
def get_friend_public_todos(friend_id: int, db: Session = Depends(get_db), current_user: TodoUser = Depends(get_current_user)):
    friendship = db.query(Friends).filter(
        or_(
            ((Friends.requester_id == current_user.id) & (Friends.addressee_id == friend_id)),
            ((Friends.requester_id == friend_id) & (Friends.addressee_id == current_user.id))
        ),
        Friends.status == "accepted"
    ).first()

    if not friendship:
        raise HTTPException(status_code=403, detail="You are not friends with this user")

    todos = db.query(Todo).filter(
        Todo.user_id == friend_id,
        Todo.publicity == True
    ).all()

    return [
        {
            "todo_id": t.id,
            "title": t.title,
            "description": t.description,
            "status": t.status,
            "priority": t.priority,
            "created_at": t.created_at
        }
        for t in todos
    ]

#단일 사용자 상태 조회 API (친구 상태 포함)
@router.get("/checked/{user_id}")
def search_user_status(user_id: int, db: Session = Depends(get_db), current_user: TodoUser = Depends(get_current_user)):
    user = db.query(TodoUser).filter(TodoUser.id == user_id).first()

    if not user:
        return "NOT_FOUND"

    # 자기 자신 검색
    if user.id == current_user.id:
        return {
            "status": "self",
            "user": {"id": user.id, "name": user.name}
        }

    # 기존 친구/요청 상태 조회
    relation = db.query(Friends).filter(
        or_(
            (Friends.requester_id == current_user.id) & (Friends.addressee_id == user_id),
            (Friends.requester_id == user_id) & (Friends.addressee_id == current_user.id)
        )
    ).first()

    if not relation:
        return {
            "status": "none",
            "user": {"id": user.id, "name": user.name}
        }

    return {
        "status": relation.status,
        "user": {"id": user.id, "name": user.name}
    }


@router.get("/todos")
def get_all_friends_public_todos(
    db: Session = Depends(get_db),
    current_user: TodoUser = Depends(get_current_user)
):
    friends = db.query(Friends).filter(
        or_(
            Friends.requester_id == current_user.id,
            Friends.addressee_id == current_user.id
        ),
        Friends.status == "accepted"
    ).all()
    if not friends:
        return []

    result = []

    for f in friends:
        friend_id = f.requester_id if f.requester_id != current_user.id else f.addressee_id

        friend_user = db.query(TodoUser).filter(TodoUser.id == friend_id).first()

        todos = db.query(Todo).filter(
            Todo.user_id == friend_id,
            Todo.publicity == True
        ).all()

        result.append({
            "friend_id": friend_id,
            "friend_name": friend_user.name,
            "todos": [
                {
                    "todo_id": t.id,
                    "title": t.title,
                    "description": t.description,
                    "status": t.status,
                    "priority": t.priority,
                    "publicity": t.publicity,
                    "created_at": t.created_at
                }
                for t in todos
            ]
        })

    return result

