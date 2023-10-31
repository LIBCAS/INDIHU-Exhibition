import { useTranslation } from "react-i18next";
import { secondsToFormatedTime } from "../../utils";

type CharacterCountProps = { text?: string };

const CharacterCount = ({ text = "" }: CharacterCountProps) => {
  const { t } = useTranslation("expo-editor");

  const textLength = text.length;
  const calculation = (text.split(" ").length / 100) * 60;
  const expectedLength =
    calculation < 1 ? "1 s" : secondsToFormatedTime(calculation);

  return (
    <p>
      {textLength} {t("descFields.charCount")} {expectedLength}
    </p>
  );
};

export default CharacterCount;
