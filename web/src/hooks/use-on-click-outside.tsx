import { RefObject } from "react";

import { useEventListener } from "./use-event-listener";

type Handler = (event: MouseEvent) => void;

export const useOnClickOutside = <T extends HTMLElement | null = HTMLElement>(
  ref: RefObject<T> | T,
  handler: Handler,
  mouseEvent: "mousedown" | "mouseup" = "mousedown"
): void => {
  useEventListener(mouseEvent, (event) => {
    if (!ref) return;

    const el = ref instanceof HTMLElement ? ref : ref.current;

    // Do nothing if clicking ref's element or descendent elements
    if (!el || el.contains(event.target as Node)) return;

    handler(event);
  });
};
