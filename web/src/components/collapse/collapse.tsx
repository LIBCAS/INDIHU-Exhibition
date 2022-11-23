import { FC, useEffect, useRef, useState } from "react";
import { animated, useSpring } from "react-spring";
import cx from "classnames";

interface Props {
  isOpen: boolean;
  allowScroll?: boolean;
}

export const Collapse: FC<Props> = ({
  isOpen,
  children,
  allowScroll = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [elementHeight, setElementHeight] = useState(0);
  const { height, opacity, y } = useSpring({
    height: isOpen ? elementHeight : 0,
    opacity: isOpen ? 1 : 0,
    y: isOpen ? 0 : 20,
    config: {
      duration: 250,
    },
  });

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new ResizeObserver((el) => {
      setElementHeight(el[0].contentRect.height);
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <animated.div
      className={cx(allowScroll ? "overflow-y-auto" : "overflow-y-hidden")}
      style={{
        height,
        opacity,
      }}
    >
      <animated.div style={{ y }}>
        <div ref={ref}>{children}</div>
      </animated.div>
    </animated.div>
  );
};
