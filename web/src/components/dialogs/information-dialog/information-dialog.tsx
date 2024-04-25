import DialogWrap from "../dialog-wrap-noredux-typed";

export type InformationDialogProps = {
  closeThisDialog: () => void;
  title: React.ReactNode | string;
  content: React.ReactNode | string;
  big: boolean;
};

export const InformationDialog = ({
  closeThisDialog,
  title,
  content,
  big,
}: InformationDialogProps) => {
  return (
    <DialogWrap
      closeThisDialog={closeThisDialog}
      title={title}
      big={big}
      noDialogMenu
      closeOnEsc
      applyTheming
    >
      {typeof content === "string" ? <div>{content}</div> : content}
    </DialogWrap>
  );
};
