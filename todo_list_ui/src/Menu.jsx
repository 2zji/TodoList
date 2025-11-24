import { useCallback } from "react";

export function Menu({ onAddTask }) {
  return (
    <div style={{ ...styles.menu }}>
          <a href="index.html"><div style={{ margin: "30px", marginTop: "30px" }}>Dashboard</div></a>
          <a href="MyTodo.jsx"><div style={{ margin: "30px" }}>My TODO</div></a>
          <a href="Friends.jsx"><div style={{ margin: "30px" }}>Friends</div></a>
          <a href="index.html"><div style={{ margin: "30px" }}>My Page</div></a>
          <a href="index.html"><div style={{ margin: "30px", position: "absolute", bottom: 0 }}>Logout</div></a>
      </div>
  );
}

const styles = {
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "20px",
    borderRight: "1px solid #ccc",
    width: "200px", 
    background: "#f9f9f9",
  },
  item: {
    cursor: "pointer",
    padding: "8px",
    borderRadius: "6px",
    transition: "0.2s",
  }
};
