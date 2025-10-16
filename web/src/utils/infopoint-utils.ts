import { Position, Size } from "models";

// - - - - - -

/**
 * @param infopointPosition - The infopoint position stored in Redux for the given screen, provided by the `ImageBox` component.
 * @param imgBoxSize - The size dimensions of the selected image as it appears within the image box — used in the new version where `imageOrigData` stores these values.
 * @param imgNaturalSize - The natural size of the selected image inside image box — used in the old version where `imageOrigData` stores the natural size of the selected image.
 * @param imgViewSize - The current size of the view screen which is also displaying the image.
 */
export const calculateInfopointPosition = (
  infopointPosition: Position,
  imgBoxSize: Size,
  imgNaturalSize: Size,
  imgViewSize: Size
) => {
  if (isInfopointOutsideImageBox(infopointPosition, imgBoxSize)) {
    return calculateInfopointPositionByNaturalSize(
      infopointPosition,
      imgNaturalSize,
      imgViewSize
    );
  }

  return calculateInfopointPositionByImageBoxSize(
    infopointPosition,
    imgBoxSize,
    imgViewSize
  );
};

// - - - - - -

/**
 *
 */
export const isInfopointOutsideImageBox = (
  infopointPosition: Position,
  imgBoxSize: Size // NOTE: this is the same as 'imageOrigData' field
) => {
  const { left, top } = infopointPosition;
  const { width, height } = imgBoxSize;

  if (left < 0 || top < 0 || left > width || top > height) {
    return true;
  }

  return false;
};

// - - - - - -

/**
 * NEW VERSION
 *
 * In newer versions, the `imageOrigData` field stores the size dimension
 * of the selected image inside image box (container).
 *
 * Since the image box and its container has 450px x 350px, there values also represent
 * the maximum threshold for width and height respectively.
 */
export const calculateInfopointPositionByImageBoxSize = (
  infopointPosition: Position,
  imgBoxSize: Size,
  imgViewSize: Size
): Position => {
  const { left, top } = infopointPosition;
  const { width: boxWidth, height: boxHeight } = imgBoxSize; // NOTE: this is the same as 'imageOrigData' field
  const { width: viewWidth, height: viewHeight } = imgViewSize;

  //
  const origLeftPercentage = left / (boxWidth / 100);
  const origTopPercentage = top / (boxHeight / 100);

  //
  const newLeft = origLeftPercentage * (viewWidth / 100);
  const newTop = origTopPercentage * (viewHeight / 100);

  const newPosition: Position = { left: newLeft, top: newTop };
  return newPosition;
};

// - - - - - -

/**
 * OLD VERSION
 *
 * In older versions, the `imageOrigData` field has stored the natural size dimension
 * of the image which was selected to the image container. Thus storing natural
 * dimension of the selected image and not the size of the image container.
 *
 * Should be used when current infopoint's left and top positions are bigger than the
 * image's imageOrigData (because it stores data of natural size of the img). This is
 * to achieve backward compatibility
 */
const calculateInfopointPositionByNaturalSize = (
  infopointPosition: Position,
  imgNaturalSize: Size,
  imgViewSize: Size
): Position => {
  const { left, top } = infopointPosition;
  const { width: naturalWidth, height: naturalHeight } = imgNaturalSize;
  const { width: viewWidth, height: viewHeight } = imgViewSize;

  // e.g if infopoint is placed 250px from left and natural img size is 1000 px
  // then infopoint is in the 25% x position according to image
  const xPercentage = left / (naturalWidth / 100);
  const yPercentage = top / (naturalHeight / 100);

  // e.g if xPercentage is 25% and viewWidth is 400px -> show 100 px from left
  const newLeft = xPercentage * (viewWidth / 100);
  const newTop = yPercentage * (viewHeight / 100);

  const newPosition: Position = { left: newLeft, top: newTop };
  return newPosition;
};

// - - - - - -

/**
 * NOT USED
 *
 * Used only for old version, when imageOrigData has natural img width and height
 */
export const calculateInfopointPositionForImageBox = (
  infopointPosition: Position,
  imgNaturalSize: Size,
  imgBoxSize: Size
): Position => {
  const { left, top } = infopointPosition;
  const { width: naturalWidth, height: naturalHeight } = imgNaturalSize;
  const { width: boxWidth, height: boxHeight } = imgBoxSize;

  //
  const xPercentage = left / (naturalWidth / 100);
  const yPercentage = top / (naturalHeight / 100);

  //
  const newLeft = xPercentage * (boxWidth / 100);
  const newTop = yPercentage * (boxHeight / 100);

  const newPosition: Position = { left: newLeft, top: newTop };
  return newPosition;
};
