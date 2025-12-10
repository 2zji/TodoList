import { Box, Button, IconButton } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const styles = {
  button: {
    "&:focus": { outline: "none" },
    "&:focusVisible": { outline: "none", boxShadow: "none" },
  },
};

const FooterTamplet = ({
  mode, 
  selectedTodo, 
  onClose = () => {}, 
  onSave = () => {}, 
  onEdit = () => {},
  showLike = false,
  isLiked = false,
  onLikeToggle = () => {}
}) => {
  return (
    <Box sx={{ display: "flex", gap: 3, justifyContent: "center", alignItems: "center", mt: 4 }}>
      {mode === "view" && showLike && (
        <IconButton 
          onClick={onLikeToggle}
          sx={{ 
            ...styles.button,
            color: isLiked ? "#2A75F3" : "#999"
          }}
        >
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      )}
      
      {mode === "view" && onEdit && (
        <Button variant="contained" onClick={onEdit} sx={{ ...styles.button }}>
          편집
        </Button>
      )}
      
      {(mode === "create" || mode === "edit") && (
        <Button
          variant="contained"
          onClick={() => onSave(selectedTodo)}
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