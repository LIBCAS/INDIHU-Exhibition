import { useEffect, useState } from "react";

const useLocalStorageListener = (key: string) => {
  const [value, setValue] = useState<string | null>(localStorage.getItem(key));

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        const newValue = event.newValue;
        setValue(newValue);
      }
    };

    // Add event listener to listen for changes in local storage
    window.addEventListener("storage", handleStorageChange);

    return () => {
      // Remove the event listener when the component unmounts
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  return value;
};

export default useLocalStorageListener;
