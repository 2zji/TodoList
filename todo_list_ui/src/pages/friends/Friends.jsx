import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Grid,
  Modal,
  TextField,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import api from "../../api/axiosInstance";
import NewTodo from "../common/TodoModal";
import HeaderTemplet from "../../components/common/HeaderTemplet";

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
    //overflow: "hidden",
  },
  button: {
    "&:focus": { outline: "none" },
    "&:focusVisible": { outline: "none", boxShadow: "none" },
  },
};

const TAG_COLORS = {
  publicity: {
    Public: "#268fcc",
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
  const [todoList, setTodoList] = useState([]);
  const [likedTodos, setLikedTodos] = useState(new Set());
  const [open, setOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [keyword, setKeyword] = useState("");

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
    const isLiked = likedTodos.has(todoId);
    try {
      if (isLiked) {
        await api.delete(`/like/${todoId}`);
        setLikedTodos((prev) => {
          const n = new Set(prev);
          n.delete(todoId);
          return n;
        });
      } else {
        await api.post(`/like/${todoId}`);
        setLikedTodos((prev) => new Set(prev).add(todoId));
      }
      setIsLiked(!isLiked);
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

  const filteredTodos = todoList.filter((todo) => {
    const q = keyword.toLowerCase();
    return (
      todo.name?.toLowerCase().includes(q) ||
      todo.title?.toLowerCase().includes(q) ||
      todo.description?.toLowerCase().includes(q)
    );
  });

  return (
    <Box sx={styles.container}>
      <Box sx={styles.body}>
        <Box sx={{ mb: 2, flexShrink: 0 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="친구 이름, 제목, 내용으로 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            pr: 1,
            // "&::-webkit-scrollbar": { display: "none" },
            // scrollbarWidth: "none",
          }}
        >
          <Grid container spacing={2}>
            {filteredTodos.map((todo) => {
              const publicityLabel = todo.publicity ? "Public" : "Private";
              const priorityLabel =
                todo.priority?.charAt(0).toUpperCase() +
                  todo.priority?.slice(1) || "Medium";
              const statusLabel = statusMap[todo.status] || "Pending";

              return (
                <Grid item xs={12} sm={6} md={2} key={todo.todo_id}>
                  <Card
                    sx={{
                      width: "297px",
                      height: "180px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        transform: "translateY(-2px)",
                      },
                    }}
                    onClick={() => handleCardClick(todo)}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography noWrap fontWeight={600}>
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

                      <Box sx={{ mt: 1, display: "flex", gap: 0.5 }}>
                        <Chip
                          size="small"
                          label={publicityLabel}
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
                          size="small"
                          label={priorityLabel}
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
                          size="small"
                          label={statusLabel}
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

            {filteredTodos.length === 0 && (
              <Box sx={{ width: "100%", textAlign: "center", py: 8 }}>
                <Typography color="text.secondary">
                  검색 결과가 없습니다.
                </Typography>
              </Box>
            )}
          </Grid>
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
          <HeaderTemplet title={selectedTodo?.title} onClose={handleClose} />
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <NewTodo
              mode="view"
              selectedTodo={selectedTodo}
              showLike={true}
              isLiked={isLiked}
              onLikeToggle={() => handleLikeToggle(selectedTodo.todo_id)}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default Friends;
