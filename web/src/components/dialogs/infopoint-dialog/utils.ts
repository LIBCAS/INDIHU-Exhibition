import { InfopointFormData, InfopointFormDataProcessed } from "./models";

export const createFormDataProcessed = (
  formData: InfopointFormData
): InfopointFormDataProcessed => {
  const formDataProcessed: InfopointFormDataProcessed = {
    header: formData.header ?? undefined,
    bodyContentType: formData.bodyContentType ?? "TEXT",
    text: formData.bodyContentType === "TEXT" ? formData.text : undefined,
    imageFile:
      formData.bodyContentType === "IMAGE" ? formData.imageFile : undefined,
    videoFile:
      formData.bodyContentType === "VIDEO" ? formData.videoFile : undefined,
    alwaysVisible: formData.alwaysVisible ?? false,
    isUrlIncluded: formData.isUrlIncluded ?? false,
    url: formData.isUrlIncluded ? formData.url : undefined,
    urlName: formData.isUrlIncluded ? formData.urlName : undefined,
    shape: formData.shape ?? "SQUARE",
    pxSize: formData.pxSize ?? 24,
    color: formData.shape !== "ICON" ? formData.color : undefined,
    iconFile: formData.shape === "ICON" ? formData.iconFile : undefined,
  };
  return formDataProcessed;
};
