import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Tooltip from "react-tooltip";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

type InfopointTooltipHookProps = {
  onClose?: () => void;
};

export const useInfopointTooltip = (props?: InfopointTooltipHookProps) => {
  const { onClose } = props ?? {};
  const [showTooltip, setShowTooltip] = useState(true);
  const intervalRef = useRef<NodeJS.Timer>();

  const handleClose = useCallback(() => {
    onClose?.();
    Tooltip.hide();
    setShowTooltip(false);
    intervalRef.current = setInterval(() => setShowTooltip(true), 50);
  }, [onClose]);

  useEffect(
    () => () => {
      if (!intervalRef.current) return;

      clearInterval(intervalRef.current);
    },
    []
  );

  const renderTooltip = useCallback(
    (text: string) => (
      <div className="flex flex-col gap-4 max-w-[350px]">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">Infopoint</span>
          <Button
            noPadding
            iconBefore={<Icon name="close" />}
            onClick={handleClose}
          />
        </div>
        <span>{text}</span>
      </div>
    ),
    [handleClose]
  );

  return useMemo(
    () => ({ renderTooltip, showTooltip }),
    [renderTooltip, showTooltip]
  );
};
