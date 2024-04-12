import { useTranslation } from "react-i18next";
import DialogWrap from "./dialog-wrap-noredux-typed";

type WarningDialogProps = { content: string | null; onClose: () => void };

const WarningDialog = ({ content, onClose }: WarningDialogProps) => {
  const { t } = useTranslation("expo", { keyPrefix: "warningDialog" });

  if (!content) {
    return <div />;
  }

  return (
    <DialogWrap
      title={<span className="text-xl font-bold">{t("title")}</span>}
      closeThisDialog={onClose}
      closeOnEsc
      noStornoButton
      submitLabel={t("submitLabel")}
      handleSubmit={onClose}
    >
      <div className="text-lg font-semibold">{content}</div>
    </DialogWrap>
  );
};

export default WarningDialog;
