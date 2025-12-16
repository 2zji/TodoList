import { forwardRef, useEffect, useState, useImperativeHandle } from "react";
import {
  Box,
  TextField,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
  Chip,
  IconButton,
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

const TodoModal = forwardRef(
  (
    {
      mode = "create",
      selectedTodo = null,
      setSelectedTodo,
      showLike = false,
      isLiked = false,
      onLikeToggle = () => {},
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState({
      title: "",
      description: "",
      publicity: "true",
      priority: "medium",
      status: "in_progress",
    });

    const [errors, setErrors] = useState({
      title: false,
      description: false,
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
        setErrors({ title: false, description: false });
      } else if (mode === "create") {
        setInputValue({
          title: "",
          description: "",
          publicity: "true",
          priority: "medium",
          status: "in_progress",
        });
        setErrors({ title: false, description: false });
      }
    }, [mode, selectedTodo]);

    const handleChange = (field) => (e) => {
      const value = e.target.value;

      setInputValue((prev) => ({ ...prev, [field]: value }));
      if (field === "title" || field === "description") {
        setErrors((prev) => ({
          ...prev,
          [field]: value.trim() === "",
        }));
      }
    };

    const validateAndGetData = () => {
      const newErrors = {
        title: inputValue.title.trim() === "",
        description: inputValue.description.trim() === "",
      };

      setErrors(newErrors);
      if (newErrors.title || newErrors.description) return null;

      return {
        title: inputValue.title.trim(),
        description: inputValue.description.trim(),
        publicity: inputValue.publicity === "true",
        priority: inputValue.priority,
        status: inputValue.status,
      };
    };

    useImperativeHandle(ref, () => ({
      getValidatedData: validateAndGetData,
    }));

    /* VIEW */
    if (isReadOnly) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            gap: 2,
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", gap: 1, flexShrink: 0, paddingTop: 1 }}>
            {showLike && (
              <IconButton
                onClick={onLikeToggle}
                sx={{
                  "&:focus": { outline: "none" },
                  "&:focusVisible": { outline: "none", boxShadow: "none" },
                }}
              >
                {isLiked ? (
                  <FavoriteIcon sx={{ color: "#E74C3C" }} />
                ) : (
                  <FavoriteBorderIcon sx={{ color: "#CCC" }} />
                )}
              </IconButton>
            )}

            <Chip
              label={inputValue.publicity === "true" ? "Public" : "Private"}
              sx={{
                bgcolor:
                  TAG_COLORS.publicity[
                    inputValue.publicity === "true" ? "Public" : "Private"
                  ],
                color: "#fff",
              }}
            />

            <Chip
              label={
                inputValue.priority.charAt(0).toUpperCase() +
                inputValue.priority.slice(1)
              }
              sx={{
                bgcolor:
                  TAG_COLORS.priority[
                    inputValue.priority.charAt(0).toUpperCase() +
                      inputValue.priority.slice(1)
                  ],
                color: "#fff",
              }}
            />

            <Chip
              label={
                inputValue.status === "in_progress"
                  ? "InProgress"
                  : inputValue.status.charAt(0).toUpperCase() +
                    inputValue.status.slice(1)
              }
              sx={{
                bgcolor:
                  TAG_COLORS.status[
                    inputValue.status === "in_progress"
                      ? "InProgress"
                      : inputValue.status.charAt(0).toUpperCase() +
                        inputValue.status.slice(1)
                  ],
                color: "#fff",
              }}
            />
          </Box>

          {/* Content */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              pr: 1,
              padding: 0,
              "&::-webkit-scrollbar": { width: "5px" },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(0, 0, 0, 0.35)",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-track": {
                background: "rgba(0, 0, 0, 0.05)",
              },
            }}
          >
            <Typography sx={{ whiteSpace: "pre-wrap" }}>
              {inputValue.description || "내용이 없습니다."}
            </Typography>
          </Box>
        </Box>
      );
    }

    /* CREATE | EDIT */
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          gap: 2,
        }}
      >
        {/* Header */}
        <Box
          sx={{ display: "flex", gap: 4, flexShrink: 0, paddingTop: "15px" }}
        >
          <Typography sx={{ width: "20%" }}>Title</Typography>
          <TextField
            value={inputValue.title}
            onChange={handleChange("title")}
            fullWidth
            size="small"
            error={errors.title}
            placeholder="100자 이내로 입력해주세요(넘을 시, 저장 불가)"
            helperText={errors.title ? "제목을 입력해주세요." : ""}
          />
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, pr: 1, padding: 0 }}>
          <Box sx={{ display: "flex", gap: 4 }}>
            <Typography sx={{ width: "20%" }}>Description</Typography>
            <TextField
              value={inputValue.description}
              onChange={handleChange("description")}
              fullWidth
              multiline
              rows={9}
              error={errors.description}
              placeholder="내용을 입력해주세요."
              helperText={errors.description ? "내용을 입력해주세요." : ""}
              InputProps={{
                sx: {
                  overflowY: "auto",
                },
              }}
            />
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ flexShrink: 0 }}>
          <RadioGroup
            row
            value={inputValue.publicity}
            onChange={handleChange("publicity")}
            sx={{ padding: "5px 0" }}
          >
            <FormControlLabel value="true" control={<Radio />} label="Public" />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="Private"
            />
          </RadioGroup>

          <RadioGroup
            row
            value={inputValue.priority}
            onChange={handleChange("priority")}
            sx={{ padding: "5px 0" }}
          >
            <FormControlLabel value="low" control={<Radio />} label="Low" />
            <FormControlLabel
              value="medium"
              control={<Radio />}
              label="Medium"
            />
            <FormControlLabel value="high" control={<Radio />} label="High" />
          </RadioGroup>

          <RadioGroup
            row
            value={inputValue.status}
            onChange={handleChange("status")}
            sx={{ padding: "5px 0 0 0" }}
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
);

export default TodoModal;
