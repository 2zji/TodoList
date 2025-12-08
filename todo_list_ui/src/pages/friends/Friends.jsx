import { useEffect, useState } from "react";
import {
  Box,
  Button,
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
  TextField,
  Pagination,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import api from "../../api/axiosInstance";
import RejectModal from "../common/RejectModal";
import FriendsModal from "../common/FriendsModal";

const styles = {
  container: {
    width: "100%",
    height: "90%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f4f7fb",
    padding: "20px 0px 25px 0px",
  },

  body: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    borderTopLeftRadius: 0,
    padding: "28px 32px",
    boxShadow: "0 6px 10px rgba(0,0,0,0.06), 0 1px 18px rgba(0,0,0,0.08)",
  },

  tableWrap: {
    flex: 1,
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow:
      "0 2px 4px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.05), 0 1px 10px rgba(0,0,0,0.07)",
  },

  button: {
    "&:focus": { outline: "none" },
    "&:focusVisible": { outline: "none", boxShadow: "none" },
  },
};

export default function Friends() {
  const [tab, setTab] = useState(0);
  const [myFriends, setMyFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [checkedFriends, setCheckedFriends] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [friendsPage, setFriendsPage] = useState(1);
  const [friendRequests, setFriendRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [requestsPage, setRequestsPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [targetRejectId, setTargetRejectId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const friendsPerPage = 8;
  const requestsPerPage = 8;

  // Friends 목록 불러오기
  const fetchMyFriends = async () => {
    try {
      const res = await api.get("/friends");
      setMyFriends(res.data);
      setFilteredFriends(res.data);
      setCheckedFriends([]);
      setAllChecked(false);
      setFriendsPage(1);
    } catch (err) {
      console.error("친구 목록 불러오기 실패:", err);
    }
  };

  // 친구 요청 불러오기
  const fetchFriendRequests = async () => {
    try {
      const res = await api.get("/friends/requests");
      setFriendRequests(res.data);
      setFilteredRequests(res.data);
      setRequestsPage(1);
    } catch (err) {
      console.error("친구 요청 실패:", err);
    }
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

  // 선택 삭제
  const deleteFriends = async () => {
    if (checkedFriends.length === 0) return;

    for (const id of checkedFriends) {
      await api.delete(`/friends/${id}`);
    }

    fetchMyFriends();
  };

  // 전체 선택
  const toggleAll = () => {
    if (allChecked) {
      setCheckedFriends([]);
    } else {
      const allIds = filteredFriends.map((f) => f.friend_id);
      setCheckedFriends(allIds);
    }
    setAllChecked(!allChecked);
  };

  // 개별 선택
  const toggleCheck = (id) => {
    let updated = [];

    if (checkedFriends.includes(id)) {
      updated = checkedFriends.filter((v) => v !== id);
    } else {
      updated = [...checkedFriends, id];
    }

    setCheckedFriends(updated);
    setAllChecked(updated.length === filteredFriends.length);
  };

  // 친구 요청 수락
  const handleAccept = async (requestId) => {
    await api.put(`/friends/${requestId}/accept`);
    fetchFriendRequests();
    fetchMyFriends();
  };

  // 거절 모달
  const openRejectModal = (id) => {
    setTargetRejectId(id);
    setRejectModalOpen(true);
  };

  // 친구 요청 거절
  const confirmReject = async () => {
    await api.put(`/friends/${targetRejectId}/reject`);
    setRejectModalOpen(false);
    setSnackbarOpen(true);
    fetchFriendRequests();
  };

  // 검색
  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    if (!keyword) {
      setFilteredFriends(myFriends);
      setFriendsPage(1);
      return;
    }

    // ID 또는 이름으로 필터링
    const filtered = myFriends.filter(
      (f) =>
        f.friend_id.toString() === keyword ||
        f.friend_name.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredFriends(filtered);
    setFriendsPage(1);
  };

  // 날짜 포맷팅
  const formatDate = (dt) => new Date(dt).toLocaleDateString();

  // Pagination
  const displayedFriends = filteredFriends.slice(
    (friendsPage - 1) * friendsPerPage,
    friendsPage * friendsPerPage
  );

  // Pagination
  const displayedRequests = filteredRequests.slice(
    (requestsPage - 1) * requestsPerPage,
    requestsPage * requestsPerPage
  );

  return (
    <Box sx={styles.container}>
      <Box
        sx={{
          width: "calc(90% + 64px)",
          ml: "-32px",
          mr: "-32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 0,
        }}
      >
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          sx={{
            "& .MuiTab-root": { outline: "none" },
            "& .Mui-selected": { fontWeight: 700 },
            /*  backgroundColor: "#ffffff",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            boxShadow:
              "0 3px 5px rgba(0,0,0,0.04), 0 6px 10px rgba(0,0,0,0.06), 0 1px 18px rgba(0,0,0,0.08)",*/
          }}
        >
          <Tab label="My Friends" value={0} />
          <Tab label="Friend Requests" value={1} />
        </Tabs>

        {tab === 0 && (
          <Box sx={{ display: "flex", gap: 1 }}>
            {/* checkbox 삭제 버튼 */}
            {/* <Button
              variant="contained"
              color="error"
              onClick={deleteFriends}
              disabled={checkedFriends.length === 0}
              sx={{
                bgcolor: checkedFriends.length > 0 ? "#e91232" : "#a8a8a8",
                "&:hover": {
                  bgcolor:
                    checkedFriends.length > 0 ? "#d30c2a" : "#a8a8a8",
                },
                ...styles.button,
                width: 40,
                height: 40,
                borderRadius: "50%",
                minWidth: 0,
                padding: 0,
              }}
            >
              <DeleteIcon />
            </Button> */}
          </Box>
        )}
      </Box>

      <Box sx={styles.body}>
        {/* My Friends */}
        {tab === 0 && (
          <Box sx={{ mb: 1.5, display: "flex", gap: 1 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                placeholder="친구 검색 (ID 또는 이름)"
                value={searchKeyword}
                onChange={handleSearch}
                size="small"
                fullWidth
              />
              <Button
                variant="contained"
                onClick={() => {
                  setSearchKeyword("");
                  setFilteredFriends(myFriends);
                  //setFriendsPage(1);
                }}
                sx={styles.button}
              >
                <CloseIcon />
              </Button>
            </Box>
            <Box sx={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
              <Button
                variant="contained"
                color="error"
                onClick={deleteFriends}
                disabled={checkedFriends.length === 0}
                sx={{
                  bgcolor:
                    checkedFriends.length > 0 ? "#EF4444" : "#a8a8a8",
                  "&:hover": {
                    bgcolor:
                      checkedFriends.length > 0 ? "#d30c2a" : "#a8a8a8",
                  },
                  ...styles.button,
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  minWidth: 0,
                  padding: 0,
                }}
              >
                <DeleteIcon />
              </Button>
              <Button
                variant="contained"
                onClick={() => setModalOpen(true)}
                sx={{
                  ...styles.button,
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  minWidth: 0,
                  padding: 0,
                }}
              >
                <AddIcon />
              </Button>
            </Box>
          </Box>
        )}

        {/* My Friends */}
        {tab === 0 && (
          <>
            <TableContainer component={Paper} sx={styles.tableWrap}>
              <Table stickyHeader>
                <TableHead
                  sx={{
                    "& .MuiTableCell-root": {
                      bgcolor: "#f0f4fa",
                      fontWeight: 600,
                      color: "#455a79",
                      fontSize: "15px",
                      padding: "10px",
                    },
                  }}
                >
                  <TableRow>
                    <TableCell align="center" sx={{ width: "5%" }}>
                      {/* 전체 선택 체크박스 */}
                      <Checkbox checked={allChecked} onChange={toggleAll} />
                    </TableCell>
                    <TableCell align="center" sx={{ width: "15%" }}>
                      Friend ID
                    </TableCell>
                    <TableCell align="center" sx={{ width: "20%" }}>
                      Name
                    </TableCell>
                    <TableCell align="center" sx={{ width: "40%" }}>
                      Friend Since
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {displayedFriends.map((f) => (
                    <TableRow key={f.friend_id} hover>
                      <TableCell align="center">
                        <Checkbox
                          checked={checkedFriends.includes(f.friend_id)}
                          onChange={() => toggleCheck(f.friend_id)}
                        />
                      </TableCell>
                      <TableCell align="center">{f.friend_id}</TableCell>
                      <TableCell align="center">{f.friend_name}</TableCell>
                      <TableCell align="center">
                        {formatDate(f.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {displayedFriends.length === 0 && (
                    <TableRow>
                      <TableCell align="center" colSpan={5}>
                        친구가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={Math.ceil(filteredFriends.length / friendsPerPage)}
                page={friendsPage}
                onChange={(e, v) => setFriendsPage(v)}
                color="primary"
              />
            </Box>
          </>
        )}

        {/* Friend Requests */}
        {tab === 1 && (
          <>
            <TableContainer component={Paper} sx={styles.tableWrap}>
              <Table stickyHeader>
                <TableHead
                  sx={{
                    "& .MuiTableCell-root": {
                      bgcolor: "#f0f4fa",
                      fontWeight: 600,
                      color: "#455a79",
                      fontSize: "15px",
                    },
                  }}
                >
                  <TableRow>
                    <TableCell align="center" sx={{ width: "20%" }}>
                      Requester
                    </TableCell>
                    <TableCell align="center" sx={{ width: "50%" }}>
                      Date
                    </TableCell>
                    <TableCell align="center" sx={{ width: "30%" }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {displayedRequests.map((req) => (
                    <TableRow key={req.request_id} hover>
                      <TableCell align="center">{req.requester_name}</TableCell>
                      <TableCell align="center">
                        {formatDate(req.created_at)}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ mr: 1, ...styles.button }}
                          onClick={() => handleAccept(req.request_id)}
                        >
                          <CheckIcon />
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => openRejectModal(req.request_id)}
                          sx={styles.button}
                        >
                          <CloseIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {displayedRequests.length === 0 && (
                    <TableRow>
                      <TableCell align="center" colSpan={3}>
                        새 친구 요청이 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={Math.ceil(filteredRequests.length / requestsPerPage)}
                page={requestsPage}
                onChange={(e, v) => setRequestsPage(v)}
                color="primary"
              />
            </Box>
          </>
        )}
      </Box>

      {/* Modals */}
      <FriendsModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <RejectModal
        open={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          fetchFriendRequests();
        }}
        onConfirm={confirmReject}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          친구 요청이 거절되었습니다.
        </Alert>
      </Snackbar>
    </Box>
  );
}
