import { Snackbar as MuiSnackbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type SnackbarProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
};

const Snackbar = ({ isOpen, onClose, message }: SnackbarProps) => {
  return (
    <MuiSnackbar
      anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      open={isOpen}
      onClose={onClose}
      message={message}
      autoHideDuration={5000}
      sx={{
        "& .MuiSnackbarContent-message": {
          fontFamily: "Work Sans",
          fontSize: "14px",
        },
      }}
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={onClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
};

export default Snackbar;
