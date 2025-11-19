import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Friends from "./pages/friends/Friends";
import MyTodo from "./pages/myTodo/MyTodo";
import Dashboard from "./pages/common/Dashboard";
import Mypage from "./pages/common/Mypage";

// import './App.css'

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
};

function App() {
  const navigate = useNavigate();
  const handleNavigate = useCallback((path) => {
    // Navigation logic here
    console.log(`Navigating to ${path}`);
    navigate(path); 
  }, []);
  
  return (
    <div style={{width: "100vw", height: "100vh", display: "flex" }}>
      <div style={{ ...styles.menu }}>
        <div style={{ margin: "30px", marginTop: "30px" }} onClick={()=>handleNavigate("")}>Dashboard</div>
        <div style={{ margin: "30px", marginTop: "30px" }} onClick={()=>handleNavigate("myTodo")}>My TODO</div>
        <div style={{ margin: "30px", marginTop: "30px" }} onClick={()=>handleNavigate("friends")}>Friends</div>
        <div style={{ margin: "30px", marginTop: "30px" }} onClick={()=>handleNavigate("mypage")}>My Page</div>
        <div style={{ margin: "30px", position: "absolute", bottom: 0 }} onClick={()=>handleNavigate("logout")}>Logout</div>
      </div>
      <div style={{flex: 1}}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/myTodo" element={<MyTodo />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/mypage" element={<Mypage />} />
        </Routes>
      </div>
    
    </div>
  );
}

export default App;
