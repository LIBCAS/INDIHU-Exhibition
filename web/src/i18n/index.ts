import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

const backend = new Backend({
  loadPath: "/locales/{{lng}}/{{ns}}.json",
});

i18n
  .use(backend)
  .use(initReactI18next)
  .init({
    lng: "cs",
    fallbackLng: "cs",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
