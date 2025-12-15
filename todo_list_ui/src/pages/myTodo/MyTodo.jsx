import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Select,
  FormControl,
  Checkbox,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import TodoModal from "../common/TodoModal";
import HeaderTemplet from "../../components/common/HeaderTemplet";
import FooterTamplet from "../../components/common/FooterTemplet";
import api from "../../api/axiosInstance";

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
    flex: 1,
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "28px 32px",
    boxShadow:
      "0 3px 5px rgba(0,0,0,0.04), 0 6px 10px rgba(0,0,0,0.06), 0 1px 18px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },

  controlsRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
    flexShrink: 0,
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

const statusMap = {
  pending: "Pending",
  in_progress: "InProgress",
  completed: "Completed",
};

function MyTodo() {
  const initMyTodo = {
    title: "",
    description: "",
    priority: "medium",
    publicity: true,
    status: "in_progress",
  };

  const [todoList, setTodoList] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedTodo, setSelectedTodo] = useState(initMyTodo);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await api.get("/todo/");
      setTodoList(res.data);
    } catch (err) {
      console.error("TODO 불러오기 실패", err);
    }
  };

  const filteredList = todoList.filter((todo) =>
    filter === "all" ? true : todo.publicity === (filter === "true")
  );

  const handleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selected.length === 0) return;
    try {
      await Promise.all(selected.map((id) => api.delete(`/todo/${id}`)));
      setTodoList((prev) => prev.filter((t) => !selected.includes(t.id)));
      setSelected([]);
    } catch (err) {
      console.error("삭제 실패", err);
    }
  };

  const handleSaveNewTodo = async (todo) => {
    try {
      if (modalMode === "edit" && selectedTodo) {
        const res = await api.put(`/todo/${selectedTodo.id}`, todo);
        setTodoList((prev) =>
          prev.map((t) => (t.id === selectedTodo.id ? res.data : t))
        );
      } else {
        const res = await api.post("/todo/", todo);
        setTodoList((prev) => [res.data, ...prev]);
      }
    } catch (err) {
      console.error("저장 실패", err);
    } finally {
      setOpen(false);
      setModalMode("create");
    }
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.body}>
        <Box sx={styles.controlsRow}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              native
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setSelected([]);
              }}
              sx={{
                bgcolor: "#eef4fb",
                borderRadius: "8px",
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
            >
              <option value="all">All</option>
              <option value="true">Public</option>
              <option value="false">Private</option>
            </Select>
          </FormControl>

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteSelected}
              disabled={selected.length === 0}
              sx={{ width: 40, height: 40, borderRadius: "50%", minWidth: 0 }}
            >
              <DeleteIcon />
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                setSelectedTodo(initMyTodo);
                setModalMode("create");
                setOpen(true);
              }}
              sx={{ width: 40, height: 40, borderRadius: "50%", minWidth: 0 }}
            >
              <AddIcon />
            </Button>
          </Stack>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          <Grid container spacing={2}>
            {filteredList.map((item) => {
              const publicityLabel = item.publicity ? "Public" : "Private";
              const priorityLabel =
                item.priority?.charAt(0).toUpperCase() +
                  item.priority?.slice(1) || "Medium";
              const statusLabel = statusMap[item.status] || "InProgress";

              return (
                <Grid item xs={12} sm={6} md={2.4} key={item.id}>
                  <Card
                    sx={{ width: "295px", height: "180px", cursor: "pointer" }}
                    onClick={() => {
                      setSelectedTodo(item);
                      setModalMode("view");
                      setOpen(true);
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography noWrap fontWeight={600}>
                          {item.title}
                        </Typography>
                        <Checkbox
                          checked={selected.includes(item.id)}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => handleSelectOne(item.id)}
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" noWrap>
                        {item.description || "설명이 없습니다."}
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
                          }}
                        />
                        <Chip
                          size="small"
                          label={statusLabel}
                          sx={{
                            bgcolor:
                              TAG_COLORS.status[statusLabel] ||
                              TAG_COLORS.status.InProgress,
                            color: "#fff",
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 900,
            height: 600,
            bgcolor: "#fff",
            p: 4,
            borderRadius: "14px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <HeaderTemplet
            title={modalMode === "create" ? "New TODO" : selectedTodo?.title}
            onClose={() => setOpen(false)}
          />

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <TodoModal
              mode={modalMode}
              selectedTodo={selectedTodo}
              setSelectedTodo={setSelectedTodo}
            />
          </Box>

          <FooterTamplet
            mode={modalMode}
            selectedTodo={selectedTodo}
            onClose={() => setOpen(false)}
            onSave={handleSaveNewTodo}
            onEdit={() => setModalMode("edit")}
          />
        </Box>
      </Modal>
    </Box>
  );
}

export default MyTodo;
