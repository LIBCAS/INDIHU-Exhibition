import { CSSProperties } from "react";

import MuiSquareIcon from "@mui/icons-material/Square"; // filled square for checkbox
import MuiCircleIcon from "@mui/icons-material/Circle"; // filled circle for radio

import MuiCheckIcon from "@mui/icons-material/Check"; // correct answer
import MuiCloseIcon from "@mui/icons-material/Close"; // incorrect answer

// - - - -

type SquareIconProps = {
  iconStyle?: CSSProperties;
};

const SquareIcon = ({ iconStyle }: SquareIconProps) => {
  return (
    <MuiSquareIcon
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
};

type CircleIconProps = {
  iconStyle?: CSSProperties;
};

const CircleIcon = ({ iconStyle }: CircleIconProps) => {
  return (
    <MuiCircleIcon
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
};

type CheckIconProps = {
  isForRadio: boolean;
  iconStyle?: CSSProperties;
};

const CheckIcon = ({ isForRadio, iconStyle }: CheckIconProps) => {
  return (
    <MuiCheckIcon
      sx={{
        color: "white",
        backgroundColor: "#35c07d",
        fontSize: "17.5px",
        padding: isForRadio ? "1px" : undefined,
        borderRadius: isForRadio ? "50%" : undefined,
        ...iconStyle,
      }}
    />
  );
};

type CloseIconProps = {
  isForRadio: boolean;
  iconStyle?: CSSProperties;
};

const CloseIcon = ({ isForRadio, iconStyle }: CloseIconProps) => {
  return (
    <MuiCloseIcon
      sx={{
        color: "white",
        backgroundColor: "#e0293e",
        fontSize: "17.5px",
        padding: isForRadio ? "1px" : undefined,
        borderRadius: isForRadio ? "50%" : undefined,
        ...iconStyle,
      }}
    />
  );
};

// - - - -

// checked checkbox means that the 'isAnswerMarked' is true
export const getAnswerCheckboxCheckedIcon = (
  isGameFinished: boolean,
  isAnswerCorrect: boolean,
  iconStyle?: CSSProperties
) => {
  if (!isGameFinished) {
    return <SquareIcon iconStyle={iconStyle} />;
  }

  if (isGameFinished) {
    if (isAnswerCorrect) {
      return <CheckIcon isForRadio={false} iconStyle={iconStyle} />;
    }

    if (!isAnswerCorrect) {
      return <CloseIcon isForRadio={false} iconStyle={iconStyle} />;
    }
  }

  return undefined;
};

// unchecked checkbox means that the 'isAnswerMarked' is false
export const getAnswerCheckboxUncheckedIcon = (
  isGameFinished: boolean,
  isAnswerCorrect: boolean,
  iconStyle?: CSSProperties
) => {
  if (isGameFinished) {
    if (isAnswerCorrect) {
      return <CheckIcon isForRadio={false} iconStyle={iconStyle} />;
    }

    if (!isAnswerCorrect) {
      return <CloseIcon isForRadio={false} iconStyle={iconStyle} />;
    }
  }

  return undefined;
};

// - - - -

// checked radio means that the 'isAnswerMarked' is true
export const getAnswerRadioCheckedIcon = (
  isGameFinished: boolean,
  isAnswerCorrect: boolean,
  iconStyle?: CSSProperties
) => {
  if (!isGameFinished) {
    return <CircleIcon iconStyle={iconStyle} />;
  }

  if (isGameFinished) {
    if (isAnswerCorrect) {
      return <CheckIcon isForRadio={true} iconStyle={iconStyle} />;
    }

    if (!isAnswerCorrect) {
      return <CloseIcon isForRadio={true} iconStyle={iconStyle} />;
    }
  }

  return undefined;
};

// unchecked radio means that the 'isAnswerMarked' is false
export const getAnswerRadioUncheckedIcon = (
  isGameFinished: boolean,
  isAnswerCorrect: boolean,
  iconStyle?: CSSProperties
) => {
  if (isGameFinished) {
    if (isAnswerCorrect) {
      return <CheckIcon isForRadio={true} iconStyle={iconStyle} />;
    }

    if (!isAnswerCorrect) {
      return <CloseIcon isForRadio={true} iconStyle={iconStyle} />;
    }
  }

  return undefined;
};
