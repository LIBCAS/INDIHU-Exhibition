import { useState, useEffect, useCallback } from "react";
import { Size } from "models";

const useElementSize = <T extends HTMLElement = HTMLDivElement>(): [
  (node: T | null) => void,
  Size,
  T | null
] => {
  const [ref, setRef] = useState<T | null>(null);
  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  // - -

  useEffect(() => {
    handleSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.offsetHeight, ref?.offsetWidth]);

  // - -

  const handleSize = useCallback(() => {
    setSize({
      width: ref?.offsetWidth || 0,
      height: ref?.offsetHeight || 0,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.offsetHeight, ref?.offsetWidth]);

  useEffect(() => {
    window.addEventListener("resize", handleSize);

    return () => window.removeEventListener("resize", handleSize);
  }, [handleSize]);

  return [setRef, size, ref];
};

export default useElementSize;
