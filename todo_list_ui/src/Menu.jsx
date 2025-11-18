import { useCallback } from "react";

export function Menu({ onAddTask }) {
  return (
    <div className="menu" style={styles.menu}>
      <div style={styles.item}>Dashboard</div>
      <div style={styles.item}>My Page</div>
      <div style={styles.item}>My TODO</div>
      <div style={styles.item}>Friends</div>
      <div style={styles.item}>Logout</div>
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
    width: "150px",
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    background: "#f9f9f9",
  },
  item: {
    cursor: "pointer",
    padding: "8px",
    borderRadius: "6px",
    transition: "0.2s",
  }
};
