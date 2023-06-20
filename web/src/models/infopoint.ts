import { File } from "./file";

export type Infopoint = {
  header?: string; // optional header
  bodyContentType: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT";
  text?: string; // present only if bodyContentType is TEXT
  imageFile?: File; // present only if bodyContentType is IMAGE
  videoFile?: File; // present only if bodyContentType is VIDEO
  documentFile?: File; // present only if bodyContentType is DOCUMENT
  alwaysVisible: boolean;
  isUrlIncluded: boolean;
  url?: string; // present only if isUrlIncluded is set to true
  urlType?: string; // present only if isUrlIncluded is set to true
  top: number;
  left: number;
  edit: boolean;
  move: boolean;
  //positionX: number;
  //positionY: number;
};
