import { useTranslation } from "react-i18next";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

// Components
import { Icon } from "components/icon/icon";
import { Spinner } from "components/loaders/spinner";

// Utils
import cx from "classnames";

// - -

type SendButtonProps = {
  disabled?: boolean;
  onClick?: () => void;
  isSubmitting: boolean;
};

const SendButton = ({ disabled, onClick, isSubmitting }: SendButtonProps) => {
  const { t } = useTranslation("view-screen", { keyPrefix: "rating" });
  const { isLightMode } = useExpoDesignData();

  return (
    <button
      className={cx(
        "p-4 bg-black text-white font-bold text-xl flex items-center gap-4",
        {
          "!text-disabled-dark !bg-disabled-light": disabled && isLightMode,
          "!text-gray !bg-dark-gray": disabled && !isLightMode,
        }
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {t("sendActionButtonLabel")}
      {!isSubmitting && (
        <Icon name="send" useMaterialUiIcon iconStyle={{ fontSize: "24px" }} />
      )}
      {isSubmitting && (
        <Spinner
          scale={1}
          style={{ width: "24px", height: "24px", fontSize: "24px" }}
        />
      )}
    </button>
  );
};

export default SendButton;
