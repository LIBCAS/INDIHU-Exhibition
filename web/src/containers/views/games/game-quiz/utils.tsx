import { CSSProperties } from "react";
import {
  CheckboxIcon,
  RadioIcon,
  CorrectAnswerIcon,
  IncorrectAnswerIcon,
} from "./icons";

// - - - - - -

export const getCheckboxUnmarkedIcon = (
  isGameFinished: boolean,
  isAnswerCorrect: boolean,
  iconStyle?: CSSProperties
) => {
  if (!isGameFinished) {
    // NOTE: Use default icon provided by MUI
    return undefined;
  }

  if (isGameFinished) {
    if (isAnswerCorrect) {
      return <CorrectAnswerIcon isForRadio={false} iconStyle={iconStyle} />;
    }

    if (!isAnswerCorrect) {
      return <IncorrectAnswerIcon isForRadio={false} iconStyle={iconStyle} />;
    }
  }

  return undefined; // should not happen
};

// - - - - - -

export const getCheckboxMarkedIcon = (
  isGameFinished: boolean,
  isAnswerCorrect: boolean,
  iconStyle?: CSSProperties
) => {
  if (!isGameFinished) {
    return <CheckboxIcon iconStyle={iconStyle} />;
  }

  if (isGameFinished) {
    if (isAnswerCorrect) {
      return <CorrectAnswerIcon isForRadio={false} iconStyle={iconStyle} />;
    }

    if (!isAnswerCorrect) {
      return <IncorrectAnswerIcon isForRadio={false} iconStyle={iconStyle} />;
    }
  }

  return undefined; // should not happen
};

// - - - - - -

export const getRadioUnmarkedIcon = (
  isGameFinished: boolean,
  isAnswerCorrect: boolean,
  iconStyle?: CSSProperties
) => {
  if (!isGameFinished) {
    // NOTE: Use default icon provided by MUI
    return undefined;
  }

  if (isGameFinished) {
    if (isAnswerCorrect) {
      return <CorrectAnswerIcon isForRadio={true} iconStyle={iconStyle} />;
    }

    if (!isAnswerCorrect) {
      return <IncorrectAnswerIcon isForRadio={true} iconStyle={iconStyle} />;
    }
  }

  return undefined; // shoult not happen
};

// - - - - - -

export const getRadioMarkedIcon = (
  isGameFinished: boolean,
  isAnswerCorrect: boolean,
  iconStyle?: CSSProperties
) => {
  if (!isGameFinished) {
    return <RadioIcon iconStyle={iconStyle} />;
  }

  if (isGameFinished) {
    if (isAnswerCorrect) {
      return <CorrectAnswerIcon isForRadio={true} iconStyle={iconStyle} />;
    }

    if (!isAnswerCorrect) {
      return <IncorrectAnswerIcon isForRadio={true} iconStyle={iconStyle} />;
    }
  }

  return undefined; // should not happen
};
