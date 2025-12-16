import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import api from "../../api/axiosInstance";

const styles = {
  button: {
    "&:focus": { outline: "none" },
    "&:focusVisible": { outline: "none", boxShadow: "none" },
  },
};

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    passwd: "",
  });

  const [showpasswd, setShowpasswd] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", formData);
      console.log("Login success:", res.data);

      if (res.data.access_token) {
        localStorage.setItem("accessToken", res.data.access_token);
        console.log("Token saved:", localStorage.getItem("accessToken"));
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    }
  };

  const handleSignupClick = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          width: "60%",
          //  backgroundImage: "url(/testBack.jpg)",
          //  backgroundColor: "rgba(243, 243, 243, 1)",
          backgroundImage: "url(/todoimg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <Box
        sx={{
          width: "40%",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              textAlign: "center",
              mb: 2,
              color: "#333",
            }}
          >
            Login
          </Typography>

          <TextField
            type="email"
            autoComplete="off"
            variant="outlined"
            fullWidth
            value={formData.email}
            onChange={handleChange("email")}
            placeholder="이메일을 입력하세요"
          />

          <TextField
            type={showpasswd ? "text" : "password"}
            autoComplete="off"
            variant="outlined"
            fullWidth
            value={formData.passwd}
            onChange={handleChange("passwd")}
            placeholder="비밀번호를 입력하세요"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowpasswd(!showpasswd)}
                      edge="end"
                      sx={styles.button}
                    >
                      {showpasswd ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            sx={{
              ...styles.button,
              mt: 1,
              py: 1.5,
              fontSize: "16px",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            로그인
          </Button>

          <Box
            sx={{
              textAlign: "center",
              mt: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ color: "#5B646F", fontSize: "14px" }}>
              TodoList가 처음이신가요?{" "}
            </Typography>
            <Link
              onClick={handleSignupClick}
              underline="hover"
              sx={{
                color: "#1976d2",
                fontSize: "14px",
                ml: 0.5,
                cursor: "pointer",
              }}
            >
              회원가입
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
