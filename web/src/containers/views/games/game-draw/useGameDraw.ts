import {
  useState,
  useEffect,
  useCallback,
  MutableRefObject,
  MouseEvent,
} from "react";

// Types
import { Position, Size } from "models";

// Utils
import { configureContext } from "./configureContext";

// - - - - - -

type Props = {
  containerSize: Size;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  isGameFinished: boolean;
  color: string;
  thickness: number;
  transparency: number;
  isErasing: boolean;
};

/**
 * NOTE: canvasRef should never be null, because useEffect runs after all components are painted to DOM
 */
export const useGameDraw = ({
  containerSize,
  canvasRef,
  isGameFinished,
  color,
  thickness,
  transparency,
  isErasing,
}: Props) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<Position | null>(null); // setting always, even when the pen or erase is not down

  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  const [shouldReconfigureCtx, setShouldReconfigureCtx] =
    useState<boolean>(false);

  // - - - Callbacks - - -

  /**
   *
   */
  const initializeCanvas = useCallback(() => {
    if (canvasRef.current === null) {
      return;
    }

    if (containerSize.width === 0 || containerSize.height === 0) {
      return;
    }

    // Step 1
    canvasRef.current.width = containerSize.width;
    canvasRef.current.height = containerSize.height;

    // Step 2
    const context = canvasRef.current.getContext("2d");
    setCtx(context);

    // Step 3
    setShouldReconfigureCtx((prev) => !prev);
  }, [canvasRef, containerSize.width, containerSize.height]);

  /**
   *
   */
  const startDrawing = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
    setMousePosition({ left: e.clientX, top: e.clientY });
    setIsDrawing(true);
  }, []);

  /**
   *
   */
  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  /**
   *
   */
  const draw = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      if (ctx === null) return;
      if (!isDrawing || isGameFinished) return;
      if (!mousePosition) return;

      ctx.beginPath();
      ctx.moveTo(mousePosition.left, mousePosition.top);
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();

      setMousePosition({ left: e.clientX, top: e.clientY });
    },
    [ctx, isDrawing, isGameFinished, mousePosition]
  );

  /**
   *
   */
  const clearCanvas = useCallback(() => {
    if (canvasRef.current === null) return;
    if (ctx === null) return;

    ctx.clearRect(
      0,
      0,
      canvasRef.current.width ?? 0,
      canvasRef.current.height ?? 0
    );
  }, [canvasRef, ctx]);

  // - - - Effects - - -

  /**
   *
   */
  useEffect(() => {
    initializeCanvas();
  }, [initializeCanvas]);

  /**
   *
   */
  useEffect(() => {
    window.addEventListener("resize", initializeCanvas);
    return () => window.removeEventListener("resize", initializeCanvas);
  }, [initializeCanvas]);

  /**
   *
   */
  useEffect(() => {
    configureContext(ctx, color, thickness, transparency, isErasing);
  }, [ctx, color, thickness, transparency, isErasing, shouldReconfigureCtx]);

  // - - - Return Value - - -

  return { startDrawing, stopDrawing, draw, clearCanvas };
};
