import { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import NewTodo from "./TodoModal";
import HeaderTemplet from "../../components/common/HeaderTemplet";
import AppPagination from "../../components/common/AppPagination";
import { myTodo, friendsTodo, likedTodo } from "../../data/TodoData";

function Dashboard() {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);

  const [selectedTodo, setSelectedTodo] = useState(null);

  const rowsPerPage = 10;
  const [currentList, setCurrentList] = useState([]);

  useEffect(() => {
    getList();
  }, [tabValue]);

  const getList = () => {
    const data = tabValue === 0 ? myTodo : tabValue === 1 ? friendsTodo : likedTodo;
    setCurrentList(data);
  };

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
    setPage(1);
  };

  const pageCount = Math.ceil(currentList.length / rowsPerPage);
  const paginatedData = currentList.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleRowClick = (item) => {
    setSelectedTodo(item);
    setOpen(true);
  };

  return (
    <Box sx={{ width: "100%", height: "100vh" }}>
      <Box sx={{ width: "100%", height: "calc(100vh - 152px)", padding: 4, boxSizing: "border-box" }}>
        {/* Tabs */}
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ marginBottom: 2, "& .MuiTab-root": { outline: "none" } }}>
          <Tab label="My TODO" />
          <Tab label="Friends TODO" />
          <Tab label="Likes TODO" />
        </Tabs>

        {/* Table */}
        <TableContainer component={Paper} sx={{ borderRadius: "6px", overflow: "hidden", maxHeight: "100%" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.map((item, i) => (
                <TableRow key={item.id} hover onClick={() => handleRowClick(item)} sx={{ cursor: "pointer" }}>
                  <TableCell>{(page - 1) * rowsPerPage + i + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.priority}</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
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
            <HeaderTemplet title="View TODO" onClose={() => setOpen(false)} />
          </Box>

          <Box sx={{ flex: 1, mt: 2, overflow: "auto", "&::-webkit-scrollbar": { display: "none" } }}>
            <NewTodo
              mode="view"
              infoObject={selectedTodo}
              onClose={() => setOpen(false)}
              hideFooter={true} // ← Dashboard에서만 버튼 숨김
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default Dashboard;
