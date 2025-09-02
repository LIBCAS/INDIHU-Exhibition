import { CSSProperties } from "react";

// NOTE: Square for the checkbox type of answer
import MuiSquareIcon from "@mui/icons-material/Square";
// NOTE: Circle for the radio type of answer
import MuiCircleIcon from "@mui/icons-material/Circle";

// NOTE: Check mark for the correct answer
import MuiCheckIcon from "@mui/icons-material/Check";
// NOTE: Close icon for the incorrect answer
import MuiCloseIcon from "@mui/icons-material/Close";

// - - - - - -

type CheckboxIconProps = {
  iconStyle?: CSSProperties;
};

export const CheckboxIcon = ({ iconStyle }: CheckboxIconProps) => {
  return (
    <MuiSquareIcon
      sx={{
        fontSize: "17.5px",
        backgroundColor: "white",
        color: "#2298ee",
        border: "1px solid #2298ee",
        borderRadius: "2px",
        padding: "2px",
        ...iconStyle,
      }}
    />
  );
};

// - - - - - -

type RadioIconProps = {
  iconStyle?: CSSProperties;
};

export const RadioIcon = ({ iconStyle }: RadioIconProps) => {
  return (
    <MuiCircleIcon
      sx={{
        fontSize: "17.5px",
        backgroundColor: "white",
        color: "#2298ee",
        border: "1px solid #2298ee",
        borderRadius: "50%",
        padding: "1px",
        ...iconStyle,
      }}
    />
  );
};

// - - - - - -

type CorrectAnswerIconProps = {
  isForRadio: boolean;
  iconStyle?: CSSProperties;
};

export const CorrectAnswerIcon = ({
  isForRadio,
  iconStyle,
}: CorrectAnswerIconProps) => {
  return (
    <MuiCheckIcon
      sx={{
        fontSize: "17.5px",
        backgroundColor: "#35c07d",
        color: "white",
        borderRadius: isForRadio ? "50%" : undefined,
        padding: isForRadio ? "1px" : undefined,
        ...iconStyle,
      }}
    />
  );
};

// - - - - - -

type IncorrectAnswerIconProps = {
  isForRadio: boolean;
  iconStyle?: CSSProperties;
};

export const IncorrectAnswerIcon = ({
  isForRadio,
  iconStyle,
}: IncorrectAnswerIconProps) => {
  return (
    <MuiCloseIcon
      sx={{
        fontSize: "17.5px",
        backgroundColor: "#e0293e",
        color: "white",
        borderRadius: isForRadio ? "50%" : undefined,
        padding: isForRadio ? "1px" : undefined,
        ...iconStyle,
      }}
    />
  );
};

// - - - - - -
