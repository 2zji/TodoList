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
import { myTodo as initialMyTodo } from "../../data/TodoData";

import api from "../../api/axiosInstance";
import axios from "axios";

const styles = {
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  header: {
    width: "100%",
    height: "120px",
    display: "flex",
    alignItems: "center",
    paddingLeft: "40px",
    background: "#f9f9f9",
    borderBottom: "1px solid #ccc",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    width: "96%",
    //margin: "50px",
    padding: "32px",
    // height: "calc(100%-120px)",
  },
  controlsRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tableWrap: {
    flex: 1,
    overflow: "auto",
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

  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

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
  const handleSaveNewTodo = async (newItem) => {
    // console.log(selectedTodo);
    // if (modalMode === "edit" && selectedTodo) {
    //   // 업데이트
    //   setTodoList((prev) =>
    //     prev.map((t) => (t.id === selectedTodo.id ? { ...t, ...infoObject } : t))
    //   );
    // } else {
    //   // 새로 추가
    //   const nextId = todoList.length
    //     ? Math.max(...todoList.map((t) => t.id)) + 1
    //     : 1;
    //   const item = { id: nextId, ...infoObject };
    //   setTodoList((prev) => [item, ...prev]);
    //   setPage(1);
    // }
    // setOpen(false);
    // setSelectedTodo(initMyTodo);
    // setModalMode("create");
    try {
      if (modalMode === "edit" && selectedTodo) {
        const res = await api.put(`/todo/${selectedTodo.id}`, newItem);
        setTodoList((prev) =>
          prev.map((t) => (t.id === selectedTodo.id ? res.data : t))
        );
      } else {
        console.log(selectedTodo);
        const res = await api.post("/todo/", selectedTodo);
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
          <FormControl size="small" sx={{ minWidth: 160, paddingLeft: 0 }}>
            <Select
              native
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
                setSelected([]);
              }}
              slotProps={{
                name: "publicity",
                id: "publicity-native",
              }}
            >
              <option value="all">all</option>
              <option value="true">public</option>
              <option value="false">private</option>
            </Select>
          </FormControl>

          <Stack direction="row" spacing={1}>
            <IconButton
              color="error"
              onClick={handleDeleteSelected}
              disabled={selected.length === 0}
              aria-label="delete selected"
              size="large"
              sx={{
                "&:focus": { outline: "none" },
                "&:focusVisible": { outline: "none", boxShadow: "none" },
              }}
            >
              <DeleteIcon />
            </IconButton>

            <Button
              onClick={openCreateModal}
              sx={{
                backgroundColor: "#c5dbf0ff",
                borderRadius: "50%",
                minWidth: "40px",
                maxWidth: "40px",
                minHeight: "40px",
                maxHeight: "40px",
                "&:hover": { backgroundColor: "#b8d6f8" },
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
            <TableHead>
              <TableRow>
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

                  <TableCell sx={{ textAlign: "center" }}>
                    {(page - 1) * rowsPerPage + idx + 1}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.title}
                  </TableCell>
                  <TableCell>
                    {item.description.length > 50
                      ? `${item.description.slice(0, 50)}...`
                      : item.description}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.publicity ? "public" : "private"}
                  </TableCell>

                  <TableCell sx={{ textAlign: "center" }}>
                    {item.priority}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.status === "in_progress" ? "inProgress" : item.status}
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
            bgcolor: "#fff",
            p: 4,
            borderRadius: "10px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box sx={{ width: "100%", height: 50 }}>
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
              mt: 2,
              overflow: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <TodoModal
              mode={modalMode}
              selectedTodo={selectedTodo}
              setSelectedTodo={setSelectedTodo}
            />
          </Box>
          <Box>
            <FooterTamplet
              mode={modalMode}
              onClose={() => setOpen(false)}
              onSave={handleSaveNewTodo}
              onEdit={() => {
                setModalMode("edit");
              }}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default MyTodo;
