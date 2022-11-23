import { File } from "models/file";

type ExpoDocument = {
  fileName: string;
  url: string;
  urlType: string;
};

export type Document = ExpoDocument | File;
