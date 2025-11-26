import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  MouseEvent,
  MutableRefObject,
} from "react";

// Types
import { ImageOrigData, Size, Position } from "models";

// Utils
import { calculateObjectFit } from "utils/object-fit";

// - - - - - -

const LINE_WIDTH = 40;

// - - - - - -

type Props = {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  containerSize: Size;
  upperImageOrigData: ImageOrigData;
  upperImageSrc: string | undefined;
  shouldErase: boolean;
  backgroundColor: string;
};

export const useGameErase = ({
  canvasRef,
  containerSize,
  upperImageOrigData,
  upperImageSrc,
  shouldErase,
  backgroundColor,
}: Props) => {
  // - - - States - - -

  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  // NOTE: This state represents the current mouse position of the cursor
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // - - - Derived variables - - -

  const {
    width: containedImage1Width,
    height: containedImage1Height,
    left: fromLeft,
    top: fromTop,
  } = useMemo(
    () =>
      calculateObjectFit({
        parent: containerSize,
        child: upperImageOrigData,
      }),
    [containerSize, upperImageOrigData]
  );

  // - - - Callbacks - - -

  /**
   * FILL CANVAS
   *
   * Fill the canvas with the upper image which is going to be erased
   */
  const fillCanvas = useCallback(() => {
    if (!canvasRef.current || !ctx) {
      return;
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    const imageElement = document.createElement("img");
    imageElement.src = upperImageSrc ?? "";
    imageElement.onload = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(
        imageElement,
        fromLeft,
        fromTop,
        containedImage1Width,
        containedImage1Height
      );
      ctx.globalCompositeOperation = "destination-out";
    };
  }, [
    canvasRef,
    ctx,
    upperImageSrc,
    containedImage1Width,
    containedImage1Height,
    fromLeft,
    fromTop,
  ]);

  /**
   * CLEAR CANVAS
   */
  const clearCanvas = useCallback(() => {
    if (!ctx || !canvasRef.current) {
      return;
    }

    ctx.globalCompositeOperation = "destination-out";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, [canvasRef, ctx]);

  /**
   * RESIZE CANVAS
   */
  const resizeCanvas = useCallback(() => {
    if (!canvasRef.current) {
      return;
    }

    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
    setCtx(canvasRef.current.getContext("2d"));
  }, [canvasRef]);

  /**
   * UPDATE MOUSE POSITION
   */
  const updateMousePosition = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    },
    []
  );

  /**
   * ERASE
   */
  const erase = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      if (!ctx || e.buttons !== 1 || !shouldErase) {
        //setMousePosition({ x: e.clientX, y: e.clientY });
        return;
      }

      ctx.beginPath();
      ctx.moveTo(mousePosition.x, mousePosition.y);
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();

      setMousePosition({ x: e.clientX, y: e.clientY });
    },
    [ctx, shouldErase, mousePosition.x, mousePosition.y]
  );

  /**
   *
   */
  const isInfopointErased = useCallback(
    (infopointInfo: Size & Position, thresholdRatio = 0.5) => {
      if (!ctx || !canvasRef.current) {
        return false;
      }

      const width = infopointInfo.width;
      const height = infopointInfo.height;

      // NOTE: We need to subtract because infopoints are translate -50% -50%
      // in order that their position refers to their center and top top left corner
      const x = infopointInfo.left - width / 2;
      const y = infopointInfo.top - height / 2;

      // Read pixel data
      const imageData = ctx.getImageData(x, y, width, height);
      const pixels = imageData.data;

      // Pixel is erased -> its alpha channel is 0 -> its completely transparent
      // One pixel - RGBA, so each pixel has 4 places in the array
      // Algorithm should return true if number of pixels considered as erased is higher than provided threshold
      let erasedPixels = 0;
      const totalPixels = pixels.length / 4; // each pixel has RGBA

      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) {
          erasedPixels++;
        }
      }

      const erasedRatio = erasedPixels / totalPixels;
      const isConsideredErased = erasedRatio >= thresholdRatio;
      return isConsideredErased;
    },
    [ctx, canvasRef]
  );

  // - - - Effects - - -

  /**
   *
   */
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
    setCtx(canvasRef.current.getContext("2d"));
  }, [canvasRef]);

  /**
   *
   */
  useEffect(() => {
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  /**
   *
   */
  useEffect(() => {
    if (!ctx) {
      return;
    }

    ctx.fillStyle = backgroundColor;
    fillCanvas();
    ctx.lineWidth = LINE_WIDTH;
    ctx.lineCap = "round";
  }, [ctx, backgroundColor, fillCanvas]);

  // - - - Return Value - - -

  return {
    fillCanvas,
    clearCanvas,
    updateMousePosition,
    erase,
    isInfopointErased,
  };
};
