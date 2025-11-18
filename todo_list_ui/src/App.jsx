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

      <div style={{ ...styles.menu }}>
          <div style={{ margin: "30px", marginTop: "30px"}}>Dashboard</div>
          <div style={{ margin: "30px"}}>My TODO</div>
          <div style={{ margin: "30px"}}>Friends</div>
          <div style={{ margin: "30px"}}>My Page</div>
          <div style={{ margin: "30px", position: "absolute", bottom: 0}}>Logout</div>
      </div>

      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{height: "100px",width: "calc(100% - 20px)",fontSize: "30px",display: "flex",alignItems: "center",justifyContent: "flex-start",paddingLeft: "20px"}}>
          Hi User!
        </div>
        <div style={{flex: 1,width: "100%",display: "flex",alignItems: "center",justifyContent: "center"}}>
          Main
        </div>
      </div>
    </div>
  );
}

export default App;
