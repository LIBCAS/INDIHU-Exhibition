import { TFunction } from "i18next";
import { PreferenceObj } from "models";

// - - -

type PreferenceKey = keyof PreferenceObj;

export const getPreferenceText = (preferences: PreferenceObj, t: TFunction) => {
  if (!preferences) {
    return null;
  }

  const preferenceTranslator: Record<PreferenceKey, string> = {
    topic: t("expoCard.preferenceTopic"),
    game: t("expoCard.preferenceGame"),
    text: t("expoCard.preferenceText"),
    media: t("expoCard.preferenceMedia"),
  };

  const entries = Object.entries(preferences);
  const bestPreferences = entries
    .filter((entry) => entry[1] === true)
    .map((entry) => {
      const prefKey = entry[0] as PreferenceKey;
      return preferenceTranslator[prefKey];
    });

  if (bestPreferences.length === 0) {
    return null;
  }
  return bestPreferences.join(" / ");
};

// - - -
