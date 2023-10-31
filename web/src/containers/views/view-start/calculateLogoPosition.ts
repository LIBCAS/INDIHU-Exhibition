import { CSSProperties } from "react";
import { Position, Size } from "models";
import { ThemeFormDataProcessed } from "containers/expo-administration/expo-theme/models";

export const calculateLogoPosition = (
  logoPosition: ThemeFormDataProcessed["logoPosition"],
  bgImgSize: Size,
  bgImgOffset: Position,
  infoPanelSize: Size
): CSSProperties => {
  if (logoPosition === "UPPER_LEFT") {
    return {
      left: `calc(${bgImgOffset.left}px + (${bgImgSize.width}px / 12) )`,
      top: `calc(${bgImgOffset.top}px + (${bgImgSize.height}px / 12) )`,
    };
  }

  if (logoPosition === "UPPER_RIGHT") {
    return {
      right: `calc(${bgImgOffset.left}px + (${bgImgSize.width}px / 12) )`,
      top: `calc(${bgImgOffset.top}px + (${bgImgSize.height}px / 12) )`,
    };
  }

  if (logoPosition === "LOWER_LEFT") {
    const bottomPosition =
      bgImgOffset.top > infoPanelSize.height
        ? `calc(${bgImgOffset.top}px + (${bgImgSize.height}px / 12) )`
        : `calc(${infoPanelSize.height}px + 30px)`;

    return {
      left: `calc(${bgImgOffset.left}px + (${bgImgSize.width}px / 12) )`,
      bottom: bottomPosition,
    };
  }

  return {};
};
