import {
  GAME_DRAW_DEFAULT_COLOR,
  GAME_DRAW_DEFAULT_THICKNESS,
  GAME_DRAW_DEFAULT_IS_ERASING,
} from "constants/screen";

export const configureContext = (
  ctx: CanvasRenderingContext2D | null,
  color?: string,
  thickness?: number,
  isErasing?: boolean
) => {
  if (ctx === null) return;

  const erasing = isErasing ?? GAME_DRAW_DEFAULT_IS_ERASING;

  ctx.fillStyle = color ?? GAME_DRAW_DEFAULT_COLOR;
  ctx.strokeStyle = color ?? GAME_DRAW_DEFAULT_COLOR;
  ctx.lineWidth = thickness ?? GAME_DRAW_DEFAULT_THICKNESS;
  ctx.globalCompositeOperation = erasing ? "destination-out" : "source-over";
  ctx.lineCap = "round";
  return ctx;
};
