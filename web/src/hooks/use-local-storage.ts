// import { useCallback, useState } from "react";

// export const useLocalStorage = <TValue>(key: string, initialValue: TValue) => {
//   const [storedValue, setStoredValue] = useState<TValue>(() => {
//     try {
//       const item = window.localStorage.getItem(key);
//       return item ? JSON.parse(item) : initialValue;
//     } catch (err) {
//       // noop
//     }
//   });

//   const setValue = useCallback(
//     (value: TValue | ((val: TValue) => TValue)) => {
//       try {
//         const valueToStore =
//           value instanceof Function ? value(storedValue) : value;
//         setStoredValue(valueToStore);
//         window.localStorage.setItem(key, JSON.stringify(valueToStore));
//       } catch (error) {
//         // noop
//       }
//     },
//     [key, storedValue]
//   );

//   return [storedValue, setValue] as const;
// };

// - - - - - - - - - -

// [T, (value: T) => void]
// readonly [T, (value: T) => void]

import { useState, useEffect, useCallback } from "react";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [state, setState] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  const updateState = useCallback(
    (value: T | ((prevValue: T) => T)) => {
      const newValue = value instanceof Function ? value(state) : value;
      setState(newValue);
    },
    [state]
  );

  return [state, updateState] as const;
};
