import { RefObject } from "react";

import { useEventListener } from "./use-event-listener";

type Handler = (event: MouseEvent) => void;

export const useOnClickOutside = <T extends HTMLElement | null = HTMLElement>(
  ref: RefObject<T> | T,
  handler: Handler,
  mouseEvent: "mousedown" | "mouseup" = "mousedown",
  ref2?: RefObject<T> | T
): void => {
  useEventListener(mouseEvent, (event) => {
    if (!ref) return;

    const el = ref instanceof HTMLElement ? ref : ref.current;

    // Do nothing if clicking ref's element or descendent elements
    if (!el || el.contains(event.target as Node)) return;

    // Do nothing if ref2 is defined and clicking ref2's element ord descendent elements
    if (ref2) {
      const el2 = ref2 instanceof HTMLElement ? ref2 : ref2.current;
      if (!el2 || el2.contains(event.target as Node)) return;
    }

    handler(event);
  });
};
