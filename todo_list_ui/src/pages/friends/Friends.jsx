import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Grid,
  Pagination,
  Modal,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import api from "../../api/axiosInstance";
import NewTodo from "../common/TodoModal";
import HeaderTemplet from "../../components/common/HeaderTemplet";
import FooterTamplet from "../../components/common/FooterTemplet";

const statusMap = {
  pending: "Pending",
  in_progress: "InProgress",
  completed: "Completed",
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
  },
  body: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "28px 32px",
    boxShadow: "0 6px 10px rgba(0,0,0,0.06), 0 1px 18px rgba(0,0,0,0.08)",
  },
  button: {
    "&:focus": { outline: "none" },
    "&:focusVisible": { outline: "none", boxShadow: "none" },
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

function Friends() {
  const [page, setPage] = useState(1);
  const [todoList, setTodoList] = useState([]);
  const [likedTodos, setLikedTodos] = useState(new Set());
  const [open, setOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const todosPerPage = 15;

  useEffect(() => {
    fetchFriendsTodos();
    fetchLikedTodos();
  }, []);

  const fetchFriendsTodos = async () => {
    try {
      const res = await api.get("/friends/todos");
      const flattened = (res.data || []).flatMap((friend) =>
        friend.todos.map((todo) => ({
          ...todo,
          name: friend.friend_name,
          friend_id: friend.friend_id,
        }))
      );
      setTodoList(flattened);
    } catch (err) {
      console.error("친구 TODO 불러오기 실패:", err);
      setTodoList([]);
    }
  };

  const fetchLikedTodos = async () => {
    try {
      const res = await api.get("/like/my");
      const likedIds = new Set(res.data.map((item) => item.todo_id));
      setLikedTodos(likedIds);
    } catch (err) {
      console.error("좋아요 목록 불러오기 실패:", err);
    }
  };

  const handleLikeToggle = async (todoId) => {
    try {
      const isLiked = likedTodos.has(todoId);

      if (isLiked) {
        await api.delete(`/like/${todoId}`);
        setLikedTodos((prev) => {
          const newSet = new Set(prev);
          newSet.delete(todoId);
          return newSet;
        });
        setIsLiked(false);
      } else {
        await api.post(`/like/${todoId}`);
        setLikedTodos((prev) => new Set(prev).add(todoId));
        setIsLiked(true);
      }
    } catch (err) {
      console.error("좋아요 토글 오류:", err);
    }
  };

  const handleCardClick = (todo) => {
    setSelectedTodo(todo);
    setIsLiked(likedTodos.has(todo.todo_id));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTodo(null);
    setIsLiked(false);
  };

  const handleModalLikeToggle = async () => {
    if (!selectedTodo?.todo_id) return;
    await handleLikeToggle(selectedTodo.todo_id);
  };

  const pageCount = Math.ceil(todoList.length / todosPerPage);
  const paginatedTodos = todoList.slice(
    (page - 1) * todosPerPage,
    page * todosPerPage
  );

  return (
    <Box sx={styles.container}>
      <Box sx={styles.body}>
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
            <Grid container spacing={2}>
              {paginatedTodos.map((todo) => {
                const publicityLabel = todo.publicity ? "Public" : "Private";
                const priorityLabel =
                  todo.priority?.charAt(0).toUpperCase() +
                    todo.priority?.slice(1) || "Medium";
                const statusLabel = statusMap[todo.status] || "Pending";

                return (
                  <Grid item xs={12} sm={6} md={2} key={todo.todo_id}>
                    <Card
                      sx={{
                        width: "295px",
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
                      onClick={() => handleCardClick(todo)}
                    >
                      <CardContent sx={{ flex: 1, pb: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1.5,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              fontSize: "1.1rem",
                              flex: 1,
                              mr: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {todo.title}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikeToggle(todo.todo_id);
                            }}
                            sx={{
                              ...styles.button,
                              color: likedTodos.has(todo.todo_id)
                                ? "#E74C3C"
                                : "#CCC",
                              padding: "4px",
                            }}
                          >
                            {likedTodos.has(todo.todo_id) ? (
                              <FavoriteIcon fontSize="small" />
                            ) : (
                              <FavoriteBorderIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            minHeight: "40px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {todo.description
                            ? todo.description.length > 50
                              ? `${todo.description.slice(0, 50)}...`
                              : todo.description
                            : "설명이 없습니다."}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mb: 1.5, display: "block" }}
                        >
                          Created by: {todo.name || "Unknown"}
                        </Typography>

                        <Box
                          sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}
                        >
                          <Chip
                            label={publicityLabel}
                            size="small"
                            sx={{
                              bgcolor:
                                TAG_COLORS.publicity[publicityLabel] ||
                                TAG_COLORS.publicity.Private,
                              color: "#fff",
                              fontWeight: 500,
                              fontSize: "0.7rem",
                            }}
                          />
                          <Chip
                            label={priorityLabel}
                            size="small"
                            sx={{
                              bgcolor:
                                TAG_COLORS.priority[priorityLabel] ||
                                TAG_COLORS.priority.Medium,
                              color: "#fff",
                              fontWeight: 500,
                              fontSize: "0.7rem",
                            }}
                          />
                          <Chip
                            label={statusLabel}
                            size="small"
                            sx={{
                              bgcolor:
                                TAG_COLORS.status[statusLabel] ||
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
                );
              })}

              {paginatedTodos.length === 0 && (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 8,
                    color: "text.secondary",
                    width: "100%",
                  }}
                >
                  <Typography variant="h6">No friends Todo</Typography>
                </Box>
              )}
            </Grid>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
              flexShrink: 0,
            }}
          >
            <Pagination
              count={pageCount}
              page={page}
              onChange={(e, v) => setPage(v)}
              color="primary"
              sx={{
                "& .MuiPaginationItem-root": {
                  "&:focus": { outline: "none" },
                  "&:focusVisible": { outline: "none", boxShadow: "none" },
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
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
          }}
        >
          <HeaderTemplet title="View TODO" onClose={handleClose} />

          <Box
            sx={{
              mt: 2,
              flex: 1,
              overflow: "auto",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <NewTodo mode="view" selectedTodo={selectedTodo} />
          </Box>

          <FooterTamplet
            mode="view"
            selectedTodo={selectedTodo}
            onClose={handleClose}
            showLike={true}
            isLiked={isLiked}
            onLikeToggle={handleModalLikeToggle}
            onEdit={null}
          />
        </Box>
      </Modal>
    </Box>
  );
}

export default Friends;
