export const required = (value) => (value ? undefined : "*Povinné");

export const email = (value) =>
  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? "*Neplatný formát e-mail adresy"
    : undefined;
