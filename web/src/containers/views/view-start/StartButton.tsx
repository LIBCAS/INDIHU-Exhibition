import { useTranslation } from "react-i18next";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

interface StartButtonProps {
  handleStart: () => Promise<void>;
}

const StartButton = ({ handleStart }: StartButtonProps) => {
  const { t } = useTranslation("view-exhibition");
  const { expoDesignData } = useExpoDesignData();

  return (
    <button
      className="h-full w-32 lg:h-32 p-4 ml-auto mb-4 border-4 border-solid border-white text-white text-bold text-lg bg-primary cursor-pointer"
      style={{ backgroundColor: expoDesignData?.iconsColor }}
      onClick={handleStart}
    >
      {t("start")}
    </button>
  );
};

export default StartButton;
