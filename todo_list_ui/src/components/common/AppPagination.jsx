import { Pagination, Box } from "@mui/material";

export default function AppPagination({ page, count, onChange }) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Pagination
        page={page}
        count={count}
        onChange={(_, value) => onChange(value)}
        color="primary"
        sx={{
          "& .MuiPaginationItem-root": {
            outline: "none",
            boxShadow: "none",
            "&:focus": { outline: "none" },
            "&:focusVisible": { outline: "none", boxShadow: "none" },
          },
        }}
      />
    </Box>
  );
}
