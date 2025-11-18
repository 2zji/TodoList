import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
// import './App.css'

const styles = {
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "20px",
    borderRight: "1px solid #ccc",
    width: "150px", 
    background: "#f9f9f9",
  },
  item: {
    cursor: "pointer",
    padding: "8px",
    borderRadius: "6px",
    transition: "0.2s",
  },
};

function App() {
  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      {/* LeftSide */}
      <div style={{ ...styles.menu }}>
          <div>Dashboard</div>
          <div>My Page</div>
          <div>My TODO</div>
          <div>Friends</div>
          <div>Logout</div>
      </div>
      {/* Main */}
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{height: "100px", fontSize: "30px", textAlign:"center"}}>Header</div>
        <div style={{height: "100%"}}>Main</div>
      </div>
    </div>
  );
}

export default App;
