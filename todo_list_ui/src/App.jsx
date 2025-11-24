import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Friends from "./pages/friends/Friends";
import MyTodo from "./pages/myTodo/MyTodo";
import Dashboard from "./pages/common/Dashboard";
import Mypage from "./pages/common/Mypage";
import { Box } from "@mui/material";
import { display, flexDirection, width } from "@mui/system";

// import './App.css'

const styles = {
  root: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    overflow: "hidden",
  },
  menu: {
    width: "200px",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    borderRight: "1px solid #ccc",
    background: "#f9f9f9",
    boxSizing: "border-box",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    // flexGrow: 1,
    width:"1720px",
    height: "100%",
    overflow: "auto",
  },
  header: {
    // width: "100%",
    height: "120px",
    display: "flex",
    alignItems: "center",
    paddingLeft: "40px",
    background: "#f9f9f9",
    borderBottom: "1px solid #ccc",
  },
};

function App() {
  const navigate = useNavigate();
  const [isFriends, setIsFriends] = useState(false);
  const handleNavigate = useCallback((path) => {
    // Navigation logic here
    console.log(`Navigating to ${path}`, isFriends);
    if (path === "friends") setIsFriends(true);
    else setIsFriends(false);
    navigate(path);
  }, []);

  return (
    <div style={styles.root}>
      <div style={styles.menu}>
        <div
          style={{ margin: "30px", marginTop: "30px" }}
          onClick={() => handleNavigate("")}
        >
          Dashboard
        </div>
        <div
          style={{ margin: "30px", marginTop: "30px" }}
          onClick={() => handleNavigate("myTodo")}
        >
          My TODO
        </div>
        <div
          style={{ margin: "30px", marginTop: "30px" }}
          onClick={() => handleNavigate("friends")}
        >
          Friends
        </div>
        <div
          style={{ margin: "30px", marginTop: "30px" }}
          onClick={() => handleNavigate("mypage")}
        >
          My Page
        </div>
        <div
          style={{ margin: "30px", position: "absolute", bottom: 0 }}
          onClick={() => handleNavigate("logout")}
        >
          Logout
        </div>
      </div>
      <div style={styles.main}>
        {!isFriends && (
          <Box sx={styles.header}>
            <h2 style={{ margin: 0, fontSize: "40px" }}>Hi User!</h2>
          </Box>
        )}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/myTodo" element={<MyTodo />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/mypage" element={<Mypage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
