import { useEffect } from "react";
import { useDispatch } from "react-redux";

// Models
import { GameFindScreen } from "models";
import { AppDispatch } from "store/store";

// Actions and utils
import { updateScreenData } from "actions/expoActions";
import { GAME_FIND_DEFAULT_NUMBER_OF_PINS } from "constants/screen";

// - - - -

export const extendPinsTextsArray = (
  numberOfPins: number,
  pinTexts: string[]
): string[] => {
  if (numberOfPins <= pinTexts.length) {
    return pinTexts;
  }

  const extendedArray = pinTexts.slice(); // Create a copy of the input array

  while (extendedArray.length < numberOfPins) {
    extendedArray.push("");
  }

  return extendedArray;
};

// - - - -

export const useNumberOfPinsListener = (activeScreen: GameFindScreen) => {
  const dispatch = useDispatch<AppDispatch>();

  const { numberOfPins = GAME_FIND_DEFAULT_NUMBER_OF_PINS, pinsTexts } =
    activeScreen;

  useEffect(() => {
    // Pins Texts initialization for this type of screen
    if (
      numberOfPins === GAME_FIND_DEFAULT_NUMBER_OF_PINS &&
      pinsTexts === undefined
    ) {
      dispatch(
        updateScreenData({
          pinsTexts: new Array(GAME_FIND_DEFAULT_NUMBER_OF_PINS).fill(""),
        })
      );

      return;
    }

    if (pinsTexts === undefined) {
      return;
    }

    // Other use case.. not initialization but change of number in field
    const extendedArr = extendPinsTextsArray(numberOfPins, pinsTexts);
    dispatch(
      updateScreenData({
        pinsTexts: extendedArr,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberOfPins]);
};
