import { useCallback } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Friends from "./pages/friends/Friends";
import MyTodo from "./pages/myTodo/MyTodo";
import Dashboard from "./pages/common/Dashboard";
import Mypage from "./pages/common/Mypage";
import { Box } from "@mui/material";

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
    width: "1720px",
    height: "100%",
    overflow: "auto",
  },
  header: {
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
  const location = useLocation();

  const isFriends = location.pathname === "/friends";

  const toAbsolute = (path) => {
    if (!path || path === "") return "/";
    return path.startsWith("/") ? path : `/${path}`;
  };

  const handleNavigate = useCallback(
    (path) => {
      const to = toAbsolute(path);
      navigate(to);
    },
    [navigate]
  );

  return (
    <div style={styles.root}>
      <div style={styles.menu}>
        <div
          style={{ margin: "30px", marginTop: "30px", cursor: "pointer" }}
          onClick={() => handleNavigate("")}
        >
          Dashboard
        </div>
        <div
          style={{ margin: "30px", marginTop: "30px", cursor: "pointer" }}
          onClick={() => handleNavigate("myTodo")}
        >
          My TODO
        </div>
        <div
          style={{ margin: "30px", marginTop: "30px", cursor: "pointer" }}
          onClick={() => handleNavigate("friends")}
        >
          Friends
        </div>
        <div
          style={{ margin: "30px", marginTop: "30px", cursor: "pointer" }}
          onClick={() => handleNavigate("mypage")}
        >
          My Page
        </div>
        <div
          style={{
            margin: "30px",
            position: "absolute",
            bottom: 0,
            cursor: "pointer",
          }}
          onClick={() => handleNavigate("logout")}
        >
          Logout
        </div>
      </div>

      <div style={styles.main}>
        <Box sx={styles.header}>
          <h2 style={{ margin: 0, fontSize: "40px" }}>Hi User!</h2>
        </Box>

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
