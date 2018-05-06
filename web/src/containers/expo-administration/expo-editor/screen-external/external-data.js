import { useTranslation } from "react-i18next";
import TextField from "react-md/lib/TextFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";

import HelpIcon from "components/help-icon";

// - -

const ExternalData = ({ activeScreen, updateScreenData }) => {
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.externalScreen",
  });

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="flex-row-nowrap">
          <TextField
            id="screen-start-textfield-externaldata"
            label={t("insertedCodeLabel")}
            defaultValue={activeScreen.externalData}
            onChange={(value) => updateScreenData({ externalData: value })}
            rows={5}
          />
          <HelpIcon
            label={t("insertedCodeTooltip")}
            id="editor-external-externaldata"
          />
        </div>

        <div className="mt-2">
          <Checkbox
            id="external-screen-data-should-scale"
            name="shouldScaleExternalData"
            label={t("shouldScaleExternalDataLabel")}
            checked={activeScreen.shouldScaleExternalData}
            onChange={(newValue) => {
              updateScreenData({ shouldScaleExternalData: newValue });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ExternalData;
