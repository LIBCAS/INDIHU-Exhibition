import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";
import { useExpoNavigation } from "hooks/view-hooks/expo-navigation-hook";
import { useScreenDataByScreenId } from "hooks/view-hooks/useScreenDataByScreenId";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

// - -

type NextButtonProps = {
  nextScreenId: string | undefined;
};

const NextButton = ({ nextScreenId }: NextButtonProps) => {
  const { t } = useTranslation("view-screen");
  const { expoDesignData } = useExpoDesignData();
  const { navigateForward } = useExpoNavigation();
  const { screenReferenceUrl } =
    useScreenDataByScreenId(nextScreenId ?? null) ?? {};

  const history = useHistory();

  return (
    <button
      className="w-32 h-32 p-4 ml-auto border-4 border-solid border-white text-bold text-lg bg-primary cursor-pointer text-white pointer-events-auto"
      style={{ backgroundColor: expoDesignData?.iconsColor }}
      onClick={() =>
        screenReferenceUrl
          ? history.push(screenReferenceUrl)
          : navigateForward()
      }
    >
      {t("overlay.signpostNextButton")}
    </button>
  );
};

export default NextButton;
