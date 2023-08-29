import { CSSProperties } from "react";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import SquareIcon from "@mui/icons-material/Square";
import CircleIcon from "@mui/icons-material/Circle";

export const getAnswerCheckboxIcon = (
  isGameFinished: boolean,
  isAnswerMarked: boolean,
  isAnswerCorrect: boolean,
  iconStyle?: CSSProperties
) => {
  if (!isGameFinished && isAnswerMarked) {
    return (
      <SquareIcon
        sx={{
          fontSize: "17.5px",
          color: "#2298ee",
          backgroundColor: "white",
          padding: "2px",
          border: "1px solid #2298ee",
          borderRadius: "2px",
          ...iconStyle,
        }}
      />
    );
  }

  if (isGameFinished && isAnswerMarked) {
    if (isAnswerCorrect) {
      return (
        <CheckIcon
          sx={{
            color: "white",
            backgroundColor: "#35c07d",
            fontSize: "17.5px",
            ...iconStyle,
          }}
        />
      );
    }

    if (!isAnswerCorrect) {
      return (
        <CloseIcon
          sx={{
            color: "white",
            backgroundColor: "#e0293e",
            fontSize: "17.5px",
            ...iconStyle,
          }}
        />
      );
    }
  }
  return undefined;
};

// - -

export const getAnswerRadioIcon = (
  isGameFinished: boolean,
  isAnswerMarked: boolean,
  isAnswerCorrect: boolean,
  iconStyle?: CSSProperties
) => {
  if (!isGameFinished && isAnswerMarked) {
    return (
      <CircleIcon
        sx={{
          color: "##2298ee",
          padding: "1px",
          backgroundColor: "white",
          border: "1px solid #2298ee",
          borderRadius: "50%",
          ...iconStyle,
        }}
      />
    );
  }

  if (isGameFinished && isAnswerMarked) {
    if (isAnswerCorrect) {
      return (
        <CheckIcon
          sx={{
            color: "white",
            backgroundColor: "#35c07d",
            fontSize: "17.5px",
            padding: "1px",
            borderRadius: "50%",
            ...iconStyle,
          }}
        />
      );
    }

    if (!isAnswerCorrect) {
      return (
        <CloseIcon
          sx={{
            color: "white",
            backgroundColor: "#e0293e",
            fontSize: "17.5px",
            padding: "1px",
            borderRadius: "50%",
            ...iconStyle,
          }}
        />
      );
    }
  }
  return undefined;
};
