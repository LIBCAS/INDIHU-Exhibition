import { InfopointBodyType, InfopointShape } from "models/infopoint";
import { File as IndihuFile } from "models";

export interface InfopointFormData {
  header: string;
  bodyContentType: InfopointBodyType;
  text: string;
  imageName: string;
  imageFile: File | IndihuFile | null;
  videoName: string;
  videoFile: File | IndihuFile | null;
  alwaysVisible: boolean;
  isUrlIncluded: boolean;
  url: string;
  urlName: string;
  isScreenIdIncluded: boolean;
  screenIdReference: string;
  screenNameReference: string;
  shape: InfopointShape;
  pxSize: number;
  color: string;
  iconName: string;
  iconFile: File | IndihuFile | null;
}

export interface InfopointFormDataProcessed {
  header?: string;
  bodyContentType: InfopointBodyType;
  text?: string;
  imageFile?: File | IndihuFile | null;
  videoFile?: File | IndihuFile | null;
  alwaysVisible: boolean;
  isUrlIncluded: boolean;
  url?: string;
  urlName?: string;
  isScreenIdIncluded: boolean;
  screenIdReference?: string; // id of the screen
  screenNameReference?: string; // custom label for the link
  shape: InfopointShape;
  pxSize: number;
  color?: string;
  iconFile?: File | IndihuFile | null;
}
