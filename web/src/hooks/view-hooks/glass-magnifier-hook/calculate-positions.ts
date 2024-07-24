import { calculateObjectFit } from "utils/object-fit";

export const calculatePositions = (
  imageContainerEl: HTMLDivElement,
  containedImgEl: HTMLImageElement,
  mouseMoveEvent: globalThis.MouseEvent | globalThis.TouchEvent,
  glassMagnifierPxSize: number
) => {
  // 1. imageContainerElSize - retrieve the size of the image container div element
  const imageContainerElSize = {
    width: imageContainerEl.clientWidth,
    height: imageContainerEl.clientHeight,
  };

  // - -

  // 2. imageContainerRect - x, y, left, top, right, bottom position of this image container element rectangle
  // also contains width and height of imageContainerEl
  const imageContainerRect = imageContainerEl.getBoundingClientRect();

  // - -

  // 3. Get the Natural dimensions of our contained image
  const containedImgNaturalSize = {
    width: containedImgEl.naturalWidth,
    height: containedImgEl.naturalHeight,
  };

  // - -

  // 4. based on child's original (natural) size AND image container where the image is being contained
  // we will calculate the width and height of the contained image + half of the available spaces from top and left
  // child's original (natural) size is used mainly for its aspect ratio
  const {
    width: containedImgWidth,
    height: containedImgHeight,
    left: containedImgLeft,
    top: containedImgTop,
  } = calculateObjectFit({
    parent: imageContainerElSize,
    child: containedImgNaturalSize,
    type: "contain",
  });

  const containedImgSize = {
    width: containedImgWidth,
    height: containedImgHeight,
  };

  const containedImgOffset = {
    left: containedImgLeft,
    top: containedImgTop,
  };

  // - - - - -
  // - - - - -

  // 5. Container Cursor position - calculate the px left and top position of cursor from the image container
  // (set as the cursor is in the middle of glass magnifier)
  let newContainerCursorPositionX = 0;
  let newContainerCursorPositionY = 0;

  if ("changedTouches" in mouseMoveEvent) {
    const touchClientX = mouseMoveEvent.changedTouches.item(0)?.clientX;
    const touchClientY = mouseMoveEvent.changedTouches.item(0)?.clientY;
    newContainerCursorPositionX = touchClientX
      ? touchClientX - imageContainerRect.left
      : 0;
    newContainerCursorPositionY = touchClientY
      ? touchClientY - imageContainerRect.top
      : 0;
  } else {
    newContainerCursorPositionX =
      mouseMoveEvent.clientX - imageContainerRect.left;
    newContainerCursorPositionY =
      mouseMoveEvent.clientY - imageContainerRect.top;
  }

  const newContainerCursorPosition = {
    left: newContainerCursorPositionX,
    top: newContainerCursorPositionY,
  };

  // - -

  // 6. Img Cursor position
  // Calculate the top and left position of pixels, not from image container, but from contained img itself
  const newImgCursorPositionX =
    newContainerCursorPosition.left - containedImgOffset.left;
  const newImgCursorPositionY =
    newContainerCursorPosition.top - containedImgOffset.top;

  const newImgCursorPosition = {
    left: newImgCursorPositionX,
    top: newImgCursorPositionY,
  };

  // - -

  // 7. TopLeftCorner position from (based on) contained img
  // I dont want the position (top left in px) from the cursor which is in the middle of the square lens.. i want the position of top left corner of this square
  const newImgCornerCursorPositionX =
    newImgCursorPosition.left - glassMagnifierPxSize / 2;
  const newImgCornerCursorPositionY =
    newImgCursorPosition.top - glassMagnifierPxSize / 2;

  const newImgCornerCursorPosition = {
    left: newImgCornerCursorPositionX,
    top: newImgCornerCursorPositionY,
  };

  // - -

  // 8. TopLeftCorner % position from contained img
  // The same like previous, but value not in pixels (like 100px left but in percent)
  const newImgCornerPercentCursorPositionX =
    newImgCornerCursorPosition.left / (containedImgSize.width / 100);
  const newImgCornerPercentCursorPositionY =
    newImgCornerCursorPosition.top / (containedImgSize.height / 100);

  const newImgCornerPercentCursorPosition = {
    left: newImgCornerPercentCursorPositionX,
    top: newImgCornerPercentCursorPositionY,
  };

  // - -

  // 9. Position coordinates (left, top) which should be taken from the natural image dimension
  const newTargetPositionX =
    newImgCornerPercentCursorPosition.left * (containedImgSize.width / 100);

  const newTargetPositionY =
    newImgCornerPercentCursorPosition.top * (containedImgSize.height / 100);

  const newTargetPosition = {
    left: newTargetPositionX,
    top: newTargetPositionY,
  };

  return {
    containedImgSize,
    cursorPosition: newContainerCursorPosition,
    targetPosition: newTargetPosition,
  };
};
