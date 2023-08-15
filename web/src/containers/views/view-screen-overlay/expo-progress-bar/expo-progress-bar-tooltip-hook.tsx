import { useCallback, useMemo } from "react";
import { useFiles } from "hooks/view-hooks/files-hook";

import { ScreenPoint } from "models";

// - - - - - -

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

      // Show the image only for the START and INTRO screen if "image" keys is present there
      let image: string | undefined = undefined;
      if (
        (screenPoint.type === "START" || screenPoint.type === "INTRO") &&
        "image" in screenPoint
      ) {
        image = screenPoint.image;
      }

      return (
        <div className="w-64 flex flex-col gap-2">
          <span className="text-lg font-semibold text-center whitespace-nowrap overflow-hidden text-ellipsis">
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

// - - - - - -

type ProgressBarImageProps = {
  imageId?: string;
};

const ProgressBarImage = ({ imageId }: ProgressBarImageProps) => {
  const fileLookupMap = useFiles();

  if (!imageId) {
    return <></>;
  }

  return (
    <img
      className="w-44 h-24 object-cover mx-auto"
      src={`/api/files/${fileLookupMap[imageId].fileId}`}
      alt="náhled obrazovky"
    />
  );
};
