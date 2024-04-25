import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

// - -
export const languageKeys = ["cs", "en", "sk"] as const; // as given by "react-i18next"
export type LanguageKey = typeof languageKeys[number];
// - -

const backend = new Backend({
  loadPath: "/locales/{{lng}}/{{ns}}.json",
});

i18n
  .use(backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: "cs",
    interpolation: {
      escapeValue: false,
    },
    // Other initialization options like default namespace, immediate namespaced to load, etc ..
  });

export default i18n;
