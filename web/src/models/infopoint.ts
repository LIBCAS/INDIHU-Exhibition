import { File } from "./file";

export type InfopointBodyType = "TEXT" | "IMAGE" | "VIDEO";

export type InfopointShape = "SQUARE" | "CIRCLE" | "ICON";

export type Infopoint = {
  header?: string; // optional header
  bodyContentType: InfopointBodyType;
  text?: string; // present only if bodyContentType is TEXT
  imageFile?: File; // present only if bodyContentType is IMAGE
  videoFile?: File; // present only if bodyContentType is VIDEO
  alwaysVisible: boolean;
  isUrlIncluded: boolean;
  url?: string; // present only if isUrlIncluded is set to true
  urlName?: string; // present only if isUrlIncluded is set to true
  isScreenIdIncluded: boolean;
  screenIdReference?: string; // id of the screen, present only if isScreenIdIncluded is set to true
  screenNameReference?: string; // present only if isScreenIdIncluded is set to true
  shape?: InfopointShape;
  pxSize: number; // number representing size of infopoint in pixels
  color?: string; // present only if shape !== "ICON", hexa string (3B or 4B.. depends if alpha is not 100%)
  iconFile?: File; // present only if shape === "ICON"
  // Rest
  top: number;
  left: number;
  edit: boolean;
  move: boolean;
  //positionX: number;
  //positionY: number;
};
