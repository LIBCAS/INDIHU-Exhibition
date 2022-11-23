import { ScreenChapters } from "components/dialogs/chapters-dialog/types";

export type ScreenPoint = Exclude<ScreenChapters, "subScreens">;
