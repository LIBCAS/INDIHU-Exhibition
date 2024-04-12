import { useCallback, useMemo, useState } from "react";

type BooleanHookReturnType = [
  value: boolean,
  handlers: {
    setTrue: () => void;
    setFalse: () => void;
    toggle: () => void;
  }
];

export const useBoolean = (initial: boolean): BooleanHookReturnType => {
  const [value, setValue] = useState(initial);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((prev) => !prev), []);

  return useMemo(
    () => [
      value,
      {
        setTrue,
        setFalse,
        toggle,
      },
    ],
    [setFalse, setTrue, toggle, value]
  );
};
