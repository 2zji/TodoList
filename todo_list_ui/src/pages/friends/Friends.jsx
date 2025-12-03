import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
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
    padding: "28px 32px",
    boxShadow:
      "0 3px 5px rgba(0,0,0,0.04), 0 6px 10px rgba(0,0,0,0.06), 0 1px 18px rgba(0,0,0,0.08)",
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
  const [friendRequests, setFriendRequests] = useState([]);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [targetRejectId, setTargetRejectId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]);

  // Friends 목록 불러오기
  const fetchMyFriends = async () => {
    try {
      const res = await api.get("/friends");
      setMyFriends(res.data);
      setFilteredFriends(res.data);
    } catch (err) {
      console.error("친구 목록 에러:", err);
    }
  };

  // 친구 요청 목록
  const fetchFriendRequests = async () => {
    try {
      const res = await api.get("/friends/requests");
      setFriendRequests(res.data);
    } catch (err) {
      console.error("친구 요청 에러:", err);
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

  // 거절 확정
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

    // 입력값 없으면 전체 조회
    if (!keyword) {
      setFilteredFriends(myFriends);
      return;
    }

    const filtered = myFriends.filter(
      (f) =>
        f.friend_id.toString() === keyword ||
        f.friend_name.toLowerCase().includes(keyword.toLowerCase())
    );

    setFilteredFriends(filtered);
  };

  const formatDate = (dt) => new Date(dt).toLocaleDateString();

  return (
    <Box sx={styles.container}>
      <Box
        sx={{
          width: "90%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          sx={{
            "& .MuiTab-root": { outline: "none" },
            "& .Mui-selected": { fontWeight: 700 },
          }}
        >
          <Tab label="My Friends" value={0} />
          <Tab label="Friend Requests" value={1} />
        </Tabs>

        {tab === 0 && (
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AddIcon />
          </Button>
        )}
      </Box>

      <Box sx={styles.body}>
        {/* My Friends */}
        {tab === 0 && (
          <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
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
              }}
              sx={styles.button}
            >
              <CloseIcon />
            </Button>
          </Box>
        )}

        {/* My Friends */}
        {tab === 0 && (
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
                  <TableCell align="center" sx={{ width: "15%" }}>
                    Friend ID
                  </TableCell>
                  <TableCell align="center" sx={{ width: "20%" }}>
                    Name
                  </TableCell>
                  <TableCell align="center" sx={{ width: "50%" }}>
                    Friend Since
                  </TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredFriends.map((f) => (
                  <TableRow key={f.friend_id} hover>
                    <TableCell align="center">{f.friend_id}</TableCell>
                    <TableCell align="center">{f.friend_name}</TableCell>
                    <TableCell align="center">
                      {formatDate(f.created_at)}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="text"
                        onClick={() => handleDeleteFriend(f.friend_id)}
                        sx={styles.button}
                      >
                        <CloseIcon sx={{ color: "#ff0000" }} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredFriends.length === 0 && (
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
                {friendRequests.map((req) => (
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
      </Box>

      {/* Modal */}
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
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          친구 요청이 거절되었습니다.
        </Alert>
      </Snackbar>
    </Box>
  );
}
