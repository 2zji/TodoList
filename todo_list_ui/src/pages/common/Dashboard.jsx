import { useEffect, useState } from "react";
import { Box, Modal, Tabs, Tab } from "@mui/material";

import NewTodo from "./TodoModal";
import HeaderTemplet from "../../components/common/HeaderTemplet";
import AppPagination from "../../components/common/AppPagination";
import { myTodo, friendsTodo, likedTodo } from "../../data/TodoData";
import ListTable from "../../components/ListTable";

// import api from "../../api/axiosInstance";

function Dashboard() {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const rowsPerPage = 10;
  const [currentList, setCurrentList] = useState([]);

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
      borderTopLeftRadius: 0,
      padding: "28px 32px",
      boxShadow:
        "0 6px 10px rgba(0,0,0,0.06), 0 1px 18px rgba(0,0,0,0.08)",
      overflow: "hidden",
    },
  };

  const columns =
    tabValue === 0
      ? [
          { header: "No.", field: "no" },
          { header: "Title", field: "title" },
          { header: "Priority", field: "priority" },
          { header: "Status", field: "status" },
        ]
      : [
          { header: "No.", field: "no" },
          { header: "Name", field: "name" },
          { header: "Title", field: "title" },
          { header: "Priority", field: "priority" },
          { header: "Status", field: "status" },
        ];

  useEffect(() => {
    getList();
    setPage(1);
  }, [tabValue]);

  const getList = () => {
    if (tabValue === 0) {
      setCurrentList(myTodo);
    } else if (tabValue === 1) {
      setCurrentList(
        friendsTodo.filter((item) => item.disclosure === "public")
      );
    } else {
      setCurrentList(
        likedTodo.filter((item) => item.disclosure === "public")
      );
    }
  };

  const pageCount = Math.ceil(currentList.length / rowsPerPage);

  const paginatedData = currentList.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const tableRows = paginatedData.map((item, i) => ({
    ...item,
    no: (page - 1) * rowsPerPage + i + 1,
  }));

  const handleRowSelect = (item) => {
    setSelectedTodo(item);
    setOpen(true);
  };

  return (
    <Box sx={styles.container}>
      {/* Tabs 영역 */}
      <Box
        sx={{
          width: "calc(90% + 64px)",
          ml: "-32px",
          mr: "-32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{
            "& .MuiTab-root": { outline: "none" },
            "& .Mui-selected": { fontWeight: 700 },
          }}
        >
          <Tab label="My TODO" />
          <Tab label="Friends TODO" />
          <Tab label="Likes TODO" />
        </Tabs>
      </Box>

      {/* Body */}
      <Box sx={styles.body}>
        <ListTable
          columns={columns}
          rows={tableRows}
          onRowSelect={handleRowSelect}
        />

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
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
            overflow: "hidden",
          }}
        >
          <HeaderTemplet title="View TODO" onClose={() => setOpen(false)} />

          <Box
            sx={{
              mt: 2,
              height: "calc(100% - 60px)",
              overflow: "auto",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <NewTodo mode="view" infoObject={selectedTodo} hideFooter={true} />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default Dashboard;
