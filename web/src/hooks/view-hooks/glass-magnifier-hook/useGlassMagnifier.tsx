import { useState, useMemo, useEffect, useCallback } from "react";
import { useGlassMagnifierConfig } from "context/glass-magnifier-config-provider/glass-magnifier-config-provider";

import GlassMagnifier from "./GlassMagnifier";

import { Position, Size } from "models";
import { calculatePositions } from "./calculate-positions";

type PositionsInfoObj = {
  containedImgSize: Size;
  cursorPosition: Position;
  targetPosition: Position;
};

export const useGlassMagnifier = (
  imageContainerEl: HTMLDivElement | null,
  containedImageEl: HTMLImageElement | null
) => {
  const { isGlassMagnifierEnabled, glassMagnifierPxSize } =
    useGlassMagnifierConfig();

  const containedImgSrc = useMemo(
    () => containedImageEl?.src,
    [containedImageEl]
  );

  const [positionsInfo, setPositionsInfo] = useState<PositionsInfoObj>({
    // Size of the contained image
    containedImgSize: { width: 0, height: 0 },

    // Current position of the cursor relative to the image container (e.g. whole screen)
    // Cursor is located in the middle of the glass magnifier and is not visible when glass magnifier is enabled
    cursorPosition: { left: 0, top: 0 },

    // Represents current position of the left-top corner of the lens -> relative to the natural dimensions of contained img
    targetPosition: { left: 0, top: 0 },
  });

  // - - - - - - - - - - - -
  // Event Handlers
  // - - - - - - - - - - - -

  const imageContainerOnMouseMoveHandler = useCallback(
    (event: globalThis.MouseEvent | globalThis.TouchEvent) => {
      if (!isGlassMagnifierEnabled) {
        return;
      }

      if (!imageContainerEl || !containedImageEl || !containedImgSrc) {
        return;
      }

      const newPositionsInfo = calculatePositions(
        imageContainerEl,
        containedImageEl,
        event,
        glassMagnifierPxSize
      );

      setPositionsInfo(newPositionsInfo);
    },
    [
      containedImageEl,
      containedImgSrc,
      glassMagnifierPxSize,
      imageContainerEl,
      isGlassMagnifierEnabled,
    ]
  );

  // Handler responsible for disabling the default browser behavior, e.g. saving image pop-up when long touch
  /*
  const imageContainerOnTouchStart = useCallback(
    (e: TouchEvent) => {
      if (isGlassMagnifierEnabled) {
        e.preventDefault();
      }
    },
    [isGlassMagnifierEnabled]
  );
  */

  // - - - - - - - - - - - -
  // Effects
  // - - - - - - - - - - - -

  // Effect responsible for registration/unregistration of event handlers for imageContainer element
  useEffect(() => {
    if (!imageContainerEl) {
      return;
    }
    imageContainerEl.addEventListener(
      "mousemove",
      imageContainerOnMouseMoveHandler
    );

    imageContainerEl.addEventListener(
      "touchmove",
      imageContainerOnMouseMoveHandler
    );

    // imageContainerEl.addEventListener(
    //   "touchstart",
    //   imageContainerOnTouchStart
    // );

    return () => {
      imageContainerEl.removeEventListener(
        "mousemove",
        imageContainerOnMouseMoveHandler
      );

      imageContainerEl.removeEventListener(
        "touchmove",
        imageContainerOnMouseMoveHandler
      );

      // imageContainerEl.removeEventListener(
      //   "touchstart",
      //   imageContainerOnTouchStart
      // );
    };
  }, [imageContainerEl, imageContainerOnMouseMoveHandler]);

  // Effect responsible for applying all necessary styles for the imageContainer element
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

  // - - - - - - - - - - - -
  // Prepared GlassMagnifier component
  // - adding this component into viewScreen will render "glass magnifier lens" at the current cursor position
  // - - - - - - - - - - - -

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
        containedImgSrc={containedImgSrc}
        containedImgSize={positionsInfo.containedImgSize}
        cursorPosition={positionsInfo.cursorPosition}
        targetPosition={positionsInfo.targetPosition}
        lensContainerStyle={lensContainerStyle}
        lensStyle={lensStyle}
      />
    );
  };

  return {
    GlassMagnifier: CalculatedGlassMagnifier,
  };
};
