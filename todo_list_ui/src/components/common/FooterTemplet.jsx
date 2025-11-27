import { Box, Button } from "@mui/material";

const styles = {
  button: {
    "&:focus": { outline: "none" },
    "&:focusVisible": { outline: "none", boxShadow: "none" },
  },
};

const FooterTamplet = ({mode, onClose=()=>{}, onSave=()=>{}, onEdit=()=>{}}) => {
  return (
    <Box sx={{ display: "flex", gap: 3, justifyContent: "center", mt: 4 }}>
      {mode === "view" && onEdit && (
        <Button variant="contained" onClick={onEdit} sx={{ ...styles.button }}>
          편집
        </Button>
      )}
      {(mode === "create" || mode === "edit") && (
        <Button
          variant="contained"
          onClick={() => onSave()}
          sx={{ ...styles.button }}
        >
          저장
        </Button>
      )}
      <Button variant="outlined" onClick={onClose} sx={{ ...styles.button }}>
        닫기
      </Button>
    </Box>
  );
};
export default FooterTamplet;
