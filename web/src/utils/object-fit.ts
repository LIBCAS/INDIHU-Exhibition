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
  parent, // { width, height } of the entire screen
  child, // {width, height } of the imageOrigData
}: CalculateObjectFitProps) => {
  const parentRatio = parent.width / parent.height;
  const childRatio = child.width / child.height;

  // Now parent width.. but in the end it will be width and height of the 'object-fit: contain' image!
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
