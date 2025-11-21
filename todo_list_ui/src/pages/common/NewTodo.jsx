import { Button } from "@mui/material";
import { useEffect, useState } from "react";

const styles = {
  button: {
    backgroundColor: "#c5dbf0ff",
    position: "absolute",
  },
};

function NewTodo({updateMode, isViwer, infoObject = {}}) {
  const [inputValue, setInputValue] = useState({
    title:"",
    discription:"",
    status:"",
    priority:"",
    disclosure:"",
  });

  useEffect(()=>{
    if(updateMode){
      setInputValue(infoObject)
    }
  },[])

  return (
    <>
      <div style={{ marginTop: 10 }}>
        <p>제목</p> 
        {updateMode && <input value={inputValue.title} readOnly={isViwer}/>}
      </div>
      <div style={{ marginTop: 10 }}>
        <p>내용</p> 
        {updateMode && <input value={inputValue.discription} readOnly={isViwer}/>}
      </div>
      <div style={{ marginTop: 10 }}>
        <p>상태</p> 
        {updateMode && <input value={inputValue.status} readOnly={isViwer}/>}
      </div>
      <div style={{ marginTop: 10 }}>
        <p>중요도</p> 
        {updateMode && <input value={inputValue.priority} readOnly={isViwer}/>}
      </div>
      <div style={{ marginTop: 10 }}>
        <p>공개여부</p> 
        {updateMode && <input value={inputValue.disclosure} readOnly={isViwer}/>}
      </div>
    </>
  );
}

export default NewTodo;
