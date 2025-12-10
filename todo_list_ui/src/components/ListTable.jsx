import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const styles = {
  table: {
    flex: 1,
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow:
      "0 2px 4px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.05), 0 1px 10px rgba(0,0,0,0.07)",
  },
  header: {
    bgcolor: "#f0f4fa",
    fontWeight: 600,
    color: "#455a79",
    fontSize: "15px",
    padding: "10px",
    textAlign: "center",
    height: "42px",
    /*"& .MuiTableCell-root": {
      bgcolor: "#f0f4fa",
      fontWeight: 600,
      color: "#455a79",
      fontSize: "15px",
      padding: "10px",
    },*/
  },
  body: {
    fontSize: "14px",
    padding: "10px",
    textAlign: "center",
  },
};

const ListTable = ({
  columns = [],
  rows = [],
  isCheckbox = false,
  onRowSelect = () => {},
  selected = [],
  onSelectAll = () => {},
  onSelectOne = () => {},
}) => {
  return (
    <TableContainer component={Paper} sx={styles.table}>
      <Table stickyHeader>
        <TableHead
          sx={{
            "& .MuiTableCell-root": {
              ...styles.header,
            },
          }}
        >
          <TableRow>
            {isCheckbox && (
              <TableCell padding="checkbox">
                <Checkbox
                  checked={
                    rows.length > 0 &&
                    rows.every((r) => selected.includes(r.id))
                  }
                  onChange={onSelectAll}
                />
              </TableCell>
            )}

            {columns.map((col) => (
              <TableCell key={col.field} sx={{ ...styles.header, width: col.width }}>
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((item) => (
            <TableRow
              key={item.id}
              hover
              onClick={() => onRowSelect(item)}
              sx={{
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f5faff" },
                height: "50px",
              }}
            >
              {isCheckbox && (
                <TableCell
                  padding="checkbox"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={selected.includes(item.id)}
                    onChange={() => onSelectOne(item.id)}
                  />
                </TableCell>
              )}

              {columns.map((col) => (
                <TableCell key={col.field} sx={{...styles.body, width: col.width}}>
                  {item[col.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}

          {rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length + (isCheckbox ? 1 : 0)}
                align="center"
              >
                No Data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListTable;
