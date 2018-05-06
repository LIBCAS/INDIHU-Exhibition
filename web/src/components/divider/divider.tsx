import cx from "classnames";

export const Divider = ({
  type = "horizontal",
}: {
  type?: "horizontal" | "vertical";
}) => (
  <div
    className={cx(
      "border",
      type === "horizontal"
        ? "w-full border-t-slate-200"
        : "h-full border-l-slate-200"
    )}
  />
);
