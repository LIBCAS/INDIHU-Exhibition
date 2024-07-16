import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import WysiwygEditor from "components/editors/WysiwygEditor/WysiwygEditor";

import { AppDispatch } from "store/store";
import { TextScreen } from "models";

import { saveScreen, updateScreenData } from "actions/expoActions";
import { wrapTextInParagraph } from "components/editors/WysiwygEditor/utils";

// - -

type TextProps = {
  activeScreen: TextScreen;
  rowNum: string | undefined;
  colNum: string | undefined;
};

const Text = ({ activeScreen, rowNum, colNum }: TextProps) => {
  const { t } = useTranslation("expo-editor");
  const dispatch = useDispatch<AppDispatch>();

  const mainText = activeScreen.mainText ?? "";

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <WysiwygEditor
          controlType="uncontrolled"
          defaultValue={mainText}
          onChange={(newMainText: string) => {
            const wrappedOldMainText = wrapTextInParagraph(mainText.trimEnd());
            dispatch(updateScreenData({ mainText: newMainText }));

            // NOTE: Additional check
            // Means that the new text is just wrapped old text
            // We do not want this change to act as a change done from user, so immediately save it
            if (newMainText === wrappedOldMainText) {
              dispatch(saveScreen(activeScreen, rowNum, colNum));
            }
          }}
          label={t("descFields.textScreen.textLabel")}
          helpIconText={t("descFields.textScreen.textTooltip")}
        />
      </div>
    </div>
  );
};

export default Text;
