export const getEmailContent = (expoTitle: string, expoUrl: string) => {
  return {
    subject: "INDIHU Exhibition - Pozvánka do výstavy",
    body: `${encodeURIComponent(
      `Dobrý den / Ahoj,

      posílám Vám / Ti pozvánku na virtuální výstavu s názvem ${expoTitle}.

      Url: ${expoUrl}.

      Přeji příjemnou zábavu!
    `
    )}`,
  };
};
