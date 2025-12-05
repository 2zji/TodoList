import { useEffect, useState } from "react";
import { Box, Button, TextField, Paper, Typography } from "@mui/material";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

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
    alignItems: "center",
    width: "90%",
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "28px 32px",
    boxShadow: "0 6px 10px rgba(0,0,0,0.06), 0 1px 18px rgba(0,0,0,0.08)",
  },

  card: {
    display: "flex",
    flexDirection: "column",
    width: "70%",
    height: "70%",
    padding: "100px",
  },

  button: {
    "&:focus": { outline: "none" },
    "&:focusVisible": { outline: "none", boxShadow: "none" },
  },
};

export default function Mypage() {
  const navigate = useNavigate();

  // 현재 날짜 계산
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    created_at: "",
  });

  const [loading, setLoading] = useState(true);

  const fetchUserInfo = async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
      setLoading(false);
    } catch (err) {
      console.error("회원정보 불러오기 실패:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const formatDate = (dt) => (dt ? new Date(dt).toLocaleDateString() : "");

  // 탈퇴 처리
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

  if (loading) return <div>Loading...</div>;

  return (
    <Box sx={styles.container}>
      <Box sx={styles.body}>
        <Paper sx={styles.card} elevation={0}>
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: 700,
              color: "#455a79",
            }}
          >
            회원 정보
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* User ID */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography sx={{ width: "20%", color: "#455a79" }}>
                User ID
              </Typography>
              <TextField
                disabled
                value={user.id}
                sx={{
                  width: "80%",
                  "& .MuiInputBase-input.Mui-disabled": {
                    color: "black",
                    WebkitTextFillColor: "black",
                  },
                }}
              />
            </Box>

            {/* 이름 */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography sx={{ width: "20%", color: "#455a79" }}>
                이름
              </Typography>
              <TextField
                value={user.name}
                disabled
                sx={{
                  width: "80%",
                  "& .MuiInputBase-input.Mui-disabled": {
                    color: "black",
                    WebkitTextFillColor: "black",
                  },
                }}
              />
            </Box>

            {/* 이메일 */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography sx={{ width: "20%", color: "#455a79" }}>
                e-mail
              </Typography>
              <TextField
                disabled
                value={user.email}
                sx={{
                  width: "80%",
                  "& .MuiInputBase-input.Mui-disabled": {
                    color: "black",
                    WebkitTextFillColor: "black",
                  },
                }}
              />
            </Box>

            {/* 마지막 로그인 (현재 날짜) */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography sx={{ width: "20%", color: "#455a79" }}>
                마지막 로그인
              </Typography>
              <TextField
                disabled
                value={`${year}년 ${month}월 ${day}일`}
                sx={{
                  width: "80%",
                  "& .MuiInputBase-input.Mui-disabled": {
                    color: "black",
                    WebkitTextFillColor: "black",
                  },
                }}
              />
            </Box>

            {/* 탈퇴 버튼 */}
            <Box sx={{ display: "flex", marginLeft: "auto", paddingTop: 9.8 }}>
              <Button
                variant="contained"
                color="error"
                sx={{ ...styles.button, size: "small" }}
                onClick={handleDelete}
              >
                탈퇴
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
