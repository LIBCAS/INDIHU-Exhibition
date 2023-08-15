import { RefObject, useEffect, useRef } from "react";

type Options<K extends HTMLElement> = {
  shouldAttach?: boolean;
  beforeAttach?: (node: K) => void;
};

export const useAttachElement = <T extends HTMLElement, K extends HTMLElement>(
  ref: RefObject<T>,
  node: K | undefined,
  options?: Options<K>
) => {
  const { shouldAttach = true } = options ?? {};
  const handler = useRef(options?.beforeAttach);

  useEffect(() => {
    if (!node || !ref.current || !shouldAttach) {
      return;
    }

    handler.current?.(node);

    ref.current.appendChild(node);
  }, [node, ref, shouldAttach]);
};
