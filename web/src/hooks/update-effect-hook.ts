import { DependencyList, EffectCallback, useEffect } from "react";

import { useIsFirstRender } from "./first-render-hook";

export const useUpdateEffect = (
  effect: EffectCallback,
  deps?: DependencyList
) => {
  const isFirst = useIsFirstRender();

  useEffect(() => {
    if (isFirst) return;

    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
