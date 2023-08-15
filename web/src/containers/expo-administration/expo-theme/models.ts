import { File as IndihuFile } from "models";
import { InfopointShape } from "models/infopoint";

export type ThemeFormData = {
  // 1
  theme: "LIGHT" | "DARK";
  backgroundColor: string;
  iconsColor: string;
  startButtonColor: string;
  tagsColor: string;
  // 2
  logoType: "LOGO" | "WATERMARK";
  logoPosition: "UPPER_LEFT" | "UPPER_RIGHT" | "LOWER_LEFT";
  logoFileName: string;
  logoFile: IndihuFile | null;
  // 3
  defaultInfopointShape: InfopointShape;
  defaultInfopointPxSize: number;
  defaultInfopointColor: string;
  defaultInfopointIconFileName: string;
  defaultInfopointIconFile: IndihuFile | null;
};

// Sending to BE
export type ThemeFormDataProcessed = {
  // 1
  theme: "LIGHT" | "DARK";
  backgroundColor: string;
  iconsColor: string;
  startButtonColor: string;
  tagsColor: string;
  // 2
  logoType: "LOGO" | "WATERMARK";
  logoPosition: "UPPER_LEFT" | "UPPER_RIGHT" | "LOWER_LEFT";
  logoFile?: IndihuFile;
  // 3
  defaultInfopointShape: InfopointShape;
  defaultInfopointPxSize: number;
  defaultInfopointColor: string;
  defaultInfopointIconFile?: IndihuFile;
};
