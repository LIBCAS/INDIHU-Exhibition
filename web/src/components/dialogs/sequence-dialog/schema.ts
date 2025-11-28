import { TFunction } from "i18next";
import * as Yup from "yup";

export const retrieveSequenceSchema = (t: TFunction) => {
  return Yup.object({
    text: Yup.string().max(150, t("max150Chars")),
    zoom: Yup.number().min(1, t("atLeastOne")).required(t("required")),
    time: Yup.number().min(1, t("atLeastOne")).required(t("required")),
    stayInDetailTime: Yup.number()
      .min(1, t("atLeastOne"))
      .required(t("required")),
  });
};
