import DialogWrap from "./dialog-wrap-noredux-typed";

type WarningDialogProps = { content: string | null; onClose: () => void };

const WarningDialog = ({ content, onClose }: WarningDialogProps) => {
  if (!content) {
    return <div />;
  }

  return (
    <DialogWrap
      title={<span className="text-xl font-bold">Varování</span>}
      closeThisDialog={onClose}
      closeOnEsc
      noStornoButton
      submitLabel="OK"
      handleSubmit={onClose}
    >
      <div className="text-lg font-semibold">{content}</div>
    </DialogWrap>
  );
};

export default WarningDialog;
