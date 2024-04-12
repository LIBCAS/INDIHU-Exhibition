import { useTranslation } from "react-i18next";
import {
  FacebookIcon,
  FacebookShareButton,
  //TwitterIcon,
  TwitterShareButton,
  EmailIcon,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { XIcon } from "./XIcon";

import { CopyClipboardBox } from "./CopyClipboardBox";
import DialogWrap from "../dialog-wrap-noredux-typed";
import { getEmailContent } from "./getEmailContent";

// - -

export type ShareExpoDialogProps = {
  closeThisDialog: () => void;
  url: string;
  expoTitle: string | undefined;
};

export const ShareExpoDialog = ({
  closeThisDialog,
  url,
  expoTitle,
}: ShareExpoDialogProps) => {
  const { t } = useTranslation("view-exhibition");

  const emailContent = getEmailContent(expoTitle ?? "", url);

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
          <XIcon size={45} />
          <p className="text-inherit">X</p>
        </TwitterShareButton>

        {/* Replaced by EmailShareButton */}
        <a
          className="!w-24 flex flex-col items-center"
          href={`mailto:?subject=${emailContent.subject}&body=${emailContent.body}`}
        >
          <EmailIcon size={45} />
          <p className="text-inherit">Email</p>
        </a>
      </div>

      <CopyClipboardBox
        text={url}
        tooltipText={t("copy-link")}
        onCopy={closeThisDialog}
      />
    </DialogWrap>
  );
};
