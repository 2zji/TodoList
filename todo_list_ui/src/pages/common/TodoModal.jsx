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

function TodoModal({
  mode = "create",
  infoObject = null,
  onSave,
  onClose,
  onEdit,
}) {
  const [inputValue, setInputValue] = useState({
    title: "",
    discription: "",
    disclosure: "public",
    priority: "medium",
    status: "proceed",
  });

  useEffect(() => {
    if ((mode === "view" || mode === "edit") && infoObject) {
      setInputValue({
        title: infoObject.title ?? "",
        discription: infoObject.discription ?? infoObject.description ?? "",
        disclosure: infoObject.disclosure ?? "public",
        priority: (infoObject.priority ?? "medium").toLowerCase(),
        status: (infoObject.status ?? "proceed").toLowerCase(),
      });
    } else if (mode === "create") {
      setInputValue({
        title: "",
        discription: "",
        disclosure: "public",
        priority: "medium",
        status: "proceed",
      });
    }
  }, [mode, infoObject]);

  const isReadOnly = mode === "view";

  const handleChange = (field) => (e) => {
    setInputValue((p) => ({ ...p, [field]: e.target.value }));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* 제목 */}
      <Box sx={{ width: "100%", display: "flex", alignItems: "center", marginTop: 2, marginBottom: 2 }}>
        <Typography sx={{ width: "20%" }}>Title</Typography>
        <TextField
          value={inputValue.title}
          onChange={handleChange("title")}
          slotProps={{ readOnly: isReadOnly }}
          disabled={isReadOnly}
          sx={{ width: "80%" }}
          size="small"
        />
      </Box>

      {/* 내용 */}
      <Box sx={{ width: "100%", display: "flex", alignItems: "center", marginBottom: 2 }}>
        <Typography sx={{ width: "20%" }}>Description</Typography>
        <TextField
          value={inputValue.discription}
          onChange={handleChange("discription")}
          sx={{ width: "80%" }}
          multiline
          rows={4}
          slotProps={{ readOnly: isReadOnly }}
          disabled={isReadOnly}
        />
      </Box>

      {/* 공개여부 */}
      <Box
        sx={{ width: "100%", display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}
      >
        <Typography sx={{ flex: "0 0 100px" }}>Priority</Typography>
        <RadioGroup
          row
          name="priority"
          value={inputValue.priority}
          onChange={handleChange("priority")}
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
      <Box
        sx={{ width: "100%", display: "flex", alignItems: "center", gap: 10, marginBottom: 1 }}
      >
        <Typography sx={{ flex: "0 0 100px" }}>Disclosure</Typography>
        <RadioGroup
          row
          name="disclosure"
          value={inputValue.disclosure}
          onChange={handleChange("disclosure")}
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
      <Box
        sx={{ width: "100%", display: "flex", alignItems: "center", gap: 10 }}
      >
        <Typography sx={{ flex: "0 0 100px" }}>Status</Typography>
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
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 6 }}>
        {mode === "view" && (
          <Button
            variant="contained"
            onClick={onEdit}
            sx={{
              "&:focus": { outline: "none" },
              "&:focusVisible": { outline: "none", boxShadow: "none" },
            }}
          >
            편집
          </Button>
        )}

        {(mode === "edit" || mode === "create") && (
          <Button
            variant="contained"
            onClick={() => onSave(inputValue)}
            sx={{
              "&:focus": { outline: "none" },
              "&:focusVisible": { outline: "none", boxShadow: "none" },
            }}
          >
            저장
          </Button>
        )}

        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            "&:focus": { outline: "none" },
            "&:focusVisible": { outline: "none", boxShadow: "none" },
          }}
        >
          닫기
        </Button>
      </Box>
    </Box>
  );
}

export default TodoModal;
