import {
  useState,
  useMemo,
  MutableRefObject,
  useEffect,
  useCallback,
} from "react";
import { calculatePositions } from "./calculate-positions";
import { useGlassMagnifierConfig } from "context/glass-magnifier-config-provider/glass-magnifier-config-provider";
import GlassMagnifier from "./GlassMagnifier";

type Position = {
  left: number;
  top: number;
};

export const useGlassMagnifier = (
  imageContainerRef: MutableRefObject<HTMLDivElement | null>,
  containedImgRef: MutableRefObject<HTMLImageElement | null>
) => {
  const { isGlassMagnifierEnabled, glassMagnifierPxSize } =
    useGlassMagnifierConfig();

  // Cursor position (left and top from image container)
  // Cursor is in the middle of the glass magnifier
  const [cursorPosition, setCursorPosition] = useState<Position>({
    left: 0,
    top: 0,
  });

  // Position (left and top) in the natural dimensions of contained img
  const [targetPosition, setTargetPosition] = useState<Position>({
    left: 0,
    top: 0,
  });

  const [containedImgSize, setContainedImgSize] = useState({
    width: 0,
    height: 0,
  });

  //
  const imageContainerEl = useMemo(
    () => imageContainerRef.current,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [imageContainerRef.current]
  );

  const containedImageEl = useMemo(
    () => containedImgRef.current,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [containedImgRef.current]
  );

  const containedImgSrc = useMemo(
    () => containedImageEl?.src,
    [containedImageEl]
  );

  // - -

  // ImageContainerOnMouseMoveHandler
  const imageContainerOnMouseMoveHandler = useCallback(
    (event: globalThis.MouseEvent) => {
      if (!isGlassMagnifierEnabled) {
        return;
      }
      if (!imageContainerEl || !containedImageEl || !containedImgSrc) {
        return;
      }

      const {
        containedImgSize,
        newContainerCursorPosition,
        newTargetPosition,
      } = calculatePositions(
        imageContainerEl,
        containedImageEl,
        event,
        glassMagnifierPxSize
      );

      setContainedImgSize(containedImgSize);
      setCursorPosition(newContainerCursorPosition);
      setTargetPosition(newTargetPosition);

      return;
    },
    [
      containedImageEl,
      containedImgSrc,
      glassMagnifierPxSize,
      imageContainerEl,
      isGlassMagnifierEnabled,
    ]
  );

  // Apply the required styles for the imageContainer
  useEffect(() => {
    if (!imageContainerEl) {
      return;
    }

    imageContainerEl.style.position = "relative";
    imageContainerEl.style.overflow = "hidden";
    imageContainerEl.style.cursor = isGlassMagnifierEnabled ? "none" : "auto";
  }, [imageContainerEl, isGlassMagnifierEnabled]);

  // Add the onMouseMove handler for the imageContainer
  useEffect(() => {
    if (!imageContainerEl) {
      return;
    }
    imageContainerEl.addEventListener(
      "mousemove",
      imageContainerOnMouseMoveHandler
    );

    return () => {
      imageContainerEl.removeEventListener(
        "mousemove",
        imageContainerOnMouseMoveHandler
      );
    };
  }, [imageContainerEl, imageContainerOnMouseMoveHandler]);

  // - -

  // Glass Magnifier component with current cursor positions
  // Adding this component into viewScreen will render "lens" at the current cursor position
  const CalculatedGlassMagnifier = () => {
    return (
      <GlassMagnifier
        cursorPosition={cursorPosition}
        targetPosition={targetPosition}
        containedImgSrc={containedImgSrc}
        containedImgSize={containedImgSize}
      />
    );
  };

  return {
    GlassMagnifier: CalculatedGlassMagnifier,
  };
};
