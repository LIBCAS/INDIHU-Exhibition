import { useCallback, useEffect, useMemo, useState } from "react";

type Options = {
  onFinish?: () => void;
  isPaused?: boolean;
  tick?: number;
};

/**
 * NOTE: onFinish function should be wrapped within useCallback
 */
export const useCountdown = (time: number, options?: Options) => {
  const { onFinish, isPaused = false, tick = 250 } = options ?? {};

  const [elapsedTime, setElapsedTime] = useState(0);

  const isFinished = useMemo(() => elapsedTime >= time, [elapsedTime, time]);

  const resetCountdown = useCallback(() => setElapsedTime(0), []);

  // Restart countdown on input time change
  useEffect(() => setElapsedTime(0), [time]);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const interval = setInterval(
      () => setElapsedTime((prev) => prev + tick),
      tick
    );

    return () => clearInterval(interval);
  }, [isPaused, tick]);

  useEffect(() => {
    if (!isFinished) {
      return;
    }

    onFinish?.();
  }, [isFinished, onFinish]);

  return { resetCountdown, elapsedTime, isFinished };
};
