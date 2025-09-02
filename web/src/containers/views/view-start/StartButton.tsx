import { useTranslation } from "react-i18next";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

interface StartButtonProps {
  handleStart: () => Promise<void>;
}

const StartButton = ({ handleStart }: StartButtonProps) => {
  const { t } = useTranslation("view-exhibition");
  const { expoDesignData } = useExpoDesignData();

  return (
    <div className="flex justify-center items-center">
      <button
        className="w-32 h-32 p-4 border-4 border-solid border-white text-white text-bold text-lg bg-primary cursor-pointer"
        style={{ backgroundColor: expoDesignData?.iconsColor }}
        onClick={handleStart}
      >
        {t("start")}
      </button>
    </div>
  );
};

export default StartButton;
