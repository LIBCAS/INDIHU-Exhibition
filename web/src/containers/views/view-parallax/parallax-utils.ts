import { SpringValue } from "react-spring";

const PARALLAX_DEPTH_EXPONENT = 1.5;

// - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - HELPERS - - - - - - - -
// - - - - - - - - - - - - - - - - - - - -

const determineLayerDepth = (imgIdx: number, totalImages: number) => {
  // NOTE: For first background image which does not move at all
  if (imgIdx === 0) {
    return 0;
  }

  // Example: 4 images where first one is background and three layers
  // norm = [0, 0.33, 0.66, 1]
  // depth = [0, 0.192, 0.545, 1]
  // So the background stays still, the middle layers move gradually, and
  // the front-most layers moves the most. If you want even more emphasis
  // on the front layers, you can increase the exponent.
  const norm = imgIdx / (totalImages - 1);
  const depth = Math.pow(norm, PARALLAX_DEPTH_EXPONENT);
  return depth;
};

// - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - MAIN LOGIC - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - -

/**
 * Newer version of algorithm, used since version v2.6.0
 */
export const calculateParallaxOffset = (
  offset: SpringValue<number>,
  preloadedImgIdx: number,
  totalImages: number,
  totalDistance: number,
  animationScale: number
) => {
  const depth = determineLayerDepth(preloadedImgIdx, totalImages);
  const translateOffset = offset.to(
    (value) => value * totalDistance * depth * animationScale
  );

  return translateOffset;
};

// - - - - - -

/**
 * Old version of algorithm which was used before version v2.6.0
 */
export const calculateParallaxOffsetOld = (
  offset: SpringValue<number>,
  preloadedImgIdx: number,
  totalImages: number,
  totalDistance: number,
  animationScale: number
) => {
  const translateOffset = offset.to(
    (value) =>
      ((value * totalDistance) / totalImages) *
      (preloadedImgIdx + 1) *
      animationScale
  );

  return translateOffset;
};
