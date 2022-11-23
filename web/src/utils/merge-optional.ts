import { DefaultOptions } from "types";

export const mergeOptional = <
  T extends Record<string, unknown>,
  K extends DefaultOptions<T>
>(
  defaultOptions: K,
  options?: T
) =>
  Object.entries(options ?? {}).reduce<T & K>(
    (acc, [key, value]) => {
      if (value === undefined) {
        return acc;
      }

      return { ...acc, [key]: value };
    },
    { ...defaultOptions } as T & K
  );
