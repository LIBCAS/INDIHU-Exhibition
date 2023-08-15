import { RefObject } from "react";

// Enums
import { screenType } from "enums/screen-type";
import { zoomInTooltipPosition } from "enums/screen-enums";
import { animationType } from "enums/animation-type";
import { horizontalPosition, verticalPosition } from "enums/screen-enums";

// Models
import { Document } from "./document";
import { Infopoint } from "./infopoint";
import { ScreenPreloadedFiles } from "context/file-preloader/file-preloader-provider";

// - - - - -

export type ScreenProps = {
  screenPreloadedFiles: ScreenPreloadedFiles;
  toolbarRef: RefObject<HTMLDivElement>;
  chapterMusicRef: RefObject<HTMLAudioElement>;
};

export type ScreenCoordinates = [number, number] | "start" | "finish";

export type ScreenWithOnlyTypeTitleDocuments = {
  type: typeof screenType[keyof typeof screenType];
  title: string | undefined;
  documents?: Document[] | undefined;
};

export type ScreenHighlight = {
  section?: number | "start" | "finish";
  screen?: number;
};

export type ScreenChapters = Screen & {
  sectionIndex: number | "start" | "finish";
  screenIndex?: number;
  subScreens?: ScreenChapters[];
};

export type ScreenPoint = Exclude<ScreenChapters, "subScreens">;

// - - - - -

/* Smaller helper types which are part of some of the screens below */
export type ImageOrigData = {
  width: number;
  height: number;
};

type Collaborator = {
  role: string;
  text: string;
};

export type AnimationType = typeof animationType[keyof typeof animationType];
export type ZoomInTooltipPosition =
  typeof zoomInTooltipPosition[keyof typeof zoomInTooltipPosition];

export type SlideshowImages = {
  id: string;
  imageOrigData: ImageOrigData;
  infopoints: Infopoint[];
  time?: number;
  active?: boolean;
}[];

export type ParallaxImages = string[];
export type PhotogalleryImages = { id: string; active?: boolean }[];

// - - - - -

export type Screen =
  | StartScreen
  | FinishScreen
  | IntroScreen
  | ImageScreen
  | VideoScreen
  | TextScreen
  | SlideshowScreen
  | PhotogalleryScreen
  | ParallaxScreeen
  | ZoomScreen
  | ImageChangeScreen
  | ExternalScreen
  | GameFindScreen
  | GameDrawScreen
  | GameWipeScreen
  | GameSizingScreen
  | GameMoveScreen
  | GameQuizScreen;

export type StartScreen = {
  id: string;
  type: typeof screenType.START;
  title?: string;
  subTitle?: string;
  perex: string;
  image?: string;
  imageOrigData: ImageOrigData;
  animationType: AnimationType;
  expoTime: number;
  audio: string;
  collaborators: Collaborator[];
  documents?: Document[];
  screenCompleted: boolean;
};

export type FinishScreen = {
  id?: string;
  type: typeof screenType.FINISH;
  title?: string;
};

export type IntroScreen = {
  id: string;
  type: typeof screenType.INTRO;
  title?: string;
  subTitle?: string;
  image?: string;
  imageOrigData?: ImageOrigData;
  animateText: boolean;
  textPosition?: {
    horizontal?: keyof typeof horizontalPosition;
    vertical?: keyof typeof verticalPosition;
  };
  animationType: AnimationType;
  audio?: string;
  time: number;
  timeAuto: boolean;
  music: string;
  documents?: Document[];
  screenCompleted: boolean;
  introTextTheme?: "light" | "dark";
  isIntroTextHaloEffectOn?: "on" | "off";
};

export type ImageScreen = {
  id: string;
  type: typeof screenType.IMAGE;
  title?: string;
  text?: string;
  image?: string;
  imageOrigData?: ImageOrigData;
  animationType: AnimationType;
  audio?: string;
  time: number;
  timeAuto: boolean;
  infopoints?: Infopoint[];
  documents?: Document[];
  aloneScreen: boolean;
  music?: string;
  muteChapterMusic: boolean;
  screenCompleted: boolean;
};

export type VideoScreen = {
  id: string;
  type: typeof screenType.VIDEO;
  title?: string;
  text?: string;
  video?: string;
  documents?: Document[];
  aloneScreen: boolean;
  music?: string;
  muteChapterMusic: boolean;
  screenCompleted: boolean;
};

export type TextScreen = {
  id: string;
  type: typeof screenType.TEXT;
  title?: string;
  text?: string;
  mainText: string;
  audio?: string;
  time: number;
  timeAuto: boolean;
  documents?: Document[];
  aloneScreen: boolean;
  music?: string;
  muteChapterMusic: boolean;
  screenCompleted: boolean;
};

export type SlideshowScreen = {
  id: string;
  type: typeof screenType.SLIDESHOW;
  title?: string;
  text?: string;
  images?: SlideshowImages;
  animationType: AnimationType;
  audio?: string;
  time: number;
  timeAuto: boolean;
  timePhotosManual?: boolean;
  documents?: Document[];
  aloneScreen: boolean;
  music?: string;
  muteChapterMusic: boolean;
  screenCompleted: boolean;
};

