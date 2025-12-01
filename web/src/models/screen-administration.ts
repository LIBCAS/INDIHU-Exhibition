import {
  GameQuizAnswerEnum,
  GameQuizEnum,
  GameQuizTextDisplayEnum,
  ZoomInTooltipPositionEnum,
  ZoomTypeEnum,
  ImageChangeAnimationEnum,
  ImageChangeGradualTransitionBeginPositionEnum,
  SignpostReferenceEnum,
  ScreenChapterStartHorizontalPositionEnum,
  ScreenChapterStartVerticalPositionEnum,
  ScreenChapterStartAnimationEnum,
  ScreenStartAnimationEnum,
  ScreenImageAnimationEnum,
  SlideshowScreenAnimationEnum,
  ScreenParallaxAnimationEnum,
  TimelineTypeEnum,
  TimelineLeftBoundaryEnum,
  TimelineRightBoundaryEnum,
} from "enums/administration-screens";

// - - - - - -

export type GameQuizAnswersType = keyof typeof GameQuizAnswerEnum;
export type GameQuizType = keyof typeof GameQuizEnum;
export type GameQuizAnswerDisplayType = keyof typeof GameQuizTextDisplayEnum;

export type ZoomInTooltipPositionType = keyof typeof ZoomInTooltipPositionEnum;
export type ZoomType = keyof typeof ZoomTypeEnum;

export type ImageChangeAnimationType = keyof typeof ImageChangeAnimationEnum;
export type ImageChangeRodPositionType = "0" | "0.25" | "0.5" | "0.75" | "1"; // TODO
export type ImageChangeGradualTransitionBeginPositionType =
  keyof typeof ImageChangeGradualTransitionBeginPositionEnum;

export type SignpostReferenceType = keyof typeof SignpostReferenceEnum;

export type ScreenChapterStartHorizontalPositionType =
  keyof typeof ScreenChapterStartHorizontalPositionEnum;
export type ScreenChapterStartVerticalPositionType =
  keyof typeof ScreenChapterStartVerticalPositionEnum;
export type ScreenChapterStartAnimationType =
  keyof typeof ScreenChapterStartAnimationEnum;
export type ScreenChapterIntroTextThemeType = "light" | "dark"; // TODO
export type ScreenChapterIntroTextHaloEffectOnType = "on" | "off"; // TODO

export type ScreenStartAnimationType = keyof typeof ScreenStartAnimationEnum;

export type ScreenImageAnimationType = keyof typeof ScreenImageAnimationEnum;

export type SlideshowScreenAnimationType =
  keyof typeof SlideshowScreenAnimationEnum;

export type ScreenParallaxAnimationType =
  keyof typeof ScreenParallaxAnimationEnum;

export type TimelineType = keyof typeof TimelineTypeEnum;
export type TimelineLeftBoundary = keyof typeof TimelineLeftBoundaryEnum;
export type TimelineRightBoundary = keyof typeof TimelineRightBoundaryEnum;
