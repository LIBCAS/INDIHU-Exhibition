import { useState, useEffect } from "react";
import { Size } from "models";

type ResizeObserverOptions = {
  callback?: (newSize: Size) => void;
  ignoreUpdate?: boolean;
};

/**
 * Stronger version of useElementSize() hook
 */
const useResizeObserver = <T extends HTMLElement = HTMLDivElement>(
  opts?: ResizeObserverOptions
): [(el: T | null) => void, Size, T | null] => {
  const { callback, ignoreUpdate } = opts ?? {};

  const [elementRef, setElementRef] = useState<T | null>(null);
  const [elementSize, setElementSize] = useState<Size>({ width: 0, height: 0 });

  // Effect which runs only when elementRef changes from null to actual element, in order to initialize the element size
  useEffect(() => {
    if (elementRef) {
      setElementSize({
        width: elementRef.offsetWidth,
        height: elementRef.offsetHeight,
      });
    }
  }, [elementRef]);

  // Effect listening to resize changes to the given element (if not ignored)
  // If ignored, only initial size is taken into consideration
  useEffect(() => {
    if (!elementRef) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const borderBoxSize = entry.borderBoxSize[0];
      const size = {
        width: borderBoxSize.inlineSize,
        height: borderBoxSize.blockSize,
      };

      if (!ignoreUpdate) {
        setElementSize(size);
        callback?.(size); // call callback if its supplied
      }
    });

    observer.observe(elementRef);
    return () => observer.disconnect();
  }, [elementRef, callback, ignoreUpdate]);

  return [setElementRef, elementSize, elementRef];
};

export default useResizeObserver;
