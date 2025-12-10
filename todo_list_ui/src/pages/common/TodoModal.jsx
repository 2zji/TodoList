import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";

function TodoModal({ mode = "create", selectedTodo = null, setSelectedTodo }) {
  const [inputValue, setInputValue] = useState({
    title: "",
    description: "",
    publicity: true,
    priority: "medium",
    status: "in_progress",
  });

  const isReadOnly = mode === "view";

  useEffect(() => {
    if ((mode === "view" || mode === "edit") && selectedTodo) {
      setInputValue({
        title: selectedTodo.title ?? "",
        description: selectedTodo.description ?? "",
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
  }, [mode, selectedTodo]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setInputValue((prev) => ({ ...prev, [field]: value }));
    if (setSelectedTodo) {
      setSelectedTodo((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* 제목 */}
      <Box sx={{ display: "flex", gap: 4 }}>
        <Typography sx={{ width: "20%", fontWeight: 500 }}>Title</Typography>
        <Box sx={{ width: "80%" }}>
          {isReadOnly ? (
            <Typography>{inputValue.title || "-"}</Typography>
          ) : (
            <TextField
              value={inputValue.title}
              onChange={handleChange("title")}
              size="small"
              fullWidth
              placeholder="제목을 입력해주세요."
            />
          )}
        </Box>
      </Box>

      {/* 내용 */}
      <Box sx={{ display: "flex", gap: 4 }}>
        <Typography sx={{ width: "20%", fontWeight: 500 }}>Description</Typography>
        <Box sx={{ width: "80%" }}>
          {isReadOnly ? (
            <Typography sx={{ whiteSpace: "pre-wrap" }}>
              {inputValue.description || "null"}
            </Typography>
          ) : (
            <TextField
              value={inputValue.description}
              onChange={handleChange("description")}
              fullWidth
              multiline
              rows={4}
              placeholder="내용을 입력해주세요."
            />
          )}
        </Box>
      </Box>

      {/* 공개여부 */}
      <Box sx={{ display: "flex", gap: 4 }}>
        <Typography sx={{ width: "20%", fontWeight: 500 }}>Publicity</Typography>
        <RadioGroup
          row
          name="publicity"
          value={inputValue.publicity}
          onChange={handleChange("publicity")}
        >
          <FormControlLabel
            value={true}
            control={<Radio />}
            label="Public"
            disabled={isReadOnly}
          />
          <FormControlLabel
            value={false}
            control={<Radio />}
            label="Private"
            disabled={isReadOnly}
          />
        </RadioGroup>
      </Box>

      {/* 중요도 */}
      <Box sx={{ display: "flex", gap: 4 }}>
        <Typography sx={{ width: "20%", fontWeight: 500 }}>Priority</Typography>
        <RadioGroup
          row
          name="priority"
          value={inputValue.priority}
          onChange={handleChange("priority")}
        >
          <FormControlLabel
            value="low"
            control={<Radio />}
            label="Low"
            disabled={isReadOnly}
          />
          <FormControlLabel
            value="medium"
            control={<Radio />}
            label="Medium"
            disabled={isReadOnly}
          />
          <FormControlLabel
            value="high"
            control={<Radio />}
            label="High"
            disabled={isReadOnly}
          />
        </RadioGroup>
      </Box>

      {/* 상태 */}
      <Box sx={{ display: "flex", gap: 4 }}>
        <Typography sx={{ width: "20%", fontWeight: 500 }}>Status</Typography>
        <RadioGroup
          row
          name="status"
          value={inputValue.status}
          onChange={handleChange("status")}
        >
          <FormControlLabel
            value="pending"
            control={<Radio />}
            label="Pending"
            disabled={isReadOnly}
          />
          <FormControlLabel
            value="in_progress"
            control={<Radio />}
            label="In Progress"
            disabled={isReadOnly}
          />
          <FormControlLabel
            value="completed"
            control={<Radio />}
            label="Completed"
            disabled={isReadOnly}
          />
        </RadioGroup>
      </Box>
    </Box>
  );
}

export default TodoModal;