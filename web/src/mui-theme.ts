import { ThemeOptions } from "@mui/material";
import { palette } from "palette";

// Supports light or dark mode as boolean, stored in redux store
export const getMuiTheme = (isLightMode: boolean): ThemeOptions => {
  return {
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

    palette: {
      error: {
        main: "#f44336",
      },
    },

    components: {
      // Name of the component
      MuiFormHelperText: {
        styleOverrides: {
          // Name of the slot
          root: {
            fontSize: "12px",
          },
        },
      },

      // Name of the component
      MuiModal: {
        styleOverrides: {
          // Name of the slot
          root: {
            zIndex: 100001,
          },
        },
      },
      // Name of the component
      MuiPopover: {
        styleOverrides: {
          // Name of the slot
          paper: {
            backgroundColor: isLightMode ? undefined : palette["dark-mode-b"],
          },
        },
      },
    },
  };
};
