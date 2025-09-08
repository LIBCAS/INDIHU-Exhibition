// Types
import { CSSProperties } from "react";
import { TimelineType } from "models";
import { Size, Position } from "models";

// - - - - - -

/**
 *
 */
export const getDirVector = (
  timelineType: TimelineType,
  containerSize: Size
) => {
  // 1. Determine the direction vector, based on timeline type
  let dir = { x: 1, y: 0 }; // use horizontal as default

  if (timelineType === "HORIZONTAL") {
    dir = { x: 1, y: 0 };
  } else if (timelineType === "VERTICAL") {
    dir = { x: 0, y: 1 };
  } else if (timelineType === "DIAGONAL_TOP_TO_BOTTOM") {
    dir = { x: containerSize.width, y: containerSize.height };
  } else if (timelineType === "DIAGONAL_BOTTOM_TO_TOP") {
    dir = { x: containerSize.width, y: -containerSize.height };
  } else {
    throw Error("[getDirVector]: Unknown timeline type!");
  }

  // 2.
  // NOTE: RESULT = sqrt(pow(x, 2) + pow(y, 2))
  // Horizontal = sqrt(1 + 0) = 1
  // Vertical = sqrt(0 + 1) = 1
  // Diagonal top to bottom = sqrt(1 + 1) = sqrt(2) = ~1.414
  // Diagonal bottom to top = sqrt(1 + 1) = sqrt(2) = ~1.414
  const len = Math.hypot(dir.x, dir.y);

  // 3.
  return { x: dir.x / len, y: dir.y / len };
};

// - - - - - -

/**
 *
 */
export const calculateLineSizing = (
  timelineType: TimelineType,
  containerSize: Size,
  lineThickness: number // e.g. 2 (meaning 2px wide)
): Pick<CSSProperties, "width" | "height"> => {
  let width: string;
  let height: string;

  const thickness = `${lineThickness}px`;

  if (timelineType === "HORIZONTAL") {
    width = "100%";
    height = thickness;
  } else if (timelineType === "VERTICAL") {
    width = thickness;
    height = "100%";
  } else if (timelineType === "DIAGONAL_TOP_TO_BOTTOM") {
    // NOTE: Pythagoras c2 = a**2 + b**2
    const c = Math.hypot(containerSize.width, containerSize.height);
    width = `${c}px`;
    height = thickness;
  } else if (timelineType === "DIAGONAL_BOTTOM_TO_TOP") {
    // NOTE: Pythagoras c2 = a**2 + b**2
    const c = Math.hypot(containerSize.width, containerSize.height);
    width = `${c}px`;
    height = thickness;
  } else {
    throw Error("[calculateLineSizing]: Unknown timeline type!");
  }

  return { width, height };
};

// - - - - - -

/**
 *
 */
export const calculateLinePosition = (
  timelineType: TimelineType
): Pick<CSSProperties, "left" | "top"> => {
  let left: string;
  let top: string;

  if (timelineType === "HORIZONTAL") {
    left = "0";
    top = "50%";
  } else if (timelineType === "VERTICAL") {
    left = "50%";
    top = "0";
  } else if (timelineType === "DIAGONAL_TOP_TO_BOTTOM") {
    left = "50%";
    top = "50%";
  } else if (timelineType === "DIAGONAL_BOTTOM_TO_TOP") {
    left = "50%";
    top = "50%";
  } else {
    throw Error("[calculateLinePosition]: Unknown timeline type!");
  }

  return { left, top };
};

// - - - - - -

/**
 * NOTE: Transform only for diagonals
 */
export const calculateLineTransformation = (
  timelineType: TimelineType,
  containerSize: Size
): Pick<CSSProperties, "transformOrigin" | "transform"> => {
  const transformOrigin = "center";
  let transform = "none";

  if (
    timelineType === "DIAGONAL_TOP_TO_BOTTOM" ||
    timelineType === "DIAGONAL_BOTTOM_TO_TOP"
  ) {
    // Compute angle in degrees
    const width = containerSize.width;
    const height = containerSize.height;

    const angle = (Math.atan(height / width) * 180) / Math.PI;

    if (timelineType === "DIAGONAL_TOP_TO_BOTTOM") {
      transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    } else {
      transform = `translate(-50%, -50%) rotate(-${angle}deg)`;
    }
  }

  return { transform, transformOrigin };
};

// - - - - - -

/**
 *
 */
export const calculateItemInitialPosition = (
  containerSize: Size,
  itemSize: Size,
  index: number,
  timelineType: TimelineType
): Position => {
  const containerCenter = {
    x: containerSize.width / 2,
    y: containerSize.height / 2,
  };

  // Start in the center
  let left = containerCenter.x;
  let top = containerCenter.y;

  // Direction vector
  const dir = getDirVector(timelineType, containerSize);

  // Spacing between items
  const spacing = Math.max(itemSize.width, itemSize.height) * 1.25;

  // Offset from center based on index
  const offset = index * spacing;

  left += dir.x * offset;
  top += dir.y * offset;

  return { left, top };
};
