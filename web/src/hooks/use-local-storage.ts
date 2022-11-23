import { useCallback, useState } from "react";

export const useLocalStorage = <TValue>(key: string, initialValue: TValue) => {
  const [storedValue, setStoredValue] = useState<TValue>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      // noop
    }
  });

  const setValue = useCallback(
    (value: TValue | ((val: TValue) => TValue)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        // noop
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue] as const;
};
