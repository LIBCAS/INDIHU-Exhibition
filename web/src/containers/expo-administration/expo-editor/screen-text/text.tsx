import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import WysiwygEditor from "components/editors/WysiwygEditor/WysiwygEditor";

import { AppDispatch } from "store/store";
import { TextScreen } from "models";

import { updateScreenData } from "actions/expoActions";

// - -

type TextProps = {
  activeScreen: TextScreen;
};

const Text = ({ activeScreen }: TextProps) => {
  const { t } = useTranslation("expo-editor");
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <WysiwygEditor
          controlType="uncontrolled"
          defaultValue={activeScreen.mainText ?? ""}
          onChange={(newContent: string) => {
            dispatch(updateScreenData({ mainText: newContent }));
          }}
          label={t("descFields.textScreen.textLabel")}
          helpIconText={t("descFields.textScreen.textTooltip")}
        />
      </div>
    </div>
  );
};

export default Text;
