import { Button } from "@mui/material";

function NewTodo({ onClose }) {
  const styles = {
    button: {
      backgroundColor: "#c5dbf0ff",
      position: "absolute",
    },
  };

  return (
    <>
      <h2 style={{ fontSize: "30px", margin: 0 }}>New TODO</h2>

      <div style={{ marginTop: 20 }}>
        <p>어쩌구저쩌구</p>
      </div>

      <Button
        onClick={onClose}
        sx={{
            ...styles.button,
          outline: "none",
          "&:focus": { outline: "none" },
          "&:focusVisible": { outline: "none", boxShadow: "none" },
          top: 35, right: 35,
        }}
      >
        닫기
      </Button>

      <Button
        onClick={onClose}
        sx={{
            ...styles.button,
          outline: "none",
          "&:focus": { outline: "none" },
          "&:focusVisible": { outline: "none", boxShadow: "none" },
          bottom: 35, left: 400,
        }}
      >
       등록
      </Button>

      <Button
        onClick={onClose}
        sx={{
            ...styles.button,
          outline: "none",
          "&:focus": { outline: "none" },
          "&:focusVisible": { outline: "none", boxShadow: "none" },
          bottom: 35, right: 400,
        }}
      >
        취소
      </Button>
    </>
  );
}

export default NewTodo;
