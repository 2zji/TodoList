import {
  forwardRef,
  useEffect,
  useState,
  useImperativeHandle,
} from "react";
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
      }

      if (mode === "create") {
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

      setInputValue((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (field === "title" || field === "description") {
        setErrors((prev) => ({
          ...prev,
          [field]: value.trim() === "",
        }));
      }

      if (setSelectedTodo) {
        const parsed =
          field === "publicity" ? value === "true" : value;
        setSelectedTodo((prev) => ({
          ...prev,
          [field]: parsed,
        }));
      }
    };

    const validateAndGetData = () => {
      const newErrors = {
        title: inputValue.title.trim() === "",
        description: inputValue.description.trim() === "",
      };

      setErrors(newErrors);

      if (newErrors.title || newErrors.description) {
        return null;
      }

      return {
        ...inputValue,
        publicity: inputValue.publicity === "true",
      };
    };

    useImperativeHandle(ref, () => ({
      getValidatedData: validateAndGetData,
    }));

    const getPublicityLabel = () =>
      inputValue.publicity === "true" ? "Public" : "Private";
    const getPriorityLabel = () =>
      inputValue.priority.charAt(0).toUpperCase() +
      inputValue.priority.slice(1);
    const getStatusLabel = () => {
      const map = {
        pending: "Pending",
        in_progress: "InProgress",
        completed: "Completed",
      };
      return map[inputValue.status] || "Pending";
    };

    if (isReadOnly) {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
            {showLike && (
              <IconButton onClick={onLikeToggle}>
                {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            )}
            <Chip
              label={getPublicityLabel()}
              sx={{
                bgcolor: TAG_COLORS.publicity[getPublicityLabel()],
                color: "#fff",
              }}
            />
            <Chip
              label={getPriorityLabel()}
              sx={{
                bgcolor: TAG_COLORS.priority[getPriorityLabel()],
                color: "#fff",
              }}
            />
            <Chip
              label={getStatusLabel()}
              sx={{
                bgcolor: TAG_COLORS.status[getStatusLabel()],
                color: "#fff",
              }}
            />
          </Box>

          <Typography sx={{ whiteSpace: "pre-wrap" }}>
            {inputValue.description || "내용이 없습니다."}
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Title */}
        <Box sx={{ display: "flex", gap: 4 }}>
          <Typography sx={{ width: "20%" }}>Title</Typography>
          <TextField
            value={inputValue.title}
            onChange={handleChange("title")}
            fullWidth
            size="small"
            error={errors.title}
            helperText={errors.title ? "제목을 입력해주세요." : ""}
          />
        </Box>

        {/* Description */}
        <Box sx={{ display: "flex", gap: 4 }}>
          <Typography sx={{ width: "20%" }}>Description</Typography>
          <TextField
            value={inputValue.description}
            onChange={handleChange("description")}
            fullWidth
            multiline
            minRows={4}
            error={errors.description}
            helperText={errors.description ? "내용을 입력해주세요." : ""}
          />
        </Box>

        {/* Publicity */}
        <RadioGroup
          row
          value={inputValue.publicity}
          onChange={handleChange("publicity")}
        >
          <FormControlLabel value="true" control={<Radio />} label="Public" />
          <FormControlLabel value="false" control={<Radio />} label="Private" />
        </RadioGroup>

        {/* Priority */}
        <RadioGroup
          row
          value={inputValue.priority}
          onChange={handleChange("priority")}
        >
          <FormControlLabel value="low" control={<Radio />} label="Low" />
          <FormControlLabel value="medium" control={<Radio />} label="Medium" />
          <FormControlLabel value="high" control={<Radio />} label="High" />
        </RadioGroup>

        {/* Status */}
        <RadioGroup
          row
          value={inputValue.status}
          onChange={handleChange("status")}
        >
          <FormControlLabel value="pending" control={<Radio />} label="Pending" />
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
    );
  }
);

export default TodoModal;
