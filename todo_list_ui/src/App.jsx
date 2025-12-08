import { useEffect, useCallback, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Friends from "./pages/friends/Friends";
import MyTodo from "./pages/myTodo/MyTodo";
import Dashboard from "./pages/common/Dashboard";
import Mypage from "./pages/common/Mypage";
import api from "./api/axiosInstance";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import NotInterestedIcon from "@mui/icons-material/NotInterested";

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
    width: "100%",
    height: "100%",
    overflow: "auto",
  },
  header: {
    height: "100px",
    display: "flex",
    alignItems: "center",
    paddingLeft: "40px",
    paddingRight: "40px",
    background: "#f9f9f9",
    borderBottom: "1px solid #ccc",
  },
  menuUser: {
    "&.Mui-disabled": { color: "#000", opacity: 1 },
  },
};

function App() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    id: "",
    name: "",
  });

  const fetchUserInfo = async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch (err) {
      console.error("유저 정보 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

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

  const handleLogout = () => {
    try {
      api.post("/auth/logout");
      handleMenuClose();
    } catch (err) {
      console.error("로그아웃 실패:", err);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm(
      "정말 탈퇴하시겠습니까?\n(7일 후 완전히 삭제됩니다)"
    );
    if (!ok) return;

    try {
      await api.delete("/users/cleanup");
      alert("탈퇴 요청이 완료되었습니다.\n7일 후 완전히 삭제됩니다.");
      navigate("/login");
    } catch (err) {
      console.error("회원 탈퇴 실패:", err);
      alert("탈퇴 중 오류가 발생했습니다.");
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={styles.root}>
      {/* 왼쪽 메뉴 */}
      <div style={styles.menu}>
        <div
          style={{ margin: "30px", cursor: "pointer" }}
          onClick={() => handleNavigate("")}
        >
          Dashboard
        </div>
        <div
          style={{ margin: "30px", cursor: "pointer" }}
          onClick={() => handleNavigate("myTodo")}
        >
          My TODO
        </div>
        <div
          style={{ margin: "30px", cursor: "pointer" }}
          onClick={() => handleNavigate("friends")}
        >
          Friends
        </div>
      </div>

      {/* 메인 화면 */}
      <div style={styles.main}>
        <Box sx={styles.header}>
          <h2 style={{ margin: 0, fontSize: "40px" }}>Hi {user.name}!</h2>

          <Box sx={{ marginLeft: "auto", position: "relative" }}>
            <Button
              variant="contained"
              id="basic-button"
              aria-controls={open ? "user-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleMenuOpen}
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                minWidth: 0,
                padding: 0,
                color: "#fff",
                "&:focus": { outline: "none" },
                "&:focusVisible": { outline: "none", boxShadow: "none" },
              }}
            >
              <AccountCircleIcon />
            </Button>

            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem disabled sx={styles.menuUser}>
                ID: {user.id}
              </MenuItem>
              <MenuItem disabled sx={styles.menuUser}>
                Name: {user.name}
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  handleDelete();
                }}
              >
                <NotInterestedIcon sx={{ marginRight: 1 }} />
                Delete Account
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  handleLogout();
                }}
              >
                <LogoutIcon sx={{ marginRight: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
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
