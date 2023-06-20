import { createTheme } from "@mui/material";

const theme = createTheme({
  components: {
    // Name of the component
    MuiModal: {
      styleOverrides: {
        // Name od the slot
        root: {
          zIndex: 100001,
        },
      },
    },
  },
});

export default theme;
