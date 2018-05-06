import { File } from "models/file";

type EmptyLinkDocument = {
  fileName: string;
};

type UrlDocument = {
  fileName: string;
  url: string;
  urlType: "audio/*" | "image/*" | "video/*" | "application/pdf" | "WEB";
};

type FileDocument = File;

export type Document = EmptyLinkDocument | UrlDocument | FileDocument;
