import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import api from "../../api/axiosInstance";

export default function FriendsModal({ open, onClose }) {
  const [searchId, setSearchId] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);

  const handleSearch = async () => {
    if (!searchId) return;
    try {
      const res = await api.get(`/friends/checked/${searchId}`);
      setSearchedUser(res.data);
    } catch (err) {
      setSearchedUser("NOT_FOUND");
    }
  };

  const handleSendRequest = async () => {
    if (!searchedUser || searchedUser === "NOT_FOUND") return;
    try {
      await api.post(`/friends/${searchedUser.user.id}`);
      alert("친구 요청을 보냈습니다!");
      setSearchedUser(null);
      setSearchId("");
      onClose();
    } catch (err) {
      alert("요청 실패");
    }
  };

  const styles = {
    button: {
      "&:focus": { outline: "none" },
      "&:focusVisible": { outline: "none", boxShadow: "none" },
    },
  };

  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1300,
      }}
    >
      <Paper sx={{ p: 4, width: 400, borderRadius: 2, position: "relative" }}>
        {/* Close 버튼 */}
        <IconButton
          onClick={onClose}
          sx={{ ...styles.button, position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" mb={3}>
          Add Friend
        </Typography>

        {/* 검색 입력 */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            placeholder="User ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            size="small"
            fullWidth
          />
          <Button variant="contained" onClick={handleSearch} sx={styles.button}>
            <SearchIcon />
          </Button>
        </Box>

        {/* 검색 결과 */}
        {searchedUser && searchedUser !== "NOT_FOUND" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
            <Typography>ID: {searchedUser.user.id}</Typography>
            <Typography>Name: {searchedUser.user.name}</Typography>

            {searchedUser.status === "none" && (
              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={handleSendRequest}
                  fullWidth
                  sx={styles.button}
                >
                  Send Request
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  onClick={() => setSearchedUser(null)}
                  fullWidth
                  sx={styles.button}
                >
                  Cancel
                </Button>
              </Box>
            )}

            {searchedUser.status === "accepted" && (
              <Typography mt={1} color="primary">
                이미 친구입니다.
              </Typography>
            )}
            {searchedUser.status === "pending" && (
              <Typography mt={1} color="warning.main">
                친구 요청 대기중입니다.
              </Typography>
            )}
            {searchedUser.status === "rejected" && (
              <Typography mt={1} color="error">
                관리자에게 문의 바랍니다.
              </Typography>
            )}
          </Box>
        )}

        {searchedUser === "NOT_FOUND" && (
          <Typography color="error" mb={2}>
            존재하지 않는 ID입니다.
          </Typography>
        )}

        {/* 하단 Close 버튼 */}
        <Button variant="outlined" fullWidth onClick={onClose} sx={styles.button}>
          Close
        </Button>
      </Paper>
    </Box>
  );
}
