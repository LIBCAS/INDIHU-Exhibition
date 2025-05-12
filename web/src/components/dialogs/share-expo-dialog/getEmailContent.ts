import { LanguageKey } from "i18n";

export const getEmailContent = (
  languageKey: LanguageKey,
  expoTitle: string,
  expoUrl: string
) => {
  if (languageKey === "en") {
    return getEmailContentEn(expoTitle, expoUrl);
  }
  if (languageKey === "sk") {
    return getEmailContentSk(expoTitle, expoUrl);
  }
  return getEmailContentCz(expoTitle, expoUrl);
};

const getEmailContentCz = (expoTitle: string, expoUrl: string) => {
  return {
    subject: "INDIHU Exhibition - Pozvánka do výstavy",
    body: `${encodeURIComponent(
      `Dobrý den / Ahoj,

      posílám Vám / Ti pozvánku na virtuální výstavu s názvem ${expoTitle}.

      Odkaz na výstavu: ${expoUrl}

      Přeji příjemnou zábavu!
    `
    )}`,
  };
};

const getEmailContentSk = (expoTitle: string, expoUrl: string) => {
  return {
    subject: "INDIHU Exhibition - Pozvánka do výstavy",
    body: `${encodeURIComponent(
      `Dobrý deň / Ahoj,

      posielam Vám / Ti pozvánku na virtuálnu výstavu s názvom ${expoTitle}.

      Odkaz na výstavu: ${expoUrl}

      Prajem príjemnú zábavu!
    `
    )}`,
  };
};

const getEmailContentEn = (expoTitle: string, expoUrl: string) => {
  return {
    subject: "INDIHU Exhibition - Pozvánka do výstavy",
    body: `${encodeURIComponent(
      `Good day / Hello,

      I am sending you an invitation to a virtual exhibition entitled ${expoTitle}.

      Link to the exhibition: ${expoUrl}

      Have fun!
    `
    )}`,
  };
};
