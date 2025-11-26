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

const styles = {
  button: {
    "&:focus": { outline: "none" },
    "&:focusVisible": { outline: "none", boxShadow: "none" },
  },
};

function TodoModal({
  mode = "create",
  infoObject = null,
  onSave,
  onClose,
  onEdit,
  hideFooter = false,
}) {
  const [inputValue, setInputValue] = useState({
    title: "",
    description: "",
    disclosure: "public",
    priority: "medium",
    status: "proceed",
  });

  useEffect(() => {
    if ((mode === "view" || mode === "edit") && infoObject) {
      setInputValue({
        title: infoObject.title ?? "",
        description: infoObject.description ?? infoObject.discription ?? "",
        disclosure: infoObject.disclosure ?? "public",
        priority: (infoObject.priority ?? "medium").toLowerCase(),
        status: (infoObject.status ?? "proceed").toLowerCase(),
      });
    } else if (mode === "create") {
      setInputValue({
        title: "",
        description: "",
        disclosure: "public",
        priority: "medium",
        status: "proceed",
      });
    }
  }, [mode, infoObject]);

  const isReadOnly = mode === "view";

  const handleChange = (field) => (e) => {
    setInputValue((prev) => ({ ...prev, [field]: e.target.value }));
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
        <Typography sx={{ width: "20%" }}>Disclosure</Typography>
        <RadioGroup
          row
          name="disclosure"
          value={inputValue.disclosure}
          onChange={handleChange("disclosure")}
        >
          <FormControlLabel
            value="public"
            control={<Radio />}
            label="public"
            disabled={isReadOnly}
          />
          <FormControlLabel
            value="private"
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
            value="proceed"
            control={<Radio />}
            label="proceed"
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

      {/* 버튼 */}
      {!hideFooter && (
        <Box sx={{ display: "flex", gap: 3, justifyContent: "center", mt: 4 }}>
          {mode === "view" && onEdit && (
            <Button variant="contained" onClick={onEdit} sx={{...styles.button}}>
              편집
            </Button>
          )}
          {(mode === "create" || mode === "edit") && (
            <Button variant="contained" onClick={() => onSave(inputValue)} sx={{...styles.button}}>
              저장
            </Button>
          )}
          <Button variant="outlined" onClick={onClose} sx={{...styles.button}}>
            닫기
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default TodoModal;
