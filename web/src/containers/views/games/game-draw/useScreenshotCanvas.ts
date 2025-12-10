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

export const useScreenshotCanvas = ({
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
      if (imageContainerEl === null) return;
      if (canvasEl === null) return;

      // Define the layers for the screenshot
      const bgColor = backgroundColor;
      const assignmentImg = imageContainerEl;
      const userDrawing = canvasEl;

      // Create the canvas for the screenshot
      const screenshotCanvas = document.createElement("canvas");

      screenshotCanvas.width = userDrawing.width;
      screenshotCanvas.height = userDrawing.height;

      const ctx = screenshotCanvas.getContext("2d");

      if (ctx === null) {
        const errMsg = "[handleTakeAccurateScreenshot]: Canvas ctx is null";
        console.error(errMsg);
        return;
      }

      // Apply the first layer (background color)
      if (applyBackgroundColor) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, screenshotCanvas.width, screenshotCanvas.height);
      }

      // Apply the second layer (underlying asssignment image)
      const image = new Image();
      image.src = assignmentImg.src;
      await image.decode();

      ctx.drawImage(
        image,
        0,
        0,
        assignmentImg.naturalWidth,
        assignmentImg.naturalHeight,
        fromLeftWidth,
        fromTopHeight,
        containedImageWidth,
        containedImageHeight
      );

      // Apply the third and last layer (user's drawing on top)
      ctx.drawImage(userDrawing, 0, 0);

      // Finally, output the final image as png
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
