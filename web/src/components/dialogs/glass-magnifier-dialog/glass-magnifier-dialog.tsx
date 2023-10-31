import DialogWrap from "../dialog-wrap-noredux-typed";
import GlassMagnifierSettings from "containers/views/view-screen-overlay/ActionsPanel/GlassMagnifierButton/GlassMagnifierSettings";

// - -

interface GlassMagnifierProps {
  closeThisDialog: () => void;
}

export const GlassMagnifierDialog = ({
  closeThisDialog,
}: GlassMagnifierProps) => {
  return (
    <DialogWrap
      closeThisDialog={closeThisDialog}
      title={<span className="text-2xl font-bold">Glass Magnifier Dialog</span>}
      big
      noDialogMenu
      closeOnEsc
      applyTheming
    >
      <GlassMagnifierSettings biggerElements />
    </DialogWrap>
  );
};
