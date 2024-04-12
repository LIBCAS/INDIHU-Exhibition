import { useMemo } from "react";

import { DefaultOptions } from "types";
import { mergeOptional } from "utils/merge-optional";

export const useOptionsMerge = <
  T extends Record<string, unknown>,
  K extends DefaultOptions<T>
>(
  defaultOptions: K,
  options: T
) =>
  useMemo(
    () => mergeOptional(defaultOptions, options),
    [defaultOptions, options]
  );
