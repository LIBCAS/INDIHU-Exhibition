import {
  useState,
  useEffect,
  useCallback,
  MutableRefObject,
  MouseEvent,
} from "react";

// Types
import { Position } from "models";

// Utils
import { configureContext } from "./configureContext";

// - - - - - -

type Props = {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  isGameFinished: boolean;
  color: string;
  thickness: number;
  isErasing: boolean;
};

/**
 * NOTE: canvasRef should never be null, because useEffect runs after all components are painted to DOM
 */
export const useGameDraw = ({
  canvasRef,
  isGameFinished,
  color,
  thickness,
  isErasing,
}: Props) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<Position | null>(null); // setting always, even when the pen or erase is not down

  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  // - - - Callbacks - - -

  /**
   *
   */
  const resizeCanvas = useCallback(() => {
    if (canvasRef.current === null) return;

    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx]);

  // - - - Effects - - -

  /**
   *
   */
  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;

    const context = canvasRef.current.getContext("2d");
    setCtx(context);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    configureContext(ctx, color, thickness, isErasing);
  }, [
    ctx,
    color,
    thickness,
    isErasing,
    canvasRef.current?.width,
    canvasRef.current?.height,
  ]);

  // - - - Return Value - - -

  return { startDrawing, stopDrawing, draw, clearCanvas };
};
