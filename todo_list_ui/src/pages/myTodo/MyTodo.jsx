import { useState } from "react";
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

import NewTodo from "../../pages/common/NewTodo";
import HeaderTemplet from "../../components/common/HeaderTemplet";
import AppPagination from "../../components/common/AppPagination";
import { myTodo as initialMyTodo } from "../../data/TodoData";

function MyTodo() {
  const [todoList, setTodoList] = useState(initialMyTodo);
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedTodo, setSelectedTodo] = useState(null);

  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // 필터링
  const filteredList = todoList.filter((todo) =>
    filter === "all" ? true : todo.disclosure === filter
  );

  const pageCount = Math.max(1, Math.ceil(filteredList.length / rowsPerPage));
  const pagedItems = filteredList.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

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

  const handleDeleteSelected = () => {
    if (selected.length === 0) return;
    setTodoList((prev) => prev.filter((t) => !selected.includes(t.id)));
    setSelected([]);
    const newPageCount = Math.max(
      1,
      Math.ceil((filteredList.length - selected.length) / rowsPerPage)
    );
    setPage((p) => Math.min(p, newPageCount));
  };

  // 모달 저장(새로 만들기 또는 업데이트 시 호출)
  const handleSaveNewTodo = (newItem) => {
    if (modalMode === "edit" && selectedTodo) {
      // 업데이트
      setTodoList((prev) => prev.map((t) => (t.id === selectedTodo.id ? { ...t, ...newItem } : t)));
    } else {
      // 새로 추가
      const nextId = todoList.length ? Math.max(...todoList.map((t) => t.id)) + 1 : 1;
      const item = { id: nextId, ...newItem };
      setTodoList((prev) => [item, ...prev]);
      setPage(1);
    }
    setOpen(false);
    setSelectedTodo(null);
    setModalMode("create");
  };

  // 테이블 행 클릭 -> 상세 (view)
  const handleRowClick = (item) => {
    setSelectedTodo(item);
    setModalMode("view");
    setOpen(true);
  };

  // 편집 버튼(상세에서 편집 토글하는 걸 NewTodo 내부에서 해도 되지만 외부에서도 가능)
  const openCreateModal = () => {
    setSelectedTodo(null);
    setModalMode("create");
    setOpen(true);
  };

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
      width: "95%",
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
              inputProps={{
                name: "disclosure",
                id: "disclosure-native",
              }}
            >
              <option value="all">전체</option>
              <option value="public">공개</option>
              <option value="private">비공개</option>
            </Select>
          </FormControl>

          <Stack direction="row" spacing={1}>
            <IconButton
              color="error"
              onClick={handleDeleteSelected}
              disabled={selected.length === 0}
              aria-label="delete selected"
              size="large"
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
                    inputProps={{ "aria-label": "select all" }}
                  />
                </TableCell>
                <TableCell>No.</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Disclosure</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
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
                  <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected.includes(item.id)}
                      onChange={() => handleSelectOne(item.id)}
                    />
                  </TableCell>

                  <TableCell>{(page - 1) * rowsPerPage + idx + 1}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.disclosure === "public" ? "공개" : "비공개"}</TableCell>
                  <TableCell>{item.priority}</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))}

              {pagedItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    목록이 없습니다.
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
          }}
        >
          <Box sx={{ width: "100%", height: 50 }}>
            <HeaderTemplet title={modalMode === "create" ? "New TODO" : modalMode === "view" ? "View TODO" : "Edit TODO"} onClose={() => setOpen(false)} />
          </Box>

          <Box sx={{ flex: 1, mt: 2, overflow: "auto" }}>
            <NewTodo
              mode={modalMode}
              infoObject={selectedTodo}
              onClose={() => {
                setOpen(false);
                setSelectedTodo(null);
                setModalMode("create");
              }}
              onSave={(item) => handleSaveNewTodo(item)}
              onEdit={() => {
                // 외부에서 edit 모드로 전환시키고 싶다면 호출
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
