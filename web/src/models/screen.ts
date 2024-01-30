import { MutableRefObject } from "react";

// Enums
import { screenType } from "enums/screen-type";

// Models
import { Document } from "./document";
import { Infopoint } from "./infopoint";
import { ScreenPreloadedFiles } from "context/file-preloader/file-preloader-provider";
import { ActiveExpo } from "./exposition";

// NEW
import {
  GameQuizAnswersType,
  GameQuizType,
  GameQuizAnswerDisplayType,
  ZoomInTooltipPositionType,
  ImageChangeAnimationType,
  ImageChangeRodPositionType,
  ImageChangeGradualTransitionBeginPositionType,
  SignpostReferenceType,
  ScreenChapterStartHorizontalPositionType,
  ScreenChapterStartVerticalPositionType,
  ScreenChapterStartAnimationType,
  ScreenStartAnimationType,
  ScreenImageAnimationType,
  SlideshowScreenAnimationType,
  ScreenParallaxAnimationType,
  ScreenChapterIntroTextThemeType,
  ScreenChapterIntroTextHaloEffectOnType,
} from "./screen-administration";

// - - - - -

export type ScreenProps = {
  screenPreloadedFiles: ScreenPreloadedFiles;
  infoPanelRef: MutableRefObject<HTMLDivElement | null>;
  actionsPanelRef: MutableRefObject<HTMLDivElement | null>;
  chapterMusicRef: HTMLAudioElement | null;
  isMobileOverlay: boolean;
};

export type ScreenEditorProps = {
  activeExpo: ActiveExpo;
  activeScreen: Screen;
  url: string;
};

export type ConcreteScreenEditorProps<S> = {
  [Key in keyof ScreenEditorProps]: Key extends "activeScreen"
    ? S
    : ScreenEditorProps[Key];
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

export type SlideshowImages = {
  id: string;
  imageOrigData: ImageOrigData;
  infopoints: Infopoint[];
  time?: number;
  active?: boolean;
}[];

export type ParallaxImages = string[];
export type PhotogalleryImages = {
  id: string;
  active?: boolean;
  photoTitle?: string;
  photoDescription?: string;
}[];

export type Sequence = {
  left: number;
  top: number;
  text: string;
  zoom: number; // power of zoom scale
  time: number; // zoom time, how much time until fully zoomed and then also fully unzoomed
  stayInDetailTime?: number; // zoom in with time, stayDetail time, zoom out with time
  edit?: boolean; // whether being currently edited
  move?: boolean; // whether its infopoint being currently moved
  timeError?: boolean;
};

export type GameQuizAnswer = {
  correct: boolean;
  text: string;
  image: string | null; // imageId or null if image was not loaded
  imageOrigData?: ImageOrigData; // optional if image was not loaded yet
  infopoints?: Infopoint[];
  customUserLabel?: string;
};

export type EraserToolType =
  | "eraser"
  | "broom"
  | "brush"
  | "chisel"
  | "hammer"
  | "stick"
  | "towel"
  | "wipe_towel";

export type ReferenceObj = {
  reference: string | null; // string as screen.id
  image?: string;
  text?: string;
  customUserLabel?: string;
};

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
  | SignpostScreen
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
  animationType: ScreenStartAnimationType;
  expoTime: number;
  audio: string;
  collaborators: Collaborator[];
  documents?: Document[];
  screenCompleted: boolean;
  organization?: string;
  organizationLink?: string;
};

export type FinishScreen = {
  id?: string;
  type: typeof screenType.FINISH;
  title?: string;
  image?: string;
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
    horizontal?: ScreenChapterStartHorizontalPositionType;
    vertical?: ScreenChapterStartVerticalPositionType;
  };
  animationType: ScreenChapterStartAnimationType;
  audio?: string;
  time: number;
  timeAuto: boolean;
  music: string;
  documents?: Document[];
  screenCompleted: boolean;
  introTextTheme?: ScreenChapterIntroTextThemeType;
  isIntroTextHaloEffectOn?: ScreenChapterIntroTextHaloEffectOnType;
};

export type ImageScreen = {
  id: string;
  type: typeof screenType.IMAGE;
  title?: string;
  text?: string;
  image?: string;
  imageOrigData?: ImageOrigData;
  animationType: ScreenImageAnimationType;
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
  audio?: string;
  time: number;
  timeAuto: boolean;
  muteChapterMusic: boolean;
  screenCompleted: boolean;
  mainText: string;
  documents?: Document[];
  aloneScreen: boolean;
  music?: string;
};

export type SlideshowScreen = {
  id: string;
  type: typeof screenType.SLIDESHOW;
  title?: string;
  text?: string;
  images?: SlideshowImages;
  animationType: SlideshowScreenAnimationType;
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
  animationType: ScreenParallaxAnimationType;
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
  sequences?: Sequence[];
  tooltipPosition?: ZoomInTooltipPositionType;
  seqDelayTime?: number;
  audio?: string;
  time: number;
  timeAuto?: boolean;
  documents?: Document[];
  aloneScreen: boolean;
  music?: string;
  muteChapterMusic?: boolean;
  screenCompleted?: boolean;
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
  animationType?: ImageChangeAnimationType;
  rodPosition?: ImageChangeRodPositionType;
  gradualTransitionBeginPosition?: ImageChangeGradualTransitionBeginPositionType;
  image1Infopoints?: Infopoint[];
  image2Infopoints?: Infopoint[];
};

export type ExternalScreen = {
  id: string;
  type: typeof screenType.EXTERNAL;
  title?: string;
  text?: string;
  externalData: string;
  shouldScaleExternalData?: boolean;
  audio?: string;
  time: number;
  timeAuto: boolean;
  documents?: Document[];
  aloneScreen: boolean;
  music?: string;
  muteChapterMusic: boolean;
  screenCompleted: boolean;
};

export type SignpostScreen = {
  id: string;
  type: typeof screenType.SIGNPOST;
  title?: string;
  text?: string;
  audio?: string;
  time: number;
  timeAuto: number;
  documents?: Document[];
  aloneScreen: boolean;
  //music
  muteChapterMusic: boolean;
  screenCompleted: boolean;
  // Specific attributes
  header?: string;
  subheader?: string;
  referenceType?: SignpostReferenceType;
  links: ReferenceObj[];
  nextScreenReference?: string; // screen.id as string
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
  resultTime?: number;
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
  resultTime?: number;
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
  resultTime?: number;
  eraserToolType?: EraserToolType;
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
  resultTime?: number;
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
  resultTime?: number;
};

export type GameQuizScreen = {
  id: string;
  type: typeof screenType.GAME_OPTIONS;
  title?: string;
  task?: string;
  image?: string;
  imageOrigData?: ImageOrigData;
  answers: GameQuizAnswer[];
  aloneScreen: boolean;
  music?: string;
  muteChapterMusic?: boolean;
  screenCompleted?: boolean;
  answersType?: GameQuizAnswersType;
  quizType?: GameQuizType;
  answersTextDisplayType?: GameQuizAnswerDisplayType;
};
