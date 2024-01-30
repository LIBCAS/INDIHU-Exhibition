import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import {
  ChapterIndexedScreen,
  useExpoScreenStructure,
} from "./expo-screen-structure-hook";

import { FinishScreen, ScreenCoordinates, StartScreen } from "models";
import { AppState } from "store/store";

// - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo?.url,
  (expoUrl) => ({ expoUrl })
);

// - - -

type ScreenInformation = {
  screen: StartScreen | FinishScreen | ChapterIndexedScreen;
  screenCoordinates: ScreenCoordinates | null;
  screenReferenceUrl: string;
} | null;

// - - -

// Start and Finish screens do not have screen.id, so use "start" and "finish" as their ids
export const useScreenDataByScreenId = (
  screenId: string | "start" | "finish" | null
): ScreenInformation => {
  const { expoUrl } = useSelector(stateSelector);
  const { chapterScreensStructure, allScreensStructure } =
    useExpoScreenStructure();

  if (screenId === null || !expoUrl) {
    return null;
  }

  // First, solve the Start and finish identifiers
  if (screenId === "start" || screenId === "finish") {
    const referenceUrl = `/view/${expoUrl}/${screenId}`;
    const screen = allScreensStructure.find((item) => {
      return screenId === "start"
        ? item?.type === "START"
        : item?.type === "FINISH";
    });
    if (!screen || screen.type === "DELIMITOR") {
      return null;
    }
    return {
      screen,
      screenCoordinates: screenId,
      screenReferenceUrl: referenceUrl,
    };
  }

  // 2. Solve classic screen id as uuid
  const foundScreen = chapterScreensStructure?.find(
    (item) =>
      item && item.type !== "DELIMITOR" && "id" in item && item.id === screenId
  );

  if (!foundScreen || foundScreen.type === "DELIMITOR") {
    return null;
  }

  const screen = foundScreen;

  const coordinates: [number, number] = [
    foundScreen.chapterIndex,
    foundScreen.screenIndex,
  ];

  const referenceUrl = `/view/${expoUrl}/${coordinates[0]}/${coordinates[1]}`;

  return {
    screen,
    screenCoordinates: coordinates,
    screenReferenceUrl: referenceUrl,
  };
};
