import { ZoomInTooltipPosition } from "containers/views/types";
import { animationType } from "enums/animation-type";
import { horizontalPosition, verticalPosition } from "enums/screen-enums";
import { screenType } from "enums/screen-type";

import { Document } from "./document";
import { Infopoint } from "./infopoint";

export type Screen =
  | StartScreen
  | FinishScreen
  | IntroScreen
  | ImageScreen
  | VideoScreen
  | TextScreen
  | PhotogaleryScreen
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

export type ImageOrigData = {
  width: number;
  height: number;
};

type Collaborator = {
  role: string;
  text: string;
};

export type StartScreen = {
  id: string;
  type: typeof screenType.START;
  title?: string;
  subTitle?: string;
  perex: string;
  image?: string;
  imageOrigData: ImageOrigData;
  animationType: keyof typeof animationType;
  expoTime: number;
  audio: string;
  collaborators: Collaborator[];
  documents: Document[];
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
  animationType: keyof typeof animationType;
  audio?: string;
  time: number;
  timeAuto: boolean;
  music: string;
  documents: Document[];
  screenCompleted: boolean;
};

export type ImageScreen = {
  id: string;
  type: typeof screenType.IMAGE;
  title?: string;
  text?: string;
  image?: string;
  imageOrigData?: ImageOrigData;
  animationType: keyof typeof animationType;
  audio?: string;
  time: number;
  timeAuto: boolean;
  infopoints?: Infopoint[];
  documents: Document[];
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
  documents: Document[];
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
  documents: Document[];
  aloneScreen: boolean;
  music?: string;
  muteChapterMusic: boolean;
  screenCompleted: boolean;
};

export type PhotogaleryScreen = {
  id: string;
  type: typeof screenType.PHOTOGALERY;
  title?: string;
  text?: string;
  images?: {
    id: string;
    imageOrigData: ImageOrigData;
    infopoints: Infopoint[];
  }[];
  animationType: keyof typeof animationType;
  audio?: string;
  time: number;
  timeAuto: boolean;
  documents: Document[];
  aloneScreen: boolean;
  music?: string;
  muteChapterMusic: boolean;
  screenCompleted: boolean;
};

export type ParallaxScreeen = {
  id: string;
  type: typeof screenType.PARALLAX;
  title?: string;
  text?: string;
  images?: string[];
  animationType: keyof typeof animationType;
  audio?: string;
  time: number;
  timeAuto: boolean;
  documents: Document[];
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
  documents: Document[];
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
  image1?: string;
  image2?: string;
  image1OrigData?: ImageOrigData;
  image2OrigData?: ImageOrigData;
  animationType: keyof typeof animationType;
  audio?: string;
  time: number;
  timeAuto: boolean;
  documents: [];
  aloneScreen: boolean;
  music?: string;
  muteChapterMusic: boolean;
  screenCompleted: boolean;
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
  documents: Document[];
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
