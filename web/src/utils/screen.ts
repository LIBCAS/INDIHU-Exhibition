import { defaultScreenTimeInSeconds } from "constants/screen";
import { Screen } from "models";
import { DefaultOptions } from "types";

import { mergeOptional } from "./merge-optional";

type Options = {
  unit?: "ms" | "s";
  defaultValue?: number;
};

const defaultOptions: DefaultOptions<Options> = {
  unit: "ms",
  defaultValue: defaultScreenTimeInSeconds,
};

export const getScreenTime = (screen: Screen, options?: Options) => {
  const { unit, defaultValue } = mergeOptional(defaultOptions, options);

  const multipler = unit === "ms" ? 1000 : 1;

  return ("time" in screen ? screen.time : defaultValue) * multipler;
};

export const getCumulativeSum = (arr: number[]) => {
  const newArr = Array(arr.length).fill(-1);
  newArr[0] = arr[0];
  for (let i = 1; i < arr.length; i++) {
    newArr[i] = newArr[i - 1] + arr[i];
  }
  return newArr;
};

export const getScreenPhotoIndex = (
  percentage: number,
  percentages: number[]
) => {
  for (let i = 0; i < percentages.length; i++) {
    if (percentage < percentages[i]) {
      return i;
    }
  }
  return null;
};

export const getDocumentIconName = (type: string | undefined) => {
  if (!type) {
    return "filter_none";
  }
  if (/^image.*$/.test(type)) {
    return "image";
  }
  if (/^audio.*$/.test(type)) {
    return "music_note";
  }
  if (/^video.*$/.test(type)) {
    return "movie";
  }
  if (type === "WEB") {
    return "language";
  }
  return "insert_drive_file";
};
