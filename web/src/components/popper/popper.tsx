import { useState, ReactNode, useEffect } from "react";

// Custom hooks
import { useOnClickOutside } from "hooks/use-on-click-outside";

// Utils
import cx from "classnames";

// Popper
import { usePopper } from "react-popper";
import { Options } from "@popperjs/core";
import classes from "./popper.module.scss";

// - - - - - - - -

export const Popper = <TAnchor extends HTMLElement | null>({
  anchor,
  arrow = false,
  children,
  placement,
  open = false,
  onClickOutside,
  rebuildListener,
  rebuildListener2,
}: {
  anchor: TAnchor;
  arrow?: boolean;
  placement?: Options["placement"];
  children: ReactNode;
  open?: boolean;
  onClickOutside?: () => void;
  rebuildListener?: any;
  rebuildListener2?: any;
}) => {
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes, update } = usePopper(anchor, popperElement, {
    modifiers: [
      { name: "arrow", options: { element: arrowElement } },
      { name: "offset", options: { offset: [0, 8] } },
    ],
    placement,
  });

  useOnClickOutside(popperElement, (e) => {
    if (anchor?.contains(e.target as Node)) return;

    onClickOutside?.();
  });

  useEffect(() => {
    if (update) {
      update();
    }
  }, [rebuildListener, rebuildListener2, update]);

  if (!open) return null;

  return (
    <div
      ref={setPopperElement}
      className={cx("bg-white p-2 shadow-md z-50 max-w-md", classes.popper)}
      style={styles.popper}
      {...attributes.popper}
    >
      {children}
      {arrow && (
        <div
          ref={setArrowElement}
          className={cx("w-2 h-2 bg-inherit invisible absolute", classes.arrow)}
          style={styles.arrow}
        >
          <div className="w-2 h-2 visible bg-inherit absolute rotate-45" />
        </div>
      )}
    </div>
  );
};
