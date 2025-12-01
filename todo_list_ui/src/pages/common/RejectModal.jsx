// src/components/common/RejectModal.jsx
import { Modal, Box, Typography, Button } from "@mui/material";

function RejectModal({ open, onClose, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 380,
          bgcolor: "#fff",
          p: 3,
          borderRadius: "12px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          친구 요청을 거절할까요?
        </Typography>

        <Typography sx={{ mb: 3 }}>
          거절 시, 서로 다시 친구 신청이 불가능합니다.
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="error"
            sx={{ flex: 1 }}
            onClick={onConfirm}
          >
            거절하기
          </Button>

          <Button
            variant="outlined"
            sx={{ flex: 1 }}
            onClick={onClose}
          >
            취소
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default RejectModal;
