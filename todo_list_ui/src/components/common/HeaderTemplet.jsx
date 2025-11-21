import { Box, Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

  const HeaderTemplet = ({title, onClose}) => {
    return (
      <Box sx={{width:"100%", height:"auto", display:"flex"}}>
        <h2 style={{ fontSize: "30px", margin: 0 }}>{title}</h2>
        <Button
          onClick={onClose}
          sx={{
            // ...styles.button,
            marginLeft:"auto",
            outline: "none",
            "&:focus": { outline: "none" },
            "&:focusVisible": { outline: "none", boxShadow: "none" },
          }}
        >
          <CloseIcon />
        </Button>
      </Box>
    );
  };
  export default HeaderTemplet