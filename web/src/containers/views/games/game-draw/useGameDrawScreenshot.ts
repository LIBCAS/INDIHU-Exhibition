import { useMemo, useCallback } from "react";

// Custom hook
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

// Utils
import { palette } from "palette";
import { downloadFile } from "utils";

// - - - - - -

type Props = {
  imageContainerEl: HTMLImageElement | null;
  canvasEl: HTMLCanvasElement | null;
  containedImageWidth: number;
  containedImageHeight: number;
  fromLeftWidth: number;
  fromTopHeight: number;
};

export const useGameDrawScreenshot = ({
  imageContainerEl,
  canvasEl,
  containedImageWidth,
  containedImageHeight,
  fromLeftWidth,
  fromTopHeight,
}: Props) => {
  const { expoDesignData } = useExpoDesignData();

  // - - - Derived variables - - -

  const backgroundColor = useMemo(
    () => expoDesignData?.backgroundColor ?? palette.background,
    [expoDesignData?.backgroundColor]
  );

  // - - - Callbacks - - -

  const handleTakeScreenshot = useCallback(
    async (applyBackgroundColor = true) => {
      if (imageContainerEl === null) {
        const errMsg = "[handleTakeScreenshot]: Underlying img is null";
        console.error(errMsg);
        return;
      }
      if (!imageContainerEl.src) {
        const errMsg = "[handleTakeScreenshot]: Underlying source is undefined";
        console.error(errMsg);
        return;
      }

      // Step 1: Define the layers for the screenshot
      const bgColor = backgroundColor;
      const underlyingImg = imageContainerEl;
      const userDrawing = canvasEl;

      // Step 2: Create the canvas for the screenshot
      const screenshotCanvas = document.createElement("canvas");
      screenshotCanvas.width = imageContainerEl.width;
      screenshotCanvas.height = imageContainerEl.height;
      const ctx = screenshotCanvas.getContext("2d");

      if (ctx === null) {
        const errMsg = "[handleTakeScreenshot]: Canvas ctx is null";
        console.error(errMsg);
        return;
      }

      // Step 3: Apply the first layer (background color)
      if (applyBackgroundColor) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, screenshotCanvas.width, screenshotCanvas.height);
      }

      // Step 4: Apply the second layer (underlying asssignment or result image)
      const image = new Image();
      image.src = underlyingImg.src;
      await image.decode();

      ctx.drawImage(
        image,
        0,
        0,
        underlyingImg.naturalWidth,
        underlyingImg.naturalHeight,
        fromLeftWidth,
        fromTopHeight,
        containedImageWidth,
        containedImageHeight
      );

      // Step 5: Apply the third and last layer (user's drawing on top, if any, optional)
      if (userDrawing) {
        ctx.drawImage(userDrawing, 0, 0);
      }

      // Step 6: Finally, output the final image as png
      const dataUrl = screenshotCanvas.toDataURL("image/png");
      downloadFile(dataUrl, "drawing.png");
    },
    [
      backgroundColor,
      imageContainerEl,
      canvasEl,
      fromLeftWidth,
      fromTopHeight,
      containedImageWidth,
      containedImageHeight,
    ]
  );

  return { handleTakeScreenshot };
};
