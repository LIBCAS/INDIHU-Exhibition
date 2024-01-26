export const getEmailContent = (expoTitle: string, expoUrl: string) => {
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
