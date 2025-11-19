import { Box, Grid } from "@mui/material";

function Dashboard({ onAddTask }) {
  const styles = {
    container: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    header: {
      height: "120px",
      width: "100%",
      fontSize: "45px",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingLeft: "40px",
      backgroundColor: "#f9f9f9",
      boxSizing: "border-box",
      borderBottom: "1px solid #ccc",
    },
    main: {
      flex: 1,
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    innerContainer: {
      width: "95%",
      height: "90%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid #ccc",
    },
    box: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid #ccc",
    },
    myTodo: {
      width: "50%",
      height: "90%",
      marginLeft: "60px",
      marginRight: "60px",
    },
    sideColumn: {
      display: "flex",
      flexDirection: "column",
      gap: "30px",
      width: "50%",
      marginRight: "60px",
    },
    sideBox: {
      width: "100%",
      height: "33.4vh",
    },
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>Hi User!</Box>

      <Box sx={styles.main}>
        <Box sx={styles.innerContainer}>
          <Box sx={{ ...styles.box, ...styles.myTodo }}>My TODO</Box>

          <Box sx={styles.sideColumn}>
            <Box sx={{ ...styles.box, ...styles.sideBox }}>Friends TODO</Box>
            <Box sx={{ ...styles.box, ...styles.sideBox }}>Likes TODO</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
