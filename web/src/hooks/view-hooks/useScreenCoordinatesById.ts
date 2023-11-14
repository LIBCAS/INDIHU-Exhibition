import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useExpoScreenStructure } from "./expo-screen-structure-hook";

import { ScreenCoordinates } from "models";
import { AppState } from "store/store";

// - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo?.url,
  (expoUrl) => ({ expoUrl })
);

// - - -

type ScreenCoordinatesWithReferenceUrl = {
  coordinates: ScreenCoordinates | null;
  referenceUrl: string;
} | null;

// - - -

export const useScreenCoordinatesById = (
  screenId: string | "start" | "finish" | null
): ScreenCoordinatesWithReferenceUrl => {
  const { expoUrl } = useSelector(stateSelector);
  const { chapterScreensStructure } = useExpoScreenStructure();

  if (screenId === null || !expoUrl) {
    return null;
  }

  if (screenId === "start" || screenId === "finish") {
    const referenceUrl = `/view/${expoUrl}/${screenId}`;
    return {
      coordinates: screenId,
      referenceUrl: referenceUrl,
    };
  }

  const foundScreen = chapterScreensStructure?.find(
    (item) =>
      item && item.type !== "DELIMITOR" && "id" in item && item.id === screenId
  );

  if (!foundScreen || foundScreen.type === "DELIMITOR") {
    return null;
  }

  const coordinates: [number, number] = [
    foundScreen.chapterIndex,
    foundScreen.screenIndex,
  ];

  const referenceUrl = `/view/${expoUrl}/${coordinates[0]}/${coordinates[1]}`;

  return {
    coordinates,
    referenceUrl,
  };
};
