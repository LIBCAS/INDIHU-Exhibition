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
