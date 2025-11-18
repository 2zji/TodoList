import { useCallback } from "react";

export function Header({ onAddTask }) {
  return (
    <div className="menu" style={styles.menu}>
      <div style={styles.item}>Hi user!</div>
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
    width: "100vw",
    height: "40px",
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
