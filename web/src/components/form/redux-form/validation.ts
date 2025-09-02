import { TFunction } from "i18next";

export const required = (t: TFunction) => (value: string) =>
  value ? undefined : t("required");

export const email = (t: TFunction) => (value: string) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? undefined
    : t("invalidEmailFormat");
