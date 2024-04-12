import { useCallback, useEffect, useMemo, useState } from "react";

type Options = {
  onFinish?: () => void;
  paused?: boolean;
  tick?: number;
};

export const useCountdown = (time: number, options?: Options) => {
  const { onFinish, paused = false, tick = 250 } = options ?? {};

  const [elapsed, setElapsed] = useState(0);

  const finished = useMemo(() => elapsed >= time, [elapsed, time]);

  useEffect(() => setElapsed(0), [time]);

  useEffect(() => {
    if (paused) {
      return;
    }

    const interval = setInterval(() => setElapsed((prev) => prev + tick), tick);

    return () => clearInterval(interval);
  }, [paused, tick]);

  const reset = useCallback(() => setElapsed(0), []);

  useEffect(() => {
    if (!finished) {
      return;
    }

    onFinish?.();
  }, [finished, onFinish]);

  return { reset, elapsed, finished };
};
