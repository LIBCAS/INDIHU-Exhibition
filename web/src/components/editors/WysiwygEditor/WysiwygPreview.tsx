import { CSSProperties } from "react";
import "react-quill/dist/quill.snow.css";
import "./custom-editor-styles.scss";

import cx from "classnames";

type WysiwygPreviewProps = {
  htmlMarkup: string;
  scrollbar?: boolean;
  fontSize?: "sm" | "xl"; // 14px and 20px
  style?: CSSProperties;
};

const WysiwygPreview = ({
  htmlMarkup,
  scrollbar,
  fontSize = "sm",
  style,
}: WysiwygPreviewProps) => {
  return (
    <div
      className={cx("ql-editor preview", {
        "sm-font-size": fontSize === "sm",
        "xl-font-size": fontSize === "xl",
        "white-font": true, // always, in dark and light mode as well!
        "expo-scrollbar scroll-padding-right": !!scrollbar,
      })}
      style={style}
      dangerouslySetInnerHTML={{ __html: htmlMarkup }}
    />
  );
};

export default WysiwygPreview;
