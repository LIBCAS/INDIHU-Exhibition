import { TFunction } from "i18next";
import { InfopointFormType } from "./InfopointForm";

// - - - - - -

type InfopointFormTranslations = {
  headerLabel: string;
  bodyContentTypeLabel: string;
  textBodyLabel: string;
  additionalPropertiesSubheader: string;
  shapeLabel: string;
  colorLabel: string;
};

// - - - - - -

export const retrieveInfopointFormTranslations = (
  t: TFunction,
  type: InfopointFormType
): InfopointFormTranslations => {
  if (type === "timeline") {
    return {
      headerLabel: t("timelineType.headerLabel"),
      bodyContentTypeLabel: t("timelineType.bodyContentTypeLabel"),
      textBodyLabel: t("timelineType.textBodyLabel"),
      additionalPropertiesSubheader: t(
        "timelineType.additionalPropertiesSubheader"
      ),
      shapeLabel: t("timelineType.shapeLabel"),
      colorLabel: t("timelineType.colorLabel"),
    };
  }

  return {
    headerLabel: t("headerLabel"),
    bodyContentTypeLabel: t("bodyContentTypeLabel"),
    textBodyLabel: t("textBodyLabel"),
    additionalPropertiesSubheader: t("additionalPropertiesSubheader"),
    shapeLabel: t("shapeLabel"),
    colorLabel: t("colorLabel"),
  };
};
