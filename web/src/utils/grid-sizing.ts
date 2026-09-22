type TGridBreakpoint = "xs" | "sm" | "md" | "lg" | "xl";

const improveGridItemSizing = (sizing: number, numberOfItems: number) => {
  if (sizing === 4) {
    // NOTE: This sizing means, that we have 3 items in a single row
    // Keep 1,2,3 items in a one single row
    // Fix 4,7,10,13,16, ... items by using only two items in a single row
    // Keep 5,6, 8,9, 11,12, 14,15, ... as three items in a single row
    if (numberOfItems <= 3) {
      return 4;
    }
    const modulo = numberOfItems % 3;
    const newSizing = modulo === 1 ? 6 : 4;
    return newSizing;
  }

  if (sizing === 3) {
    // NOTE: This sizing means, that we have 4 items in a single row
    // Keep 1,2,3,4 items in a one single row
    // Fix 5,9,13,17, ... items by using three items in a single row
    // Keep 6,7,8, 10,11,12, 14,15,16, ... as four items in a single row
    if (numberOfItems <= 4) {
      return 3;
    }

    const modulo = numberOfItems % 4;
    const newSizing = modulo === 1 ? 4 : 3;
    return newSizing;
  }

  // All other types of sizing
  return sizing;
};

const calculateGridItemSize = (
  breakpoint: TGridBreakpoint,
  numberOfItems: number,
  isLessVariant: boolean
): number => {
  switch (breakpoint) {
    case "xs": {
      const sizing = isLessVariant ? 12 : 12;
      const newSizing = improveGridItemSizing(sizing, numberOfItems);
      return newSizing;
    }

    case "sm": {
      const sizing = isLessVariant ? 12 : 12;
      const newSizing = improveGridItemSizing(sizing, numberOfItems);
      return newSizing;
    }

    case "md": {
      const sizing = isLessVariant ? 6 : 6;
      const newSizing = improveGridItemSizing(sizing, numberOfItems);
      return newSizing;
    }

    case "lg": {
      const sizing = isLessVariant ? 6 : 4;
      const newSizing = improveGridItemSizing(sizing, numberOfItems);
      return newSizing;
    }

    case "xl": {
      const sizing = isLessVariant ? 4 : 3;
      const newSizing = improveGridItemSizing(sizing, numberOfItems);
      return newSizing;
    }
  }
};

/**
 * Returns responsive MUI Grid item sizes based on the total number of items.
 *
 * At the `xl` breakpoint, the item size changes dynamically to improve
 * the distribution of items across rows.
 */
export const getResponsiveGridItemProps = (
  numberOfItems: number,
  isLessVariant: boolean
) => ({
  xs: calculateGridItemSize("xs", numberOfItems, isLessVariant),
  sm: calculateGridItemSize("sm", numberOfItems, isLessVariant),
  md: calculateGridItemSize("md", numberOfItems, isLessVariant),
  lg: calculateGridItemSize("lg", numberOfItems, isLessVariant),
  xl: calculateGridItemSize("xl", numberOfItems, isLessVariant),
});
