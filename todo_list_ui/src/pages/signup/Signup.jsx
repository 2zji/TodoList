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

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    passwd: "",
    confirmPasswd: "",
  });

  const [showPasswd, setShowPasswd] = useState(false);
  const [showConfirmPasswd, setShowConfirmPasswd] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSignup = async () => {
    if (formData.passwd !== formData.confirmPasswd) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!formData.email || !formData.name || !formData.passwd) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      const { confirmPasswd, ...signupData } = formData;

      const res = await api.post("/users/", signupData);
      console.log("Signup success:", res.data);

      alert("회원가입이 완료되었습니다!");
      navigate("/login");
    } catch (err) {
      console.error("Signup failed:", err);
      alert(err.response?.data?.detail || "회원가입에 실패했습니다.");
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate("/login");
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
          backgroundColor: "rgba(243, 243, 243, 1)",
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
            Sign up
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
            variant="outlined"
            autoComplete="off"
            fullWidth
            value={formData.name}
            onChange={handleChange("name")}
            placeholder="이름을 입력하세요"
          />

          <TextField
            type={showPasswd ? "text" : "password"}
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
                      onClick={() => setShowPasswd(!showPasswd)}
                      edge="end"
                      sx={styles.button}
                    >
                      {showPasswd ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            type={showConfirmPasswd ? "text" : "password"}
            autoComplete="off"
            variant="outlined"
            fullWidth
            value={formData.confirmPasswd}
            onChange={handleChange("confirmPasswd")}
            placeholder="비밀번호를 다시 입력하세요"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPasswd(!showConfirmPasswd)}
                      edge="end"
                      sx={styles.button}
                    >
                      {showConfirmPasswd ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleSignup}
            sx={{
              ...styles.button,
              mt: 1,
              py: 1.5,
              fontSize: "16px",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            회원가입
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
              이미 계정이 있으신가요?{" "}
            </Typography>
            <Link
              onClick={handleLoginClick}
              underline="hover"
              sx={{
                color: "#1976d2",
                fontSize: "14px",
                ml: 0.5,
                cursor: "pointer",
              }}
            >
              로그인
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
