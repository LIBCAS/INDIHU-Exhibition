import * as Yup from "yup";
import { InfopointBodyType, InfopointShape } from "models/infopoint";
import { TFunction } from "i18next";

export const retrieveInfopointSchema = (t: TFunction) => {
  return Yup.object({
    header: Yup.string().optional(),
    bodyContentType: Yup.mixed<InfopointBodyType>().oneOf([
      "TEXT",
      "IMAGE",
      "VIDEO",
    ]),
    text: Yup.string().when("bodyContentType", {
      is: (bodyContentType: InfopointBodyType) => bodyContentType === "TEXT",
      then: (schema) => schema.optional().max(150, t("max150Chars")),
    }),
    imageName: Yup.string().when("bodyContentType", {
      is: (bodyContentType: InfopointBodyType) => bodyContentType === "IMAGE",
      then: (schema) => schema.required(t("required")),
    }),
    // imageFile is display none
    videoName: Yup.string().when("bodyContentType", {
      is: (bodyContentType: InfopointBodyType) => bodyContentType === "VIDEO",
      then: (schema) => schema.required(t("required")),
    }),
    // videoFile is display none
    alwaysVisible: Yup.boolean().optional(),

    isUrlIncluded: Yup.boolean().optional(),
    url: Yup.string().when("isUrlIncluded", {
      is: (isUrlIncluded: boolean) => isUrlIncluded === true,
      then: (schema) => schema.required(t("required")),
    }),
    urlName: Yup.string().when("isUrlIncluded", {
      is: (isUrlIncluded: boolean) => isUrlIncluded === true,
      then: (schema) => schema.required(t("required")),
    }),

    isScreenIdIncluded: Yup.boolean().optional(),
    screenIdReference: Yup.string().when("isScreenIdIncluded", {
      is: (isScreenIdIncluded: boolean) => isScreenIdIncluded === true,
      then: (schema) => schema.required(t("required")),
    }),
    screenNameReference: Yup.string().when("isScreenIdIncluded", {
      is: (isScreenIdIncluded: boolean) => isScreenIdIncluded === true,
      then: (schema) => schema.required(t("required")),
    }),

    shape: Yup.mixed<InfopointShape>().oneOf(["SQUARE", "CIRCLE", "ICON"]),
    pxSize: Yup.number().min(1, t("atLeastOnePixel")).required(t("required")),
    color: Yup.string().when("shape", {
      is: (shape: InfopointShape) => shape !== "ICON",
      then: (schema) => schema.required(t("required")),
    }),
    iconName: Yup.string().when("shape", {
      is: (shape: InfopointShape) => shape === "ICON",
      then: (schema) => schema.required(t("required")),
    }),
    // iconFile is display none
  });
};
