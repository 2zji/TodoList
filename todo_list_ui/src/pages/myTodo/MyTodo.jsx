import { useCallback, useState } from "react";
import { Box, Button, Modal, Pagination, Tab, Tabs } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NewTodo from "../../pages/common/NewTodo";
import HeaderTemplet from "../../components/common/HeaderTemplet";

function MyTodo() {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const infoObject = {
    title: "오늘의 할일",
    discription: "오늘의 할일",
    status: "진행전",
    priority: "매우 높음",
    disclosure: "비공개",
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleTabChange = (_, newValue) => setTabValue(newValue);

  const styles = {
    button: {
      backgroundColor: "#c5dbf0ff",
      "&:focus": { outline: "none" },
      "&:focusVisible": { outline: "none", boxShadow: "none" },
    },
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "900px",
    height: "600px",
    bgcolor: "background.paper",
    borderRadius: "10px",
    p: 4,
    outline: "none",
  };

  const FooterButtons = () => (
    <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
      <Button sx={styles.button}>등록</Button>
      <Button sx={styles.button}>취소</Button>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: "120px",
          display: "flex",
          alignItems: "center",
          paddingLeft: "40px",
          background: "#f9f9f9",
          borderBottom: "1px solid #ccc",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "40px" }}>Hi User!</h2>
      </Box>

      {/* Main */}
      <Box sx={{ padding: 4, height: "calc(100% - 190px)" }}>
        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              outline: "none",
              boxShadow: "none",
              "&:focus": { outline: "none" },
              "&:focusVisible": { outline: "none", boxShadow: "none" },
            },
            marginBottom: 3,
          }}
        >
          <Tab label="My TODO" />
          <Tab label="Friends TODO" />
          <Tab label="Likes TODO" />
        </Tabs>

        {/* Content */}
        <Box
          sx={{
            border: "1px solid #ccc",
            height: "85%",
            borderRadius: "6px",
            padding: 2,
            position: "relative",
          }}
        >
          <Box sx={{ height: "95%" }}>
            {tabValue === 0 && <div>My TODO</div>}
            {tabValue === 1 && <div>Friends TODO</div>}
            {tabValue === 2 && <div>Likes TODO</div>}
          </Box>

          {/* Add Button
          {tabValue === 0 && (
            <Button
              onClick={handleOpen}
              sx={{
                ...styles.button,
                position: "absolute",
                top: 10,
                right: 10,
                borderRadius: "50%",
                minWidth: "40px",
                maxWidth: "40px",
              }}
            >
              <AddIcon />
            </Button>
          )} */}

          {/* Pagination */}
          <Box
            sx={{
              width: "100%",
              height: "calc(100%-90%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pagination
              count={10}
              color="primary"
              
            />
          </Box>
        </Box>
      </Box>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <HeaderTemplet title="New TODO" />
          <Box sx={{ height: "500px", mt: 2 }}>
            <NewTodo updateMode={true} isViwer={true} infoObject={infoObject} />
          </Box>
          <FooterButtons />
        </Box>
      </Modal>
    </Box>
  );
}

export default MyTodo;
