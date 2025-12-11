import { useEffect, useCallback, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Friends from "./pages/friends/Friends";
import MyTodo from "./pages/myTodo/MyTodo";
import Dashboard from "./pages/common/Dashboard";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import api from "./api/axiosInstance";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

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
  menubar: { cursor: "pointer", padding: "30px 10px", display: "flex" },

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
    padding: "0px 20px 14px 20px",
    borderBottom: "1px solid rgba(0,0,0,0.07)",
  },
  menuOption: {
    padding: "12px 25px",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    "&:hover": {
      background: "#F3F6FA",
    },
  },
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState({
    id: "",
    name: "",
  });

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  const fetchUserInfo = async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch (err) {
      console.error("유저 정보 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    if (!isAuthPage) {
      fetchUserInfo();
    }
  }, [isAuthPage]);

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
      handleMenuClose();
      navigate("/login");
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

  // 로그인/회원가입 페이지면 레이아웃 없이 렌더링
  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    );
  }

  return (
    <div style={styles.root}>
      {/* 왼쪽 메뉴 */}
      <div style={styles.menu}>
        <div style={styles.menubar} onClick={() => handleNavigate("")}>
          <DashboardIcon sx={{ marginRight: 1 }} />
          Dashboard
        </div>
        <div style={styles.menubar} onClick={() => handleNavigate("myTodo")}>
          <ListAltIcon sx={{ marginRight: 1 }} />
          My TODO
        </div>
        <div style={styles.menubar} onClick={() => handleNavigate("friends")}>
          <PeopleAltIcon sx={{ marginRight: 1 }} />
          Friends
        </div>
      </div>

      {/* 메인 화면 */}
      <div style={styles.main}>
        <Box sx={styles.header}>
          <h2 style={{ margin: 0, fontSize: "38px" }}>Hi {user.name}!</h2>

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
                background: "#2A75F3",
                "&:hover": { background: "#1E63D1" },
                boxShadow: "0px 3px 8px rgba(0,0,0,0.15)",
                "&:focus": { outline: "none" },
                "&:focusVisible": { outline: "none", boxShadow: "none" },
              }}
            >
              <AccountCircleIcon sx={{ width: "80%", height: "80%" }} />
            </Button>

            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              slotProps={{
                paper: {
                  sx: {
                    mt: "6px",
                    padding: "10px 0",
                    borderRadius: "12px",
                    boxShadow: "0px 8px 20px rgba(0,0,0,0.08)",
                    width: "250px",
                  },
                },
              }}
            >
              <Box
                sx={{
                  ...styles.menuUser,
                  display: "flex",
                  gap: "15px",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "#E8EEF5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AccountCircleOutlinedIcon sx={{ color: "#5B646F" }} />
                </Box>

                <Box>
                  <Typography sx={{ color: "#5B646F", fontSize: "14px" }}>
                    @{user.id}
                  </Typography>
                  <Typography sx={{ color: "#333", fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                </Box>
              </Box>

              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  handleDelete();
                }}
                sx={{
                  ...styles.menuOption,
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  fontSize: "15px",
                  color: "#3A4856",
                }}
              >
                <SettingsOutlinedIcon sx={{ color: "#5B646F", pr: "11px" }} />
                Quit
              </MenuItem>

              <MenuItem
                onClick={handleLogout}
                sx={{
                  ...styles.menuOption,
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  fontSize: "15px",
                  color: "#3A4856",
                }}
              >
                <LogoutOutlinedIcon sx={{ color: "#5B646F", pr: "11px" }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/myTodo" element={<MyTodo />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
