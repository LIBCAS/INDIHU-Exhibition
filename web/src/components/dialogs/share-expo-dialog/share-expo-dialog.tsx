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

import { DialogProps, DialogType } from "../dialog-types";
import Dialog from "../dialog-wrap-typed";

export type ShareExpoDialogDataProps = {
  url: string;
};

export const ShareExpoDialog = ({
  dialogData,
  closeDialog,
}: DialogProps<DialogType.ShareExpoDialog>) => {
  const { url } = dialogData ?? { url: "" };
  const { t } = useTranslation("exhibition");

  return (
    <Dialog
      big
      title={<span className="text-2xl font-bold">{t("share-expo")}</span>}
      name={DialogType.ShareExpoDialog}
      noDialogMenu
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <FacebookShareButton
          url={url}
          className="!w-24 flex flex-col items-center"
        >
          <FacebookIcon size={45} />
          <p>Facebook</p>
        </FacebookShareButton>
        <WhatsappShareButton
          url={url}
          className="!w-24 flex flex-col items-center"
        >
          <WhatsappIcon size={45} />
          <p>Whatsapp</p>
        </WhatsappShareButton>
        <TwitterShareButton
          url={url}
          className="!w-24 flex flex-col items-center"
        >
          <TwitterIcon size={45} />
          <p>Twitter</p>
        </TwitterShareButton>
        <EmailShareButton
          url={url}
          className="!w-24 flex flex-col items-center"
        >
          <EmailIcon size={45} />
          <p>Email</p>
        </EmailShareButton>
      </div>

      <CopyClipboardBox
        text={url}
        tooltipText={t("copy-link")}
        onCopy={closeDialog}
      />
    </Dialog>
  );
};
