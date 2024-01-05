export const getEmailContent = (expoTitle: string, expoUrl: string) => {
  return {
    subject: "INDIHU Exhibition - Pozvánka do výstavy",
    body: `Dobr%C3%BD%20den%20%2F%20Ahoj%2C

          %0D%0A%0D%0Apos%C3%ADl%C3%A1m%20V%C3%A1m%20%2F%20Ti%20pozv%C3%A1nku%20na%20virtu%C3%A1ln%C3%AD%20v%C3%BDstavu%20s%20n%C3%A1zvem%20
          ${expoTitle}.

          %0D%0A%0D%0AUrl: ${expoUrl}.

          %0D%0A%0D%0AP%C5%99eji%20p%C5%99%C3%ADjemnou%20z%C3%A1bavu!`,
  };
};
