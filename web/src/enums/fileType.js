export const fileType = {
  VIDEO: "video/*",
  AUDIO: "audio/*",
  IMAGE: "image/*",
  PDF: "application/pdf",
  WEB: "WEB"
};

export const fileTypeText = {
  VIDEO: "Video",
  AUDIO: "Audio",
  IMAGE: "Obraz",
  PDF: "PDF",
  WEB: "Webová stránka"
};

export const possibleFiles = [
  "music",
  "audio",
  "image",
  "images",
  "image1",
  "image2",
  "image3",
  "object",
  "video",
  "answers[0].image",
  "answers[1].image",
  "answers[2].image"
];

export const fileObjects = {
  music: "audio",
  audio: "audio",
  image: "image",
  images: "image",
  image1: "image",
  image2: "image",
  image3: "image",
  object: "image",
  video: "video",
  "answers[0].image": "image",
  "answers[1].image": "image",
  "answers[2].image": "image"
};

export const fileTypeOpts = [
  { label: fileTypeText.AUDIO, value: fileType.AUDIO },
  { label: fileTypeText.IMAGE, value: fileType.IMAGE },
  { label: fileTypeText.VIDEO, value: fileType.VIDEO },
  { label: fileTypeText.PDF, value: fileType.PDF },
  { label: fileTypeText.WEB, value: fileType.WEB }
];

export const documentOpts = [
  { label: "Žádný odkaz", value: "NONE" },
  { label: "URL", value: "URL" },
  { label: "Soubor", value: "FILE" }
];
