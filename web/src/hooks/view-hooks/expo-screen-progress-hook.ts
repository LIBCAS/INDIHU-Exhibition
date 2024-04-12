import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { AppState } from "store/store";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewProgress,
  (viewProgress) => ({ viewProgress })
);

type Props = {
  offsetTotalTime?: number;
};

export const useExpoScreenProgress = (props?: Props) => {
  const { offsetTotalTime = 0 } = props ?? { offsetTotalTime: 0 };
  const { viewProgress } = useSelector(stateSelector);

  const percentage = useMemo(
    () =>
      (viewProgress.timeElapsed / (viewProgress.totalTime + offsetTotalTime)) *
      100,
    [offsetTotalTime, viewProgress.timeElapsed, viewProgress.totalTime]
  );

  return useMemo(() => ({ percentage }), [percentage]);
};
