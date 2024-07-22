import { useCallback } from "react";
import { useCountdown } from "hooks/countdown-hook";
import { useExpoNavigation } from "hooks/view-hooks/expo-navigation-hook";

type UseGameAutoNavigationOnResultTimeElapsedProps = {
  gameResultTime: number; // in milliseconds
  isGameFinished: boolean;
};

export const useGameAutoNavigationOnResultTimeElapsed = ({
  gameResultTime,
  isGameFinished,
}: UseGameAutoNavigationOnResultTimeElapsedProps) => {
  const { navigateForward } = useExpoNavigation();

  // NOTE: it is important that the deps array is empty
  const onCountdownFinish = useCallback(() => {
    navigateForward();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useCountdown(gameResultTime, {
    isPaused: !isGameFinished,
    onFinish: onCountdownFinish,
  });
};
