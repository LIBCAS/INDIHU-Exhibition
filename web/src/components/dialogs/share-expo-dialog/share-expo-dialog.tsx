import { useTranslation } from "react-i18next";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  EmailIcon,
  EmailShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

import { CopyClipboardBox } from "components/copy-clipboard-box/copy-clipboard-box";
import DialogWrap from "../dialog-wrap-noredux-typed";

// - -

export type ShareExpoDialogProps = {
  closeThisDialog: () => void;
  url: string;
};

export const ShareExpoDialog = ({
  closeThisDialog,
  url,
}: ShareExpoDialogProps) => {
  const { t } = useTranslation("exhibition");

  return (
    <DialogWrap
      closeThisDialog={closeThisDialog}
      title={<span className="text-2xl font-bold">{t("share-expo")}</span>}
      big
      noDialogMenu
      closeOnEsc
      applyTheming
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <FacebookShareButton
          url={url}
          className="!w-24 flex flex-col items-center"
        >
          <FacebookIcon size={45} />
          <p className="text-inherit">Facebook</p>
        </FacebookShareButton>
        <WhatsappShareButton
          url={url}
          className="!w-24 flex flex-col items-center"
        >
          <WhatsappIcon size={45} />
          <p className="text-inherit">Whatsapp</p>
        </WhatsappShareButton>
        <TwitterShareButton
          url={url}
          className="!w-24 flex flex-col items-center"
        >
          <TwitterIcon size={45} />
          <p className="text-inherit">Twitter</p>
        </TwitterShareButton>
        <EmailShareButton
          url={url}
          className="!w-24 flex flex-col items-center"
        >
          <EmailIcon size={45} />
          <p className="text-inherit">Email</p>
        </EmailShareButton>
      </div>

      <CopyClipboardBox
        text={url}
        tooltipText={t("copy-link")}
        onCopy={closeThisDialog}
      />
    </DialogWrap>
  );
};
