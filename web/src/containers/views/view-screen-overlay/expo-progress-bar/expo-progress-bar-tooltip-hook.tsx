import { useFiles } from "containers/views/hooks/files-hook";
import { useCallback, useMemo } from "react";

import { ScreenPoint } from "./types";

export const useExpoProgressBarTooltip = (screenPoints: ScreenPoint[]) => {
  const renderTooltip = useCallback(
    (indexString: string) => {
      const index = parseInt(indexString);
      const errorMessage = <span>Obrazovku nebylo možné načíst</span>;
      if (isNaN(index)) {
        return errorMessage;
      }

      const screenPoint = screenPoints[index];
      if (!screenPoint) {
        return errorMessage;
      }

      // Check either for the key "image" or "images"
      // "images" are for example for PARALLAX or PHOTOGALLERY but difference structures
      // "image1", "image2" are used for IMAGE_CHANGE
      let image: string | undefined = undefined;
      if ("image" in screenPoint) {
        image = screenPoint.image;
      } else if ("image1" in screenPoint) {
        image = screenPoint.image1;
      } else if (screenPoint.type === "PARALLAX") {
        image =
          screenPoint.images?.length && screenPoint.images.length > 0
            ? screenPoint.images[0]
            : undefined;
      } else if (screenPoint.type === "PHOTOGALERY") {
        image =
          screenPoint.images?.length && screenPoint.images.length > 0
            ? screenPoint.images[0].id
            : undefined;
      } else {
        image = undefined;
      }

      // const image = "image" in screenPoint ? screenPoint.image : undefined;

      return (
        <div className="flex flex-col items-center gap-2">
          <span className="text-lg font-semibold whitespace-nowrap">
            {screenPoint.type === "START"
              ? "Úvodní obrazovka"
              : screenPoint.title}
          </span>
          <ProgressBarImage imageId={image} />
        </div>
      );
    },
    [screenPoints]
  );

  return useMemo(() => ({ renderTooltip }), [renderTooltip]);
};

type ProgressBarImageProps = {
  imageId?: string;
};

const ProgressBarImage = ({ imageId }: ProgressBarImageProps) => {
  const fileLookupMap = useFiles();

  // useEffect(() => {
  //   const interval = setInterval(() => Tooltip.rebuild(), 1000);

  //   return () => clearInterval(interval);
  // });

  if (!imageId) {
    return <></>;
  }

  return (
    <img
      className="w-44 h-24 object-cover"
      src={`/api/files/${fileLookupMap[imageId].fileId}`}
      alt="náhled obrazovky"
    />
  );
};
