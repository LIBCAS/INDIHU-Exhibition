type ObjectFitType = "contain" | "cover";

type Size = {
  height: number;
  width: number;
};

type CalculateObjectFitProps = {
  type?: ObjectFitType;
  parent: Size;
  child: Size;
};

export const calculateObjectFit = ({
  type = "contain",
  parent,
  child,
}: CalculateObjectFitProps) => {
  const childRatio = child.width / child.height;
  const parentRatio = parent.width / parent.height;

  let width = parent.width;
  let height = parent.height;

  if (
    type === "contain" ? childRatio > parentRatio : childRatio < parentRatio
  ) {
    height = width / childRatio;
  } else {
    width = height * childRatio;
  }

  return {
    width,
    height,
    left: (parent.width - width) / 2,
    top: (parent.height - height) / 2,
  };
};