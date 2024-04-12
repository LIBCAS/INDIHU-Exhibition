import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import TextField from "react-md/lib/TextFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";
import HelpIcon from "components/help-icon";

import { AppDispatch } from "store/store";
import { ExternalScreen } from "models";

import { updateScreenData } from "actions/expoActions";
import { useMemo } from "react";

// - -

type ExternalDataProps = {
  activeScreen: ExternalScreen;
};

const ExternalData = ({ activeScreen }: ExternalDataProps) => {
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.externalScreen",
  });

  const dispatch = useDispatch<AppDispatch>();

  // If was not previously checked -> considered as true
  const shouldScaleExternalData = useMemo(
    () => activeScreen.shouldScaleExternalData ?? true,
    [activeScreen.shouldScaleExternalData]
  );

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="flex-row-nowrap">
          <TextField
            id="screen-start-textfield-externaldata"
            label={t("insertedCodeLabel")}
            defaultValue={activeScreen.externalData}
            onChange={(value: string) =>
              dispatch(updateScreenData({ externalData: value }))
            }
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
            checked={shouldScaleExternalData}
            onChange={(newValue: boolean) => {
              dispatch(updateScreenData({ shouldScaleExternalData: newValue }));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ExternalData;
