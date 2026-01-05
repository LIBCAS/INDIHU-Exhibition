import {
  GAME_DRAW_DEFAULT_COLOR,
  GAME_DRAW_DEFAULT_THICKNESS,
  GAME_DRAW_DEFAULT_IS_ERASING,
  GAME_DRAW_DEFAULT_TRANSPARENCY,
} from "constants/screen";

export const configureContext = (
  ctx: CanvasRenderingContext2D | null,
  color?: string,
  thickness?: number,
  transparency?: number,
  isErasing?: boolean
) => {
  if (ctx === null) {
    return;
  }

  // Global Composite Operation
  const erasing = isErasing ?? GAME_DRAW_DEFAULT_IS_ERASING;
  ctx.globalCompositeOperation = erasing ? "destination-out" : "source-over";

  // Coloring
  const colorValue = color ?? GAME_DRAW_DEFAULT_COLOR;
  ctx.fillStyle = colorValue;
  ctx.strokeStyle = colorValue;

  // Thickness
  const thicknessValue = thickness ?? GAME_DRAW_DEFAULT_THICKNESS;
  ctx.lineWidth = thicknessValue;

  // Transparency
  const transparencyVal = transparency ?? GAME_DRAW_DEFAULT_TRANSPARENCY;
  const transparencyValue = transparencyVal / 100;
  ctx.globalAlpha = transparencyValue;

  // Line cap
  ctx.lineCap = "round";

  return ctx;
};
