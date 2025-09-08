import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import TextField from "react-md/lib/TextFields";
import SelectField from "react-md/lib/SelectFields";
import HelpIcon from "components/help-icon";

// Types
import { AppDispatch } from "store/store";
import { TimelineScreen, TimelineType } from "models";

// Utils
import { updateScreenData } from "actions/expoActions";
import { TimelineTypeEnum } from "enums/administration-screens/screen-timeline";

// - - - - - -

type TimelineNameTextFieldProps = { activeScreen: TimelineScreen };

export const TimelineNameTextField = ({
  activeScreen,
}: TimelineNameTextFieldProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.timelineScreen",
  });

  return (
    <div className="w-full flex">
      <TextField
        id="screen-timeline-timelinename-textfield"
        label={t("nameFieldLabel")}
        lineDirection="center"
        defaultValue={activeScreen.timelineName ?? ""}
        onChange={(newValue: string) =>
          dispatch(updateScreenData({ timelineName: newValue }))
        }
        style={{ width: "100%" }}
      />
      <div className="self-center">
        <HelpIcon
          id="screen-timeline-timelinename-helpIcon"
          label={t("nameFieldTooltip")}
        />
      </div>
    </div>
  );
};

// - - - - - -

type TimelineTypeSelectFieldProps = { activeScreen: TimelineScreen };

export const TimelineTypeSelectField = ({
  activeScreen,
}: TimelineTypeSelectFieldProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.timelineScreen",
  });

  return (
    <div className="w-full flex">
      <SelectField
        menuItems={[
          {
            label: t("horizontalOption"),
            value: TimelineTypeEnum.HORIZONTAL,
          },
          {
            label: t("verticalOption"),
            value: TimelineTypeEnum.VERTICAL,
          },
          {
            label: t("diagonalTopToBottomOption"),
            value: TimelineTypeEnum.DIAGONAL_TOP_TO_BOTTOM,
          },
          {
            label: t("diagonalBottomToTopOption"),
            value: TimelineTypeEnum.DIAGONAL_BOTTOM_TO_TOP,
          },
        ]}
        itemLabel={"label"}
        itemValue={"value"}
        label={t("typeSelectFieldLabel")}
        position="below"
        id="screen-timeline-timelineType-selectfield"
        defaultValue={activeScreen.timelineType ?? "HORIZONTAL"}
        onChange={(newTimelineType: TimelineType) => {
          dispatch(updateScreenData({ timelineType: newTimelineType }));
        }}
        fullWidth
      />
      <div className="self-center">
        <HelpIcon
          id="screen-timeline-timelinetypehelpIcon"
          label={t("typeSelectFieldTooltip")}
        />
      </div>
    </div>
  );
};
