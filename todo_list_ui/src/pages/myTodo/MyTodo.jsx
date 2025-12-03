import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Select,
  FormControl,
  Checkbox,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import TodoModal from "../common/TodoModal";
import HeaderTemplet from "../../components/common/HeaderTemplet";
import AppPagination from "../../components/common/AppPagination";
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

  controlsRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },

  tableWrap: {
    flex: 1,
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow:
      "0 2px 4px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.05), 0 1px 10px rgba(0,0,0,0.07)",
  },
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

  const convertTodo = (todo) => ({
    ...todo,
    publicity: todo.publicity === true || todo.publicity === "true",
    priority: todo.priority?.toLowerCase(),
    status: todo.status?.toLowerCase(),
  });

  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  //const rowsPerPage = 10;

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      console.log("fetchTodos");
      const res = await api.get("/todo/");
      setTodoList(res.data);
      setPage(1);
    } catch (err) {
      console.error("TODO 불러오기 실패", err);
    }
  };

  // 필터링
  const filteredList = todoList.filter((todo) =>
    filter === "all" ? true : todo.publicity === (filter === "true")
  );

  const pageCount = Math.max(1, Math.ceil(filteredList.length / rowsPerPage));
  const pagedItems = filteredList.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  /* handle */
  const handleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = pagedItems.map((i) => i.id);
    const allSelectedOnPage =
      currentPageIds.length > 0 &&
      currentPageIds.every((id) => selected.includes(id));
    if (allSelectedOnPage) {
      setSelected((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelected((prev) => {
        const next = [...prev];
        currentPageIds.forEach((id) => {
          if (!next.includes(id)) next.push(id);
        });
        return next;
      });
    }
  };

  const handleDeleteSelected = async () => {
    if (selected.length === 0) return;
    try {
      await Promise.all(selected.map((id) => api.delete(`/todo/${id}`)));
      setTodoList((prev) => prev.filter((t) => !selected.includes(t.id)));
      setSelected([]);
      const newPageCount = Math.max(
        1,
        Math.ceil((filteredList.length - selected.length) / rowsPerPage)
      );
      setPage((p) => Math.min(p, newPageCount));
    } catch (err) {
      console.error("삭제 실패", err);
    }
  };

  // 모달 저장
  const handleSaveNewTodo = async (todo) => {
    try {
      if (modalMode === "edit" && selectedTodo) {
        // 수정
        const res = await api.put(
          `/todo/${selectedTodo.id}`,
          convertTodo(todo)
        );
        setTodoList((prev) =>
          prev.map((t) => (t.id === selectedTodo.id ? res.data : t))
        );
      } else {
        // 모달 저장
        const res = await api.post("/todo/", convertTodo(todo));
        setTodoList((prev) => [res.data, ...prev]);
        setPage(1);
      }
    } catch (err) {
      console.error("저장 실패", err);
    } finally {
      setOpen(false);
      setSelectedTodo(null);
      setModalMode("create");
    }
  };
  // 테이블 행 클릭 시, view
  const handleRowClick = (item) => {
    setSelectedTodo(item);
    setModalMode("view");
    setOpen(true);
  };

  const openCreateModal = () => {
    setSelectedTodo(initMyTodo);
    setModalMode("create");
    setOpen(true);
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.body}>
        {/* Top controls */}
        <Box sx={{ ...styles.controlsRow, mb: 1 }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              native
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
                setSelected([]);
              }}
              sx={{
                bgcolor: "#eef4fb",
                borderRadius: "8px",
                outline: "none",
                "&:hover": {
                  bgcolor: "#e1edf7",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              <option value="all">All</option>
              <option value="true">Public</option>
              <option value="false">Private</option>
            </Select>
          </FormControl>

          <Stack direction="row" spacing={1}>
            <IconButton
              color="error"
              onClick={handleDeleteSelected}
              disabled={selected.length === 0}
              sx={{
                bgcolor: selected.length > 0 ? "#ffebee" : "#f5f5f5",
                borderRadius: "8px",
                padding: "6px",
                "&:hover": {
                  bgcolor: selected.length > 0 ? "#ffcdd2" : "#eeeeee",
                },
                "&:focus": { outline: "none" },
                "&:focusVisible": { outline: "none", boxShadow: "none" },
              }}
            >
              <DeleteIcon />
            </IconButton>

            <Button
              onClick={openCreateModal}
              sx={{
                backgroundColor: "#90c2f8",
                borderRadius: "50%",
                minWidth: "42px",
                minHeight: "42px",
                "&:hover": { backgroundColor: "#7bb5f5" },
                "&:active": { backgroundColor: "#69a6ef" },
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                "&:focus": { outline: "none" },
                "&:focusVisible": { outline: "none", boxShadow: "none" },
              }}
            >
              <AddIcon />
            </Button>
          </Stack>
        </Box>

        {/* Table */}
        <TableContainer component={Paper} sx={{ ...styles.tableWrap }}>
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
              <TableRow
                hover
                onClick={() => handleRowClick(item)}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f5faff",
                  },
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={
                      pagedItems.length > 0 &&
                      pagedItems.every((item) => selected.includes(item.id))
                    }
                    onChange={handleSelectAll}
                    slotProps={{ "aria-label": "select all" }}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>No.</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Title</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Description</TableCell>
                <TableCell sx={{ textAlign: "center" }}>publicity</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Priority</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {pagedItems.map((item, idx) => (
                <TableRow
                  key={item.id}
                  hover
                  onClick={() => handleRowClick(item)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell
                    padding="checkbox"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={selected.includes(item.id)}
                      onChange={() => handleSelectOne(item.id)}
                    />
                  </TableCell>

                  <TableCell align="center" sx={{ width: "5%" }}>
                    {(page - 1) * rowsPerPage + idx + 1}
                  </TableCell>
                  <TableCell align="center" sx={{ width: "20%" }}>
                    {item.title}
                  </TableCell>
                  <TableCell align="left" sx={{ width: "45%" }}>
                    {item.description.length > 50
                      ? `${item.description.slice(0, 50)}...`
                      : item.description}
                  </TableCell>
                  <TableCell align="center" sx={{ width: "10%" }}>
                    {item.publicity ? "public" : "private"}
                  </TableCell>

                  <TableCell align="center" sx={{ width: "10%" }}>
                    {item.priority}
                  </TableCell>
                  <TableCell align="center" sx={{ width: "10%" }}>
                    {item.status === "in_progress"
                      ? "inProgress"
                      : item.status === "completed"
                      ? "close"
                      : item.status}
                  </TableCell>
                </TableRow>
              ))}

              {pagedItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    데이터가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <AppPagination page={page} count={pageCount} onChange={setPage} />
        </Box>
      </Box>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 900,
            height: 600,
            bgcolor: "#ffffff",
            p: 4,
            borderRadius: "14px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1), 0 8px 20px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            "&:focus": { outline: "none" },
            "&:focusVisible": { outline: "none", boxShadow: "none" },
          }}
        >
          <Box sx={{ width: "100%", flexShrink: 0 }}>
            <HeaderTemplet
              title={
                modalMode === "create"
                  ? "New TODO"
                  : modalMode === "view"
                  ? "View TODO"
                  : "Edit TODO"
              }
              onClose={() => setOpen(false)}
            />
          </Box>
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 3,
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <TodoModal
              mode={modalMode}
              selectedTodo={selectedTodo}
              setSelectedTodo={setSelectedTodo}
            />
          </Box>

          <Box sx={{ height: 70, flexShrink: 0 }}>
            <FooterTamplet
              mode={modalMode}
              selectedTodo={selectedTodo}
              onClose={() => setOpen(false)}
              onSave={(todo) => handleSaveNewTodo(todo)}
              onEdit={() => setModalMode("edit")}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default MyTodo;
