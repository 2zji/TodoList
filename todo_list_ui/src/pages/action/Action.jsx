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
  Modal,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import FavoriteIcon from "@mui/icons-material/Favorite";
import api from "../../api/axiosInstance";
import RejectModal from "../common/RejectModal";
import FriendsModal from "../common/FriendsModal";
import NewTodo from "../common/TodoModal";
import HeaderTemplet from "../../components/common/HeaderTemplet";

const ITEMS_PER_PAGE = {
  FRIENDS: 9,
  REQUESTS: 10,
  LIKES: 15,
};

const TABS = {
  MY_FRIENDS: 0,
  FRIEND_REQUESTS: 1,
  LIKES_TODO: 2,
};

const styles = {
  container: {
    width: "100%",
    height: "90%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f4f7fb",
    padding: "20px 0px 25px 0px",
    overflow: "hidden",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    //flex: 1,
    height: "100%",
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "28px 32px",
    boxShadow: "0 6px 10px rgba(0,0,0,0.06), 0 1px 18px rgba(0,0,0,0.08)",
    overflowY: "auto",
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
  tableHead: {
    "& .MuiTableCell-root": {
      bgcolor: "#f0f4fa",
      fontWeight: 600,
      color: "#455a79",
      fontSize: "15px",
      padding: "10px",
    },
  },
  modal: {
    width: 900,
    height: 600,
    bgcolor: "#fff",
    p: 4,
    borderRadius: "10px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  modalContent: {
    mt: 2,
    flex: 1,
    overflow: "auto",
    "&::-webkit-scrollbar": { display: "none" },
  },
  pagination: {
    "& .MuiPaginationItem-root": {
      "&:focus": { outline: "none" },
      "&:focusVisible": { outline: "none", boxShadow: "none" },
    },
  },
};

const TAG_COLORS = {
  publicity: {
    Public: "#2D9CDB",
    Private: "#636E72",
  },
  priority: {
    Low: "#6AB04A",
    Medium: "#F39C12",
    High: "#E84118",
  },
  status: {
    Pending: "#778CA3",
    InProgress: "#22A6B3",
    Completed: "#1ABC9C",
  },
};

export default function Action() {
  const [tab, setTab] = useState(TABS.MY_FRIENDS);
  const [myFriends, setMyFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [checkedFriends, setCheckedFriends] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [friendsPage, setFriendsPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [friendRequests, setFriendRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [requestsPage, setRequestsPage] = useState(1);
  const [likesList, setLikesList] = useState([]);
  const [likesPage, setLikesPage] = useState(1);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [todoModalOpen, setTodoModalOpen] = useState(false);
  const [targetRejectId, setTargetRejectId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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

  const fetchLikesList = async () => {
    try {
      const res = await api.get("/like/my");
      const friendsRes = await api.get("/friends");

      const currentFriendIds = new Set(
        friendsRes.data.map((friend) => friend.friend_id)
      );

      const statusMap = {
        pending: "Pending",
        in_progress: "InProgress",
        completed: "Completed",
        cancelled: "Cancelled",
      };

      const likesTodo = (res.data || [])
        .filter((item) => currentFriendIds.has(item.friend_id))
        .map((item) => {
          const publicityBoolean = item.publicity;

          const priorityNormalized = item.priority
            ? item.priority.trim().charAt(0).toUpperCase() +
              item.priority.trim().slice(1).toLowerCase()
            : "Low";

          return {
            ...item,
            name: item.friend_name || "unknown",
            publicity: publicityBoolean,
            publicityDisplay: publicityBoolean ? "Public" : "Private",
            status: statusMap[item.status] || item.status,
            priority: priorityNormalized,
          };
        });

      setLikesList(likesTodo);
      setLikesPage(1);
    } catch (err) {
      console.error("좋아요 목록 불러오기 실패:", err);
      setLikesList([]);
    }
  };

  useEffect(() => {
    fetchMyFriends();
    fetchFriendRequests();
  }, []);

  useEffect(() => {
    if (tab === TABS.LIKES_TODO) {
      fetchLikesList();
    }
  }, [tab]);

  const deleteFriends = async () => {
    if (checkedFriends.length === 0) return;

    try {
      await Promise.all(
        checkedFriends.map((id) => api.delete(`/friends/${id}`))
      );

      fetchMyFriends();

      if (tab === TABS.LIKES_TODO) {
        fetchLikesList();
      }
    } catch (err) {
      console.error("친구 삭제 실패:", err);
    }
  };

  const toggleAll = () => {
    if (allChecked) {
      setCheckedFriends([]);
    } else {
      setCheckedFriends(filteredFriends.map((f) => f.friend_id));
    }
    setAllChecked(!allChecked);
  };

  const toggleCheck = (id) => {
    const updated = checkedFriends.includes(id)
      ? checkedFriends.filter((v) => v !== id)
      : [...checkedFriends, id];

    setCheckedFriends(updated);
    setAllChecked(updated.length === filteredFriends.length);
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    if (!keyword) {
      setFilteredFriends(myFriends);
      setFriendsPage(1);
      return;
    }

    const filtered = myFriends.filter(
      (f) =>
        f.friend_id.toString() === keyword ||
        f.friend_name.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredFriends(filtered);
    setFriendsPage(1);
  };

  const clearSearch = () => {
    setSearchKeyword("");
    setFilteredFriends(myFriends);
  };

  const handleAccept = async (requestId) => {
    try {
      await api.put(`/friends/${requestId}/accept`);
      fetchFriendRequests();
      fetchMyFriends();
    } catch (err) {
      console.error("친구 요청 수락 실패:", err);
    }
  };

  const openRejectModal = (id) => {
    setTargetRejectId(id);
    setRejectModalOpen(true);
  };

  const confirmReject = async () => {
    try {
      await api.put(`/friends/${targetRejectId}/reject`);
      setRejectModalOpen(false);
      setSnackbarOpen(true);
      fetchFriendRequests();
    } catch (err) {
      console.error("친구 요청 거절 실패:", err);
    }
  };

  const handleLikeToggle = async (todoId, currentLikeStatus) => {
    if (!todoId) return;

    try {
      if (currentLikeStatus) {
        await api.delete(`/like/${todoId}`);
      } else {
        await api.post(`/like/${todoId}`);
      }
      fetchLikesList();
    } catch (err) {
      console.error("좋아요 토글 오류:", err);
    }
  };

  const handleRowSelect = (item) => {
    setSelectedTodo(item);
    setTodoModalOpen(true);
    setIsLiked(true);
  };

  const closeTodoModal = () => {
    setTodoModalOpen(false);
    setSelectedTodo(null);
    setIsLiked(false);
  };

  const formatDate = (dt) => new Date(dt).toLocaleDateString();

  const paginateFriends = () => {
    const start = (friendsPage - 1) * ITEMS_PER_PAGE.FRIENDS;
    const end = start + ITEMS_PER_PAGE.FRIENDS;
    return filteredFriends.slice(start, end);
  };

  const paginateRequests = () => {
    const start = (requestsPage - 1) * ITEMS_PER_PAGE.REQUESTS;
    const end = start + ITEMS_PER_PAGE.REQUESTS;
    return filteredRequests.slice(start, end);
  };

  const paginateLikes = () => {
    const start = (likesPage - 1) * ITEMS_PER_PAGE.LIKES;
    const end = start + ITEMS_PER_PAGE.LIKES;
    return likesList.slice(start, end).map((item, i) => ({
      ...item,
      no: start + i + 1,
    }));
  };

  const displayedFriends = paginateFriends();
  const displayedRequests = paginateRequests();
  const likesTableRows = paginateLikes();

  const friendsPageCount = Math.ceil(
    filteredFriends.length / ITEMS_PER_PAGE.FRIENDS
  );
  const requestsPageCount = Math.ceil(
    filteredRequests.length / ITEMS_PER_PAGE.REQUESTS
  );
  const likesPageCount = Math.ceil(likesList.length / ITEMS_PER_PAGE.LIKES);

  const renderSearchBar = () => (
    <Box sx={{ mb: 1.5, display: "flex", gap: 1 }}>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          placeholder="친구 검색 (ID 또는 이름)"
          value={searchKeyword}
          onChange={handleSearch}
          size="small"
          fullWidth
        />
        <Button variant="contained" onClick={clearSearch} sx={styles.button}>
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
            bgcolor: checkedFriends.length > 0 ? "#EF4444" : "#a8a8a8",
            "&:hover": {
              bgcolor: checkedFriends.length > 0 ? "#d30c2a" : "#a8a8a8",
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
  );

  const renderFriendsTable = () => (
    <>
      <TableContainer component={Paper} sx={styles.tableWrap}>
        <Table stickyHeader>
          <TableHead sx={styles.tableHead}>
            <TableRow>
              <TableCell align="center" sx={{ width: "5%" }}>
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
                <TableCell align="center" sx={{ padding: 0 }}>
                  <Checkbox
                    checked={checkedFriends.includes(f.friend_id)}
                    onChange={() => toggleCheck(f.friend_id)}
                  />
                </TableCell>
                <TableCell align="center">{f.friend_id}</TableCell>
                <TableCell align="center">{f.friend_name}</TableCell>
                <TableCell align="center">{formatDate(f.created_at)}</TableCell>
              </TableRow>
            ))}
            {displayedFriends.length === 0 && (
              <TableRow>
                <TableCell align="center" colSpan={4}>
                  친구가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={friendsPageCount}
          page={friendsPage}
          onChange={(e, v) => setFriendsPage(v)}
          color="primary"
          sx={styles.pagination}
        />
      </Box>
    </>
  );

  const renderRequestsTable = () => (
    <>
      <TableContainer component={Paper} sx={styles.tableWrap}>
        <Table stickyHeader>
          <TableHead sx={styles.tableHead}>
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
          count={requestsPageCount}
          page={requestsPage}
          onChange={(e, v) => setRequestsPage(v)}
          color="primary"
          sx={styles.pagination}
        />
      </Box>
    </>
  );

  const renderLikesTable = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          // flex: 1,
          // overflowY: "auto",
          // pr: 1,
          // "&::-webkit-scrollbar": { display: "none" },
          // scrollbarWidth: "none",
          flex: 1,
          pr: 1,
        }}
      >
        <Grid container spacing={2}>
          {likesTableRows.map((todo) => (
            <Grid item xs={12} sm={6} md={2} key={todo.todo_id}>
              <Card
                sx={{
                  width: "297px",
                  height: "180px",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => handleRowSelect(todo)}
              >
                <CardContent sx={{ flex: 1, pb: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1.5,
                    }}
                  >
                    <Typography noWrap fontWeight={600}>
                      {todo.title}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikeToggle(todo.todo_id, true);
                      }}
                      sx={{
                        ...styles.button,
                        color: "#E74C3C",
                        padding: "4px",
                      }}
                    >
                      <FavoriteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {todo.description || "설명이 없습니다."}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Creator: {todo.name}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 0.5, mt: 1 }}>
                    <Chip
                      label={todo.publicityDisplay || "Private"}
                      size="small"
                      sx={{
                        bgcolor:
                          TAG_COLORS.publicity[todo.publicityDisplay] ||
                          TAG_COLORS.publicity.Private,
                        color: "#fff",
                        fontWeight: 500,
                        fontSize: "0.7rem",
                      }}
                    />
                    <Chip
                      label={todo.priority || "Low"}
                      size="small"
                      sx={{
                        bgcolor:
                          TAG_COLORS.priority[todo.priority] ||
                          TAG_COLORS.priority.Low,
                        color: "#fff",
                        fontWeight: 500,
                        fontSize: "0.7rem",
                      }}
                    />
                    <Chip
                      label={todo.status || "Pending"}
                      size="small"
                      sx={{
                        bgcolor:
                          TAG_COLORS.status[todo.status] ||
                          TAG_COLORS.status.Pending,
                        color: "#fff",
                        fontWeight: 500,
                        fontSize: "0.7rem",
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {likesTableRows.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                color: "text.secondary",
                width: "100%",
              }}
            >
              <Typography variant="h6">No liked todos found</Typography>
            </Box>
          )}
        </Grid>
      </Box>
    </Box>
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
          }}
        >
          <Tab label="My Friends" value={TABS.MY_FRIENDS} />
          <Tab label="Friend Requests" value={TABS.FRIEND_REQUESTS} />
          <Tab label="Likes Todo" value={TABS.LIKES_TODO} />
        </Tabs>
      </Box>

      <Box sx={styles.body}>
        {tab === TABS.MY_FRIENDS && renderSearchBar()}
        {tab === TABS.MY_FRIENDS && renderFriendsTable()}
        {tab === TABS.FRIEND_REQUESTS && renderRequestsTable()}
        {tab === TABS.LIKES_TODO && renderLikesTable()}
      </Box>

      <FriendsModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <RejectModal
        open={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          fetchFriendRequests();
        }}
        onConfirm={confirmReject}
      />

      <Modal open={todoModalOpen} onClose={closeTodoModal}>
        <Box sx={styles.modal}>
          <HeaderTemplet title={selectedTodo?.title} onClose={closeTodoModal} />
          <Box sx={styles.modalContent}>
            <NewTodo mode="view" selectedTodo={selectedTodo} />
          </Box>
          <NewTodo
            mode="view"
            selectedTodo={selectedTodo}
            showLike={true}
            isLiked={isLiked}
            onLikeToggle={() =>
              handleLikeToggle(selectedTodo?.todo_id, isLiked)
            }
          />
        </Box>
      </Modal>

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