export type PhotogalleryScreen = {
  id: string;
  type: typeof screenType.PHOTOGALLERY_NEW;
  title: string;
  aloneScreen: boolean;
  //
  text?: string;
  audio?: string; // id of the audio file
  muteChapterMusic?: boolean;
  screenCompleted?: boolean;
  documents?: Document[];
  images?: PhotogalleryImages;
};

export type ParallaxScreeen = {
  id: string;
  type: typeof screenType.PARALLAX;
  title?: string;
  text?: string;
  images?: ParallaxImages;
  animationType: AnimationType;
  audio?: string;
  time: number;
  timeAuto: boolean;
  documents?: Document[];
  aloneScreen: boolean;
  music?: string;
  muteChapterMusic: boolean;
  screenCompleted: boolean;
};

export type ZoomScreen = {
  id: string;
  type: typeof screenType.IMAGE_ZOOM;
  title?: string;
  text?: string;
  image?: string;
  imageOrigData?: { width: number; height: number };
  sequences: {
    text: string;
    time?: number;
    zoom: number;
    top: number;
    left: number;
  }[];
  tooltipPosition: ZoomInTooltipPosition;
  audio?: string;
  time: number;
  timeAuto: boolean;
  documents?: Document[];
  aloneScreen: boolean;
  music?: string;
  muteChapterMusic: boolean;
  screenCompleted: boolean;
};

export type ImageChangeScreen = {
  id: string;
  type: typeof screenType.IMAGE_CHANGE;
  title?: string;
  text?: string;
  audio?: string;
  time: number;
  timeAuto: boolean;
  documents?: Document[];
  aloneScreen: boolean;
  music?: string;
  muteChapterMusic: boolean;
  screenCompleted: boolean;
  image1?: string;
  image2?: string;
  image1OrigData?: ImageOrigData;
  image2OrigData?: ImageOrigData;
  animationType:
    | "HORIZONTAL"
    | "VERTICAL"
    | "GRADUAL_TRANSITION"
    | "FADE_IN_OUT_TWO_IMAGES";
  rodPosition?: "0" | "0.25" | "0.5" | "0.75" | "1";
  gradualTransitionBeginPosition?:
    | "VERTICAL_TOP_TO_BOTTOM"
    | "VERTICAL_BOTTOM_TO_TOP"
    | "HORIZONTAL_LEFT_TO_RIGHT"
    | "HORIZONTAL_RIGHT_TO_LEFT";
  image1Infopoints?: Infopoint[];
  image2Infopoints?: Infopoint[];
};

export type ExternalScreen = {
  id: string;
  type: typeof screenType.EXTERNAL;
  title?: string;
  text?: string;
  externalData: string;
  audio?: string;
  time: number;
  timeAuto: boolean;
  documents?: Document[];
  aloneScreen: boolean;
  music?: string;
  muteChapterMusic: boolean;
  screenCompleted: boolean;
};

export type GameFindScreen = {
  id: string;
  type: typeof screenType.GAME_FIND;
  title?: string;
  task: string;
  image1?: string;
  image2?: string;
  image1OrigData?: ImageOrigData;
  image2OrigData?: ImageOrigData;
  showTip: boolean;
  aloneScreen: boolean;
  music?: string;
  muteChapterMusic: boolean;
  screenCompleted: boolean;
};

export type GameDrawScreen = {
  id: string;
  type: typeof screenType.GAME_DRAW;
  title?: string;
  task: string;
  image1?: string;
  image2?: string;
  image1OrigData?: ImageOrigData;
  image2OrigData?: ImageOrigData;
  showDrawing: boolean;
  aloneScreen: boolean;
  music?: string;
  muteChapterMusic: boolean;
  screenCompleted: boolean;
};

export type GameWipeScreen = {
  id: string;
  type: typeof screenType.GAME_WIPE;
  title?: string;
  task: string;
  image1?: string;
  image2?: string;
  image1OrigData?: ImageOrigData;
  image2OrigData?: ImageOrigData;
  aloneScreen: boolean;
  music?: string;
  muteChapterMusic: boolean;
  screenCompleted: boolean;
};

export type GameSizingScreen = {
  id: string;
  type: typeof screenType.GAME_SIZING;
  title?: string;
  task: string;
  image1?: string;
  image2?: string;
  image3?: string;
  image1OrigData?: ImageOrigData;
  image2OrigData?: ImageOrigData;
  image3OrigData?: ImageOrigData;
  aloneScreen: boolean;
  music?: string;
  muteChapterMusic: boolean;
  screenCompleted: boolean;
};

export type GameMoveScreen = {
  id: string;
  type: typeof screenType.GAME_MOVE;
  title?: string;
  task: string;
  image1?: string;
  image2?: string;
  object?: string;
  image1OrigData?: ImageOrigData;
  image2OrigData?: ImageOrigData;
  objectOrigData?: ImageOrigData;
  aloneScreen: boolean;
  music?: string;
  muteChapterMusic: boolean;
  screenCompleted: boolean;
};

export type GameQuizScreen = {
  id: string;
  type: typeof screenType.GAME_OPTIONS;
  title?: string;
  task: string;
  image?: string;
  imageOrigData?: ImageOrigData;
  answers?: {
    correct: boolean;
    text: string;
    image: string;
    imageOrigData: ImageOrigData;
  }[];
  aloneScreen: boolean;
  music?: string;
  muteChapterMusic: boolean;
  screenCompleted: boolean;
};
