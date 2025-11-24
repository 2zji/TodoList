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

import NewTodo from "./NewTodo";
import HeaderTemplet from "../../components/common/HeaderTemplet";
import AppPagination from "../../components/common/AppPagination";
import { myTodo, friendsTodo, likedTodo } from "../../data/TodoData";

function Dashboard() {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [currentList, setCurrentList] = useState([]);

  const dataSource = {
    0: myTodo,
    1: friendsTodo,
    2: likedTodo,
  };

  // const currentList = dataSource[tabValue] ?? [];
  const pageCount = Math.ceil(currentList.length / rowsPerPage);

  const paginatedData = currentList.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  useEffect(() => {
    // console.log(tabValue)
    getList();
  }, [tabValue]);

  const getList = () => {
    const response =
      tabValue === 0
        ? { data: myTodo }
        : tabValue === 1
        ? { data: friendsTodo }
        : { data: likedTodo }; //axios.
    const data = response.data;
    setCurrentList(data);
  };

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
    setPage(1);
  };

  return (
    <Box sx={{ width: "100%", height: "100vh" }}>
      {/* Main */}
      <Box
        sx={{
          width: "100%",
          height: "calc(100vh - 120px - 32px)",
          padding: 4,
          boxSizing: "border-box",
        }}
      >
        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ marginBottom: 2, "& .MuiTab-root": { outline: "none" } }}
        >
          <Tab label="My TODO" />
          <Tab label="Friends TODO" />
          <Tab label="Likes TODO" />
        </Tabs>

        {/* Table */}
        <TableContainer
          component={Paper}
          sx={{ borderRadius: "6px", overflow: "hidden", maxHeight: "100%" }}
        >
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
                <TableRow key={item.id} hover>
                  <TableCell>{(page - 1) * rowsPerPage + i + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.priority}</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))}

              {paginatedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    데이터가 없습니다.
                  </TableCell>
                </TableRow>
              )}
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
            bgcolor: "white",
            p: 4,
            borderRadius: "12px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <HeaderTemplet title="New TODO" />
          <NewTodo />
        </Box>
      </Modal>
    </Box>
  );
}

export default Dashboard;
