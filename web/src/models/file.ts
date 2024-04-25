export type File = {
  name: string;
  type: string; //'application/pdf', 'image/jpeg', 'image/png', 'audio/mpeg' ..
  size: string;
  created: string;
  id: string;
  fileId: string;
  thumbnailId?: string; // for image files
  fileName?: string; // for links
  duration?: number; // for video and audio files
  documentFileType?: "worksheet" | "exhibitionFile";
  contentType?: string;
  width?: number;
  height?: number;
  content?: any;
  show?: boolean;
};

export type Folder = {
  files?: File[];
};

// Possible file.type:
// "image/jpeg", "image/png", ...
// "audio/mpeg", "video/mp4", "audio/mp4" (.m4a), ...
// "application/pdf"
// "application/vnd.openxmlformats-officedocument.presentationml.presentation" (pptx)
// "application/vnd.openxmlformats-officedocument.wordprocessingml.document" (docx)
