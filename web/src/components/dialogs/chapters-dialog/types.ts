import { Screen } from "models/screen";

export type ScreenChapters = Screen & {
  sectionIndex: number;
  screenIndex: number;
  subScreens?: ScreenChapters[];
};
