import { useFiles } from "containers/views/hooks/files-hook";
import { useCallback, useEffect, useMemo } from "react";
import Tooltip from "react-tooltip";

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

      const image = "image" in screenPoint ? screenPoint.image : undefined;

      return (
        <div className="flex flex-col items-center gap-2">
          <span className="text-lg font-semibold whitespace-nowrap">
            {screenPoint.title}
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

  useEffect(() => {
    const interval = setInterval(() => Tooltip.rebuild(), 1000);

    return () => clearInterval(interval);
  });

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
