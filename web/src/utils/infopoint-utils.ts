import { Position, Size } from "models";

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

export const isInfopointOutsideImageBox = (
  infopointPosition: Position,
  imgBoxSize: Size // it is imageOrigData
) => {
  const { left, top } = infopointPosition;
  const { width, height } = imgBoxSize;

  if (left < 0 || top < 0 || left > width || top > height) {
    return true;
  }

  return false;
};

/**
 * NEW VERSION
 * When imageOrigData stores the dimension of the image in the image box component (450 x 350px)
 */
export const calculateInfopointPositionByImageBoxSize = (
  infopointPosition: Position,
  imgBoxSize: Size,
  imgViewSize: Size
): Position => {
  const { left, top } = infopointPosition;
  const { width: boxWidth, height: boxHeight } = imgBoxSize; // imageOrigData
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

/**
 * OLD VERSION
 * When imageOrigData attribute was set to natural size of the image in the image box
 *
 * Should be used when current infopoint's left and top positions are bigger than the
 * image's imageOrigData (because it stores data of natural size of the img)
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

// - -

// Used only for old version, when imageOrigData has natural img width and height
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
