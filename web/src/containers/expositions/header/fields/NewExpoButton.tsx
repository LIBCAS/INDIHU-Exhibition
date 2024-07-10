import { useDispatch } from "react-redux";
import { AppDispatch } from "store/store";
import { useTranslation } from "react-i18next";
import { Button } from "components/button/button";
import { setDialog } from "actions/dialog-actions";
import AddIcon from "@mui/icons-material/Add";
import { DialogType } from "components/dialogs/dialog-types";

type NewExpoButtonProps = {
  isCardList: boolean;
};

const NewExpoButton = ({ isCardList }: NewExpoButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("exhibitions-page");

  if (isCardList) {
    return <div />;
  }

  return (
    <Button
      onClick={() => dispatch(setDialog(DialogType.ExpoNew, {}))}
      iconBefore={<AddIcon />}
      className="px-4 py-2"
      // raised style
      style={{
        boxShadow:
          "0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12), 0 3px 1px -2px rgba(0, 0, 0, .2)",
      }}
    >
      {t("expoTable.createNewExpo")}
    </Button>
  );
};

export default NewExpoButton;
