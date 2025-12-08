import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import api from "../../api/axiosInstance";

export default function FriendsModal({ open, onClose }) {

  const [searchId, setSearchId] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success");
  const [snackbarMsg, setSnackbarMsg] = useState("");

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
      setSnackbarType("success");
      setSnackbarMsg("친구 요청을 보냈습니다!");
      setSnackbarOpen(true);
      setSearchId("");
      setSearchedUser(null);

    } catch (err) {
      setSnackbarType("error");
      setSnackbarMsg("친구 요청 실패");
      setSnackbarOpen(true);
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
        <IconButton
          onClick={onClose}
          sx={{ ...styles.button, position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAddIcon sx={{ fontSize: 30 }} />Add Friend
        </Typography>

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
                  Add Friend
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
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbarType} sx={{ width: "100%" }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
