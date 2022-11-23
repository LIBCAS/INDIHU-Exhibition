import { useEffect, useMemo } from "react";
import Snackbar from "react-md/lib/Snackbars";
import CopyToClipboard from "react-copy-to-clipboard";
import Tooltip from "react-tooltip";

import { Icon } from "components/icon/icon";
import { useBoolean } from "hooks/boolean-hook";

type CopyClipboardBoxProps = {
  text: string;
  tooltipText?: string;
  onCopy?: () => void;
};

export const CopyClipboardBox = ({
  text,
  tooltipText,
  onCopy,
}: CopyClipboardBoxProps) => {
  const [open, { setTrue, setFalse }] = useBoolean(false);

  const toasts = useMemo(
    () => (open ? [{ text: "Odkaz zkopírován" }] : undefined),
    [open]
  );

  useEffect(() => {
    Tooltip.rebuild();
  }, [tooltipText]);

  return (
    <>
      <div className="flex items-center justify-between gap-2 p-2 bg-muted-200">
        <span>{text}</span>
        <div data-tip={tooltipText} data-for="copy-clipboard-box-tooltip">
          <CopyToClipboard
            text={text}
            onCopy={() => {
              setTrue();
              onCopy?.();
            }}
          >
            <Icon name="link" />
          </CopyToClipboard>
        </div>
      </div>

      {tooltipText && (
        <Tooltip
          place="left"
          type="dark"
          effect="solid"
          id="copy-clipboard-box-tooltip"
          className="!pointer-events-auto !opacity-100 !rounded-none shadow-md"
        />
      )}

      <Snackbar
        id="copy-clipboard-box-snackbar"
        toasts={toasts}
        autohide
        onDismiss={setFalse}
      />
    </>
  );
};
