export const required = (t) => (value) => value ? undefined : t("required");

export const email = (t) => (value) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? undefined
    : t("invalidEmailFormat");
