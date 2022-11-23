import { RefObject } from "react";

import { ScreenFiles } from "context/file-preloader/file-preloader-types";
import { animationType } from "enums/animation-type";
import { zoomInTooltipPosition } from "enums/screen-enums";

export type ScreenProps = {
  screenFiles: ScreenFiles;
  toolbarRef: RefObject<HTMLDivElement>;
};

export type AnimationType = typeof animationType[keyof typeof animationType];
export type ZoomInTooltipPosition =
  typeof zoomInTooltipPosition[keyof typeof zoomInTooltipPosition];
export type ScreenCoordinates = [number, number] | "start" | "finish";
