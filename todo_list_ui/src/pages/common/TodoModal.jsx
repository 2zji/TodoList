import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import axios from "axios";


function TodoModal({
  mode = "create",
  selectedTodo = {},
  setSelectedTodo,
}) {
  const [inputValue, setInputValue] = useState({
    title: "",
    description: "",
    publicity: true,
    priority: "medium",
    status: "in_progress",
  });
  
  const isReadOnly = mode === "view";

  useEffect(() => {
    console.log(selectedTodo)
    if ((mode === "view" || mode === "edit") && selectedTodo) {
      setInputValue({
        title: selectedTodo.title ?? "",
        description: selectedTodo.description ?? selectedTodo.description ?? "",
        publicity: selectedTodo.publicity ?? true,
        priority: (selectedTodo.priority ?? "medium").toLowerCase(),
        status: (selectedTodo.status ?? "in_progress").toLowerCase(),
      });
    } else if (mode === "create") {
      setInputValue({
        title: "",
        description: "",
        publicity: true,
        priority: "medium",
        status: "in_progress",
      });
    }
  }, [mode]);
  
  const handleChange = (field) => (e) => {
    setInputValue((prev) => ({ ...prev, [field]: e.target.value }));
    setSelectedTodo((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* 제목 */}
      <Box sx={{ display: "flex", gap: 4 }}>
        <Typography sx={{ width: "20%" }}>Title</Typography>
        <Box sx={{ width: "80%" }}>
          {isReadOnly ? (
            <Typography>{inputValue.title}</Typography>
          ) : (
            <TextField
              value={inputValue.title}
              onChange={handleChange("title")}
              size="small"
              fullWidth
              placeholder="제목을 입력해주세요."
              slotProps={{ input: { readOnly: isReadOnly } }}
            />
          )}
        </Box>
      </Box>

      {/* 내용 */}
      <Box sx={{ display: "flex", gap: 4 }}>
        <Typography sx={{ width: "20%" }}>Description</Typography>
        <Box sx={{ width: "80%" }}>
          {isReadOnly ? (
            <Typography sx={{ whiteSpace: "pre-wrap" }}>
              {inputValue.description}
            </Typography>
          ) : (
            <TextField
              value={inputValue.description}
              onChange={handleChange("description")}
              fullWidth
              multiline
              rows={4}
              placeholder="내용을 입력해주세요."
              slotProps={{ input: { readOnly: isReadOnly } }}
            />
          )}
        </Box>
      </Box>

      {/* 공개여부 */}
      <Box sx={{ display: "flex", gap: 4 }}>
        <Typography sx={{ width: "20%" }}>publicity</Typography>
        <RadioGroup
          row
          name="publicity"
          value={inputValue.publicity}
          onChange={handleChange("publicity")}
        >
          <FormControlLabel
            value="true"
            control={<Radio />}
            label="public"
            disabled={isReadOnly}
          />
          <FormControlLabel
            value="false"
            control={<Radio />}
            label="private"
            disabled={isReadOnly}
          />
        </RadioGroup>
      </Box>

      {/* 중요도 */}
      <Box sx={{ display: "flex", gap: 4 }}>
        <Typography sx={{ width: "20%" }}>Priority</Typography>
        <RadioGroup
          row
          name="priority"
          value={inputValue.priority}
          onChange={handleChange("priority")}
        >
          <FormControlLabel
            value="low"
            control={<Radio />}
            label="low"
            disabled={isReadOnly}
          />
          <FormControlLabel
            value="medium"
            control={<Radio />}
            label="medium"
            disabled={isReadOnly}
          />
          <FormControlLabel
            value="high"
            control={<Radio />}
            label="high"
            disabled={isReadOnly}
          />
        </RadioGroup>
      </Box>

      {/* 상태 */}
      <Box sx={{ display: "flex", gap: 4 }}>
        <Typography sx={{ width: "20%" }}>Status</Typography>
        <RadioGroup
          row
          name="status"
          value={inputValue.status}
          onChange={handleChange("status")}
        >
          <FormControlLabel
            value="in_progress"
            control={<Radio />}
            label="inProgress"
            disabled={isReadOnly}
          />
          <FormControlLabel
            value="pending"
            control={<Radio />}
            label="pending"
            disabled={isReadOnly}
          />
          <FormControlLabel
            value="close"
            control={<Radio />}
            label="close"
            disabled={isReadOnly}
          />
        </RadioGroup>
      </Box>
    </Box>
  );
}

export default TodoModal;
