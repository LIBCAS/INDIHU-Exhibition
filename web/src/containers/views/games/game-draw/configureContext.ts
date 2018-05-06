import {
  DEFAULT_COLOR,
  DEFAULT_THICKNESS,
  DEFAULT_IS_ERASING,
} from "./game-draw";

export const configureContext = (
  ctx: CanvasRenderingContext2D | null,
  color?: string,
  thickness?: number,
  isErasing?: boolean
) => {
  if (ctx === null) return;

  const erasing = isErasing ?? DEFAULT_IS_ERASING;

  ctx.fillStyle = color ?? DEFAULT_COLOR;
  ctx.strokeStyle = color ?? DEFAULT_COLOR;
  ctx.lineWidth = thickness ?? DEFAULT_THICKNESS;
  ctx.globalCompositeOperation = erasing ? "destination-out" : "source-over";
  ctx.lineCap = "round";
  return ctx;
};
