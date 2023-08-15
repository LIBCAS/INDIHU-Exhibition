import { createTheme } from "@mui/material";

const theme = createTheme({
  // Change breakpoints to be in sync with the default tailwind breakpoints
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },

  components: {
    // Name of the component
    MuiModal: {
      styleOverrides: {
        // Name of the slot
        root: {
          zIndex: 100001,
        },
      },
    },
  },
});

export default theme;
