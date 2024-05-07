import { createTheme, responsiveFontSizes } from "@mui/material";
import { indigo } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: indigo[500],
    },
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        position: "static",
        color: "primary",
      },
      styleOverrides: {
        root: {
          marginBottom: 15,
          // boxShadow: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

export default responsiveFontSizes(theme);
