type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const getBreakpointSize = (breakpoint: Breakpoint) =>
  breakpoint === "xs"
    ? 0
    : breakpoint === "sm"
    ? 640
    : breakpoint === "md"
    ? 767
    : breakpoint === "lg"
    ? 1024
    : breakpoint === "xl"
    ? 1280
    : 1536;

const resolveBreakpoint = (up: boolean, breakpoint: Breakpoint) =>
  `(${up ? "min" : "max"}-width: ${getBreakpointSize(breakpoint)}px)`;

const up = (breakpoint: Breakpoint) => resolveBreakpoint(true, breakpoint);
const down = (breakpoint: Breakpoint) => resolveBreakpoint(false, breakpoint);

export const breakpoints = {
  up,
  down,
};
