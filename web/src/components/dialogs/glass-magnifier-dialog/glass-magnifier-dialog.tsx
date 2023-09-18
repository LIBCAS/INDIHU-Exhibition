import { DialogType } from "../dialog-types";

import Dialog from "../dialog-wrap-typed";
import GlassMagnifierSettings from "containers/views/view-screen-overlay/ActionsPanel/GlassMagnifierButton/GlassMagnifierSettings";

// - -

export type GlassMagnifierDialogDataProps = Record<string, never>;

export const GlassMagnifierDialog = () => {
  return (
    <Dialog
      name={DialogType.GlassMagnifierDialog}
      big
      title={<span className="text-2xl font-bold">Glass Magnifier Dialog</span>}
      noDialogMenu
    >
      <GlassMagnifierSettings biggerElements />
    </Dialog>
  );
};
