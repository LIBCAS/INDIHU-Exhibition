import { CSSProperties } from "react";
import "react-quill/dist/quill.snow.css";
import "./custom-editor-styles.scss";

import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

import cx from "classnames";

type WysiwygPreviewProps = {
  htmlMarkup: string;
  scrollbar?: boolean;
  fontSize?: "sm" | "xl"; // 14px and 20px
  forceWhiteFont?: boolean;
  style?: CSSProperties;
};

const WysiwygPreview = ({
  htmlMarkup,
  scrollbar,
  fontSize = "sm",
  forceWhiteFont = false,
  style,
}: WysiwygPreviewProps) => {
  const { fgTheming } = useExpoDesignData();

  return (
    <div
      className={cx("ql-editor preview", {
        "sm-font-size": fontSize === "sm",
        "xl-font-size": fontSize === "xl",
        "expo-scrollbar scroll-padding-right": !!scrollbar,
        ...fgTheming,
        "white-font": forceWhiteFont,
      })}
      style={style}
      dangerouslySetInnerHTML={{ __html: htmlMarkup }}
    />
  );
};

export default WysiwygPreview;
