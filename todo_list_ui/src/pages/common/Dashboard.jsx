import { useCallback, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Box, Button, Modal, Typography, Pagination } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NewTodo from "./NewTodo";

function Dashboard() {
  const navigate = useNavigate();
  const handleNavigate = useCallback((path) => {
    console.log(`Navigating to ${path}`);
    navigate(path);
  }, []);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 900,
    height: 600,
    bgcolor: "background.paper",
    border: "1px solid #ccc",
    borderRadius: "1%",
    boxShadow: 20,
    p: 4,
  };

  const styles = {
    container: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    header: {
      height: "120px",
      width: "100%",
      fontSize: "45px",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingLeft: "40px",
      backgroundColor: "#f9f9f9",
      boxSizing: "border-box",
      borderBottom: "1px solid #ccc",
    },
    main: {
      flex: 1,
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    innerContainer: {
      width: "95%",
      height: "90%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid #ccc",
    },
    box: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid #ccc",
    },
    myTodo: {
      width: "50%",
      height: "90%",
      marginLeft: "60px",
      marginRight: "60px",
      flexDirection: "column",
      gap: "20px",
    },
    sideColumn: {
      display: "flex",
      flexDirection: "column",
      gap: "30px",
      width: "50%",
      marginRight: "60px",
    },
    sideBox: {
      width: "100%",
      height: "33.4vh",
    },
    button: {
      height: "30px",
      minWidth: "30px",
      maxWidth: "30px",
      borderRadius: "50%",
      backgroundColor: "#c5dbf0ff",
      position: "absolute",
      top: 10,
      right: 10,
    },
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>Hi User!</Box>

      <Box sx={styles.main}>
        <Box sx={styles.innerContainer}>
          <Box sx={{ ...styles.box, ...styles.myTodo, position: "relative" }}>
            My TODO

            <Button
              onClick={handleOpen}
              sx={{
                ...styles.button,
                outline: "none",
                "&:focus": { outline: "none" },
                "&:focusVisible": { outline: "none", boxShadow: "none" },
              }}
            >
              <AddIcon />
            </Button>

            <Modal open={open} onClose={handleClose}>
              <Box sx={modalStyle}>
                <NewTodo onClose={handleClose} />
              </Box>
            </Modal>

            <Pagination
              count={10}
              color="primary"
              sx={{
                "& .MuiPaginationItem-root": {
                  outline: "none",
                  boxShadow: "none",
                  "&:focus": { outline: "none" },
                  "&:focusVisible": { outline: "none", boxShadow: "none" },
                },
                position: "absolute",
                bottom: 20,
              }}
            />
          </Box>

          <Box sx={styles.sideColumn}>
            <Box sx={{ ...styles.box, ...styles.sideBox }}>Friends TODO</Box>
            <Box sx={{ ...styles.box, ...styles.sideBox }}>Likes TODO</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
