import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Snackbar,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import api from "../../api/axiosInstance";
import RejectModal from "../common/RejectModal";

export default function Friends() {
  const [tab, setTab] = useState(0);

  const [myFriends, setMyFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  const [searchId, setSearchId] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [targetRejectId, setTargetRejectId] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const styles = {
    button: {
      "&:focus": {
        outline: "none",
      },
      "&:focusVisible": {
        outline: "none",
        boxShadow: "none",
      },
    },
  };

  // Friends 목록 불러오기
  const fetchMyFriends = async (type) => {
    try {
      const res = await api.get("/friends");
      // setMyFriends(res.data);
      // 단일 검색
      if (!type) setMyFriends(res.data);
      else {
      }
    } catch (err) {
      console.error("친구 목록 에러:", err);
    }
  };

  // 친구 요청 목록
  const fetchFriendRequests = async () => {
    const res = await api.get("/friends/requests");
    setFriendRequests(res.data);
  };

  useEffect(() => {
    fetchMyFriends();
    fetchFriendRequests();
  }, []);

  // 친구 삭제
  const handleDeleteFriend = async (friendId) => {
    await api.delete(`/friends/${friendId}`);
    fetchMyFriends();
  };

  // 친구 요청 수락
  const handleAccept = async (requestId) => {
    await api.put(`/friends/${requestId}/accept`);
    fetchFriendRequests();
    fetchMyFriends();
  };

  // 모달 열기
  const openRejectModal = (id) => {
    setTargetRejectId(id);
    setRejectModalOpen(true);
  };

  // 실제 거절 확정
  const confirmReject = async () => {
    await api.put(`/friends/${targetRejectId}/reject`);
    setRejectModalOpen(false);
    setSnackbarOpen(true);
    fetchFriendRequests();
  };

  // 친구 검색
  const handleSearch = async () => {
    if (!searchId) return;

    try {
      const res = await api.get(`/friends/checked/${searchId}`);

      setSearchedUser(res.data); // 전체 객체 저장
    } catch (err) {
      console.error(err);
    }
  };

  // 친구 신청
  const handleSendRequest = async () => {
    if (!searchedUser || searchedUser === "NOT_FOUND") return;

    try {
      await api.post(`/friends/${searchedUser.user.id}`);
      alert("친구 요청을 보냈습니다!");
    } catch (err) {
      alert("요청 실패");
    }
  };

  // 날짜 포맷
  const formatDate = (dt) => {
    return new Date(dt).toLocaleDateString();
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* 탭 버튼 */}
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        sx={{ mb: 3, "& .MuiTab-root": { outline: "none" } }}
      >
        <Tab label="My Friends" value={0} />
        <Tab label="Friend Requests" value={1} />
        <Tab label="Add Friends" value={2} />
      </Tabs>

      {/* My friends */}
      {tab === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Friend ID</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Friend Since</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {myFriends.map((f) => (
                <TableRow key={f.friend_id}>
                  <TableCell align="center">{f.friend_id}</TableCell>
                  <TableCell align="center">{f.friend_name}</TableCell>
                  <TableCell align="center">
                    {formatDate(f.created_at)}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => handleDeleteFriend(f.friend_id)}
                      sx={styles.button}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {myFriends.length === 0 && (
                <TableRow>
                  <TableCell align="center" colSpan={4}>
                    친구가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Friend Requests */}
      {tab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Requester</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {friendRequests.map((req) => (
                <TableRow key={req.request_id}>
                  <TableCell align="center">{req.requester_name}</TableCell>
                  <TableCell align="center">
                    {formatDate(req.created_at)}
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      sx={{ mr: 1, ...styles.button }}
                      onClick={() => handleAccept(req.request_id)}
                    >
                      Accept
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => openRejectModal(req.request_id)}
                      sx={styles.button}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {friendRequests.length === 0 && (
                <TableRow>
                  <TableCell align="center" colSpan={3}>
                    새 친구 요청이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Friends */}
      {tab === 2 && (
        <Box>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              placeholder="Search User ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={styles.button}
            >
              Search
            </Button>
          </Box>

          {/* 검색 결과 */}
          {searchedUser && searchedUser !== "NOT_FOUND" && (
            <Paper sx={{ p: 3 }}>
              <Typography>ID: {searchedUser.user.id}</Typography>
              <Typography>Name: {searchedUser.user.name}</Typography>

              {/* 상태별 안내 메시지 */}
              {searchedUser.status === "accepted" && (
                <Typography color="primary" sx={{ mt: 1 }}>
                  이미 추가된 친구입니다.
                </Typography>
              )}

              {searchedUser.status === "pending" && (
                <Typography color="warning.main" sx={{ mt: 1 }}>
                  친구 추가 대기중입니다.
                </Typography>
              )}

              {searchedUser.status === "rejected" && (
                <Typography color="error" sx={{ mt: 1 }}>
                  관리자에게 문의 바랍니다.
                </Typography>
              )}

              {/* 친구 신청 버튼 (none일 때만 활성화) */}
              {searchedUser.status === "none" && (
                <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleSendRequest}
                    sx={styles.button}
                  >
                    친구 신청
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setSearchedUser(null)}
                    sx={styles.button}
                  >
                    취소
                  </Button>
                </Box>
              )}
            </Paper>
          )}

          {searchedUser === "NOT_FOUND" && (
            <Typography color="error">존재하지 않는 ID입니다.</Typography>
          )}
        </Box>
      )}

      {/* 거절 모달 */}
      <RejectModal
        open={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          fetchFriendRequests();
        }}
        onConfirm={confirmReject}
      />

      {/* snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          친구 요청이 거절되었습니다.
        </Alert>
      </Snackbar>
    </Box>
  );
}
