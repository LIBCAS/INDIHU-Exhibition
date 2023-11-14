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
      className="h-full lg:h-32 w-32 ml-auto border-x-4 border-t-4 lg:border-b-4 border-white p-4 text-bold text-lg bg-primary cursor-pointer mb-4 text-white"
      style={{ backgroundColor: expoDesignData?.iconsColor }}
      onClick={handleStart}
    >
      {t("start")}
    </button>
  );
};

export default StartButton;
