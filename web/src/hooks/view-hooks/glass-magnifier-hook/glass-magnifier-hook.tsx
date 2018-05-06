import { useState, useMemo, useEffect, useCallback } from "react";
import { calculatePositions } from "./calculate-positions";
import { useGlassMagnifierConfig } from "context/glass-magnifier-config-provider/glass-magnifier-config-provider";
import GlassMagnifier from "./GlassMagnifier";

import { Position } from "models";

export const useGlassMagnifier = (
  imageContainerEl: HTMLDivElement | null,
  containedImageEl: HTMLImageElement | null
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

  const containedImgSrc = useMemo(
    () => containedImageEl?.src,
    [containedImageEl]
  );

  // - -

  // ImageContainerOnMouseMoveHandler
  const imgContainerMouseMoveHandler = useCallback(
    (event: globalThis.MouseEvent | globalThis.TouchEvent) => {
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
    imageContainerEl.style.touchAction = isGlassMagnifierEnabled
      ? "none" // disable default browser touch actions such as scrolling, zooming, ...
      : "auto";
  }, [imageContainerEl, isGlassMagnifierEnabled]);

  // Add the onMouseMove and touchStart handler for the imageContainer
  useEffect(() => {
    if (!imageContainerEl) {
      return;
    }

    imageContainerEl.addEventListener(
      "mousemove",
      imgContainerMouseMoveHandler
    );

    imageContainerEl.addEventListener(
      "touchmove",
      imgContainerMouseMoveHandler
    );

    return () => {
      imageContainerEl.removeEventListener(
        "mousemove",
        imgContainerMouseMoveHandler
      );

      imageContainerEl.removeEventListener(
        "touchmove",
        imgContainerMouseMoveHandler
      );
    };
  }, [imageContainerEl, imgContainerMouseMoveHandler]);

  // - -

  // Glass Magnifier component with current cursor positions
  // Adding this component into viewScreen will render "lens" at the current cursor position
  type CalculatedGlassMagnifierProps = {
    lensContainerStyle?: React.CSSProperties;
    lensStyle?: React.CSSProperties;
  };

  const CalculatedGlassMagnifier = ({
    lensContainerStyle,
    lensStyle,
  }: CalculatedGlassMagnifierProps) => {
    return (
      <GlassMagnifier
        cursorPosition={cursorPosition}
        targetPosition={targetPosition}
        containedImgSrc={containedImgSrc}
        containedImgSize={containedImgSize}
        lensContainerStyle={lensContainerStyle}
        lensStyle={lensStyle}
      />
    );
  };

  return {
    GlassMagnifier: CalculatedGlassMagnifier,
  };
};
