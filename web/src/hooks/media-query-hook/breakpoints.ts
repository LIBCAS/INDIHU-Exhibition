type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

/* https://tailwindcss.com/docs/responsive-design */
const getBreakpointSize = (breakpoint: Breakpoint) =>
  breakpoint === "xs"
    ? 0
    : breakpoint === "sm"
    ? 640
    : breakpoint === "md"
    ? 768
    : breakpoint === "lg"
    ? 1024
    : breakpoint === "xl"
    ? 1280
    : 1536;

const resolveBreakpoint = (up: boolean, breakpoint: Breakpoint) => {
  const widthPart = up ? "min-width" : "max-width";
  const px = getBreakpointSize(breakpoint);
  const pixelPart = up ? px : px - 1;
  return `(${widthPart}: ${pixelPart}px)`;
};

const up = (breakpoint: Breakpoint) => resolveBreakpoint(true, breakpoint);
const down = (breakpoint: Breakpoint) => resolveBreakpoint(false, breakpoint);

export const breakpoints = {
  up,
  down,
};
