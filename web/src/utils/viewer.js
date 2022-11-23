export const getObjectFitSize = (
  contains,
  containerWidth,
  containerHeight,
  width,
  height
) => {
  var doRatio = width / height;
  var cRatio = containerWidth / containerHeight;
  var targetWidth = 0;
  var targetHeight = 0;
  var test = contains ? doRatio > cRatio : doRatio < cRatio;

  if (test) {
    targetWidth = containerWidth;
    targetHeight = targetWidth / doRatio;
  } else {
    targetHeight = containerHeight;
    targetWidth = targetHeight * doRatio;
  }

  return {
    width: targetWidth,
    height: targetHeight,
    x: (containerWidth - targetWidth) / 2,
    y: (containerHeight - targetHeight) / 2,
  };
};

export const getImageData = (
  containerWidth,
  containerHeight,
  elementWidth,
  elementHeight,
  realElementWidth,
  realElementHeight
) => {
  let left;
  let top;
  let ratio;

  if (
    Math.abs(containerWidth - realElementWidth) <
    Math.abs(containerHeight - realElementHeight)
  ) {
    const heightRatio = elementHeight / realElementHeight;

    left = 0;
    top = (containerHeight - realElementHeight) / 2;
    ratio = heightRatio;
  } else {
    const widthRatio = elementWidth / realElementWidth;

    top = 0;
    left = (containerWidth - realElementWidth) / 2;
    ratio = widthRatio;
  }

  return { left, top, ratio };
};
