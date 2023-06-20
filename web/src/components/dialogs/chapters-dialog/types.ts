import { Screen } from "models/screen";

export type ScreenChapters = Screen & {
  sectionIndex: number | "start" | "finish";
  screenIndex?: number;
  subScreens?: ScreenChapters[];
};
