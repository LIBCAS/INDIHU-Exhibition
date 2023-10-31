import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@mui/material";
import { Add } from "@mui/icons-material";

import { AppDispatch } from "store/store";
import { setDialog } from "../../actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";

const ExpoNewCard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("exhibitions-page");

  return (
    <div className="w-full sm:w-[350px] min-h-[250px]">
      <Card
        raised
        onClick={() => dispatch(setDialog(DialogType.ExpoNew, {}))}
        sx={{ width: "100%", height: "100%" }}
      >
        <CardContent className="h-full flex flex-col justify-center items-center cursor-pointer">
          <Add sx={{ fontSize: "48px" }} />
          <div className="font-bold">{t("expoCard.createNewExpo")}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpoNewCard;
