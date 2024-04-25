import * as Yup from "yup";
import { InfopointBodyType, InfopointShape } from "models/infopoint";

export const infopointSchema = Yup.object({
  header: Yup.string().optional(),
  bodyContentType: Yup.mixed<InfopointBodyType>().oneOf([
    "TEXT",
    "IMAGE",
    "VIDEO",
  ]),
  text: Yup.string().when("bodyContentType", {
    is: (bodyContentType: InfopointBodyType) => bodyContentType === "TEXT",
    then: (schema) =>
      schema.required("*Povinné").max(150, "*Maximálně 150 znaků."),
  }),
  imageName: Yup.string().when("bodyContentType", {
    is: (bodyContentType: InfopointBodyType) => bodyContentType === "IMAGE",
    then: (schema) => schema.required("*Povinné"),
  }),
  // imageFile is display none
  videoName: Yup.string().when("bodyContentType", {
    is: (bodyContentType: InfopointBodyType) => bodyContentType === "VIDEO",
    then: (schema) => schema.required("*Povinné"),
  }),
  // videoFile is display none
  alwaysVisible: Yup.boolean().optional(),

  isUrlIncluded: Yup.boolean().optional(),
  url: Yup.string().when("isUrlIncluded", {
    is: (isUrlIncluded: boolean) => isUrlIncluded === true,
    then: (schema) => schema.required("*Povinné"),
  }),
  urlName: Yup.string().when("isUrlIncluded", {
    is: (isUrlIncluded: boolean) => isUrlIncluded === true,
    then: (schema) => schema.required("*Povinné"),
  }),

  isScreenIdIncluded: Yup.boolean().optional(),
  screenIdReference: Yup.string().when("isScreenIdIncluded", {
    is: (isScreenIdIncluded: boolean) => isScreenIdIncluded === true,
    then: (schema) => schema.required("*Povinné"),
  }),
  screenNameReference: Yup.string().when("isScreenIdIncluded", {
    is: (isScreenIdIncluded: boolean) => isScreenIdIncluded === true,
    then: (schema) => schema.required("*Povinné"),
  }),

  shape: Yup.mixed<InfopointShape>().oneOf(["SQUARE", "CIRCLE", "ICON"]),
  pxSize: Yup.number()
    .min(1, "Nemůže být menší než 1 pixel")
    .required("*Povinné"),
  color: Yup.string().when("shape", {
    is: (shape: InfopointShape) => shape !== "ICON",
    then: (schema) => schema.required("*Povinné"),
  }),
  iconName: Yup.string().when("shape", {
    is: (shape: InfopointShape) => shape === "ICON",
    then: (schema) => schema.required("*Povinné"),
  }),
  // iconFile is display none
});
