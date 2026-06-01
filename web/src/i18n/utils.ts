import { LanguageKey } from "i18n";

/**
 *
 */
export const determineCurrentLanguage = (language: string): LanguageKey => {
  if (language.startsWith("en")) {
    return "en";
  }
  if (language.startsWith("sk")) {
    return "sk";
  }
  return "cs";
};
