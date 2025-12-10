import { useEffect, useState, useMemo } from "react";
import { Box, Modal, Tabs, Tab } from "@mui/material";

import NewTodo from "./TodoModal";
import HeaderTemplet from "../../components/common/HeaderTemplet";
import AppPagination from "../../components/common/AppPagination";
import ListTable from "../../components/ListTable";
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
    borderTopLeftRadius: 0,
    padding: "28px 32px",
    boxShadow: "0 6px 10px rgba(0,0,0,0.06), 0 1px 18px rgba(0,0,0,0.08)",
  },
};

function Dashboard() {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [currentList, setCurrentList] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const rowsPerPage = 10;

  const columns = useMemo(() => {
    if (tabValue === 0) {
      return [
        { header: "No.", field: "no", width: "10%" },
        { header: "Title", field: "title", width: "50%" },
        { header: "Priority", field: "priority", width: "20%" },
        { header: "Status", field: "status", width: "20%" },
      ];
    }
    if (tabValue === 1) {
      return [
        { header: "No.", field: "no", width: "5%" },
        { header: "Title", field: "title", width: "40%" },
        { header: "Creator", field: "name", width: "15%" },
        { header: "Priority", field: "priority", width: "20%" },
        { header: "Status", field: "status", width: "20%" },
      ];
    }
    return [
      { header: "No.", field: "no", width: "5%" },
      { header: "Title", field: "title", width: "40%" },
      { header: "Creator", field: "name", width: "15%" },
      { header: "Priority", field: "priority", width: "20%" },
      { header: "Status", field: "status", width: "20%" },
    ];
  }, [tabValue]);

  useEffect(() => {
    fetchList();
    setPage(1);
  }, [tabValue]);

  const fetchList = async () => {
    try {
      let res;

      if (tabValue === 0) {
        res = await api.get("/todo/");
        setCurrentList(res.data || []);
      } else if (tabValue === 1) {
        res = await api.get("/friends/todos");
        const flattened = (res.data || []).flatMap(friend => 
          friend.todos.map(todo => ({
            ...todo, 
            name: friend.friend_name, 
            friend_id: friend.friend_id
          }))
        );
        setCurrentList(flattened);
      } else {
        res = await api.get("/like/my");
        const likesTodo = (res.data || []).map(item => ({
          ...item,
          name: item.friend_name || 'unknown'
        }));
        setCurrentList(likesTodo);
      }
    } catch (err) {
      console.error("API 오류:", err);
      setCurrentList([]);
    }
  };

  const checkLikeStatus = async (todoId) => {
    try {
      if (tabValue === 2) {
        setIsLiked(true);
        return;
      }
      const likesRes = await api.get("/like/my");
      const isInLikes = (likesRes.data || []).some(
        item => item.todo_id === todoId
      );
      setIsLiked(isInLikes);
    } catch (err) {
      console.error("좋아요 상태 확인 오류:", err);
      setIsLiked(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!selectedTodo?.todo_id) return;

    try {
      if (isLiked) {
        await api.delete(`/like/${selectedTodo.todo_id}`);
        setIsLiked(false);
      } else {
        await api.post(`/like/${selectedTodo.todo_id}`);
        setIsLiked(true);
      }
      if (tabValue === 2) {
        fetchList();
      }
    } catch (err) {
      console.error("좋아요 토글 오류:", err);
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
    
    if ((tabValue === 1 || tabValue === 2) && item.todo_id) {
      checkLikeStatus(item.todo_id);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTodo(null);
    setIsLiked(false);
  };

  const showLikeButton = (tabValue === 1 || tabValue === 2);

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
            showLike={showLikeButton}
            isLiked={isLiked}
            onLikeToggle={handleLikeToggle}
            onEdit={null}
          />
        </Box>
      </Modal>
    </Box>
  );
}

export default Dashboard;