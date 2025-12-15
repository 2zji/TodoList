import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
  Chip,
  IconButton,
  Grid,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const TAG_COLORS = {
  publicity: {
    Public: "#2D9CDB",
    Private: "#636E72",
  },
  priority: {
    Low: "#6AB04A",
    Medium: "#F39C12",
    High: "#E84118",
  },
  status: {
    Pending: "#778CA3",
    InProgress: "#22A6B3",
    Completed: "#1ABC9C",
  },
};

function TodoModal({
  mode = "create",
  selectedTodo = null,
  setSelectedTodo,
  showLike = false,
  isLiked = false,
  onLikeToggle = () => {},
}) {
  const [inputValue, setInputValue] = useState({
    title: "",
    description: "",
    publicity: "true",
    priority: "medium",
    status: "in_progress",
  });

  const isReadOnly = mode === "view";

  useEffect(() => {
    if ((mode === "view" || mode === "edit") && selectedTodo) {
      setInputValue({
        title: selectedTodo.title ?? "",
        description: selectedTodo.description ?? "",
        publicity: String(selectedTodo.publicity ?? true),
        priority: (selectedTodo.priority ?? "medium").toLowerCase(),
        status: (selectedTodo.status ?? "in_progress").toLowerCase(),
      });
    } else if (mode === "create") {
      setInputValue({
        title: "",
        description: "",
        publicity: "true",
        priority: "medium",
        status: "in_progress",
      });
    }
  }, [mode, selectedTodo]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setInputValue((prev) => ({ ...prev, [field]: value }));

    if (setSelectedTodo) {
      const updatedValue = field === "publicity" ? value === "true" : value;
      setSelectedTodo((prev) => ({ ...prev, [field]: updatedValue }));
    }
  };

  const getPublicityLabel = () =>
    inputValue.publicity === "true" ? "Public" : "Private";
  const getPriorityLabel = () =>
    inputValue.priority.charAt(0).toUpperCase() + inputValue.priority.slice(1);
  const getStatusLabel = () => {
    const statusMap = {
      pending: "Pending",
      in_progress: "InProgress",
      completed: "Completed",
    };
    return statusMap[inputValue.status] || "InProgress";
  };

  if (isReadOnly) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Box sx={{ flexShrink: 0 }}>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              mb: 3,
              alignItems: "center",
            }}
          >
            {mode === "view" && showLike && (
              <IconButton
                onClick={onLikeToggle}
                size="small"
                sx={{
                  color: isLiked ? "#2A75F3" : "#999",
                  "&:focus": { outline: "none" },
                  "&:focusVisible": { outline: "none", boxShadow: "none" },
                }}
              >
                {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            )}
            <Chip
              label={getPublicityLabel()}
              sx={{
                bgcolor: TAG_COLORS.publicity[getPublicityLabel()],
                color: "#fff",
                fontWeight: 500,
              }}
            />
            <Chip
              label={getPriorityLabel()}
              sx={{
                bgcolor: TAG_COLORS.priority[getPriorityLabel()],
                color: "#fff",
                fontWeight: 500,
              }}
            />
            <Chip
              label={getStatusLabel()}
              sx={{
                bgcolor: TAG_COLORS.status[getStatusLabel()],
                color: "#fff",
                fontWeight: 500,
              }}
            />
          </Box>
        </Box>

        <Box sx={{ flex: 1, overflow: "auto", pr: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, mb: 1, color: "#666" }}
          >
            Description
          </Typography>
          <Typography
            sx={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.6,
              color: "#333",
            }}
          >
            {inputValue.description || "내용이 없습니다."}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", gap: 4 }}>
        <Typography sx={{ width: "20%", fontWeight: 500 }}>Title</Typography>
        <Box sx={{ width: "80%" }}>
          <TextField
            value={inputValue.title}
            onChange={handleChange("title")}
            size="small"
            fullWidth
            placeholder="제목을 입력해주세요."
            required
            error={inputValue.title.trim() === ""}
          />
        </Box>
      </Box>

      {/* 내용 */}
      <Box sx={{ display: "flex", gap: 4 }}>
        <Typography sx={{ width: "20%", fontWeight: 500 }}>
          Description
        </Typography>
        <Box sx={{ width: "80%", height: 180 }}>
          <TextField
            value={inputValue.description}
            onChange={handleChange("description")}
            fullWidth
            multiline
            placeholder="내용을 입력해주세요."
            minRows={4}
            required
            error={inputValue.description.trim() === ""}
            slotProps={{
              input: {
                sx: {
                  maxHeight: 180,
                  overflow: "auto",
                },
              },
            }}
          />
        </Box>
      </Box>

      {/* 공개여부 */}
      <Box sx={{ display: "flex", gap: 4 }}>
        <Typography sx={{ width: "20%", fontWeight: 500 }}>
          Publicity
        </Typography>
        <RadioGroup
          row
          name="publicity"
          value={inputValue.publicity}
          onChange={handleChange("publicity")}
        >
          <FormControlLabel value="true" control={<Radio />} label="Public" />
          <FormControlLabel value="false" control={<Radio />} label="Private" />
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
          <FormControlLabel value="low" control={<Radio />} label="Low" />
          <FormControlLabel value="medium" control={<Radio />} label="Medium" />
          <FormControlLabel value="high" control={<Radio />} label="High" />
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
          />
          <FormControlLabel
            value="in_progress"
            control={<Radio />}
            label="In Progress"
          />
          <FormControlLabel
            value="completed"
            control={<Radio />}
            label="Completed"
          />
        </RadioGroup>
      </Box>
    </Box>
  );
}

export default TodoModal;
