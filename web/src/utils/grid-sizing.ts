type TGridBreakpoint = "xs" | "sm" | "md" | "lg" | "xl";

const calculateGridItemSize = (
  breakpoint: TGridBreakpoint,
  numberOfItems: number
): number => {
  switch (breakpoint) {
    case "xs":
      return 12;
    case "sm":
      return 12;
    case "md":
      return 6;
    case "lg":
      return 6;
    case "xl": {
      if (numberOfItems <= 3) {
        return 4;
      }
      const modulo = numberOfItems % 3;
      const sizing = modulo === 1 ? 6 : 4;
      return sizing;
    }
  }
};

/**
 * Returns responsive MUI Grid item sizes based on the total number of items.
 *
 * At the `xl` breakpoint, the item size changes dynamically to improve
 * the distribution of items across rows.
 */
export const getResponsiveGridItemProps = (numberOfItems: number) => ({
  xs: calculateGridItemSize("xs", numberOfItems),
  sm: calculateGridItemSize("sm", numberOfItems),
  md: calculateGridItemSize("md", numberOfItems),
  lg: calculateGridItemSize("lg", numberOfItems),
  xl: calculateGridItemSize("xl", numberOfItems),
});
