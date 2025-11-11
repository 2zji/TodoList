from todo_list import APIRouter, Depends, HTTPException, status, Session, TodoUser, get_db, Friends, get_current_user, FriendsResponse
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

#내 친구 목록 조회
@router.get("/", response_model=list[FriendsResponse])
def get_my_friends(db: Session = Depends(get_db), current_user: TodoUser = Depends(get_current_user)):
    friends = db.query(Friends).filter(
        ((Friends.requester_id == current_user.id) | (Friends.addressee_id == current_user.id)) &
        (Friends.status == 'accepted')
    ).all()
    return friends

#새로 온 친구 요청 목록 조회
@router.get("/requests", response_model=list[FriendsResponse])
def get_friend_requests(db: Session = Depends(get_db), current_user: TodoUser = Depends(get_current_user)):
    requests = db.query(Friends).filter(
        Friends.addressee_id == current_user.id,
        Friends.status == 'pending'
    ).all()
    return requests

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