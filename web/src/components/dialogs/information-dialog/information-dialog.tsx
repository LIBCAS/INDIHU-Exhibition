import Dialog from "../dialog-wrap-typed";
import { DialogProps, DialogType } from "../dialog-types";

export type InformationDialogDataProps = {
  title: React.ReactNode | string;
  content: React.ReactNode | string;
  big: boolean;
};

export const InformationDialog = ({
  dialogData,
}: DialogProps<DialogType.InformationDialog>) => {
  if (!dialogData) {
    return null;
  }

  const { title, content, big } = dialogData;

  return (
    <Dialog
      name={DialogType.InformationDialog}
      title={title}
      big={big}
      noDialogMenu
    >
      {typeof content === "string" ? <div>{content}</div> : content}
    </Dialog>
  );
};
