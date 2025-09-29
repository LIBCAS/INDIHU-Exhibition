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

// - - - - - -

type TimelineBgImageTransparencyTextFieldProps = {
  activeScreen: TimelineScreen;
};

export const TimelineBgImageTransparencyTextField = ({
  activeScreen,
}: TimelineBgImageTransparencyTextFieldProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.timelineScreen",
  });

  return (
    <div className="w-full flex">
      <TextField
        type="number"
        id="screen-timeline-bgimage-transparency-textfield"
        label={t("bgImageTransparencyLabel")}
        lineDirection="center"
        value={activeScreen.backgroundImageTransparency ?? 100}
        onChange={(newValue: string) => {
          const transparency = Number(newValue); // empty string is converted to 0
          if (isNaN(transparency) || transparency < 1 || transparency > 100) {
            return;
          }

          dispatch(
            updateScreenData({ backgroundImageTransparency: transparency })
          );
        }}
        style={{ width: "100%" }}
      />
      <div className="self-center">
        <HelpIcon
          id="screen-timeline-bgimage-transpareancy-helpIcon"
          label={t("bgImageTransparencyTooltip")}
        />
      </div>
    </div>
  );
};

// - - - - - -

type TimelineColorTextFieldProps = {
  activeScreen: TimelineScreen;
};

export const TimelineColorTextField = ({
  activeScreen,
}: TimelineColorTextFieldProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.timelineScreen",
  });

  return (
    <div className="w-full flex">
      <input
        type="color"
        id="screen-timeline-timelinecolor-textfield"
        value={activeScreen.timelineColor ?? "#000000"}
        onChange={(e) => {
          const newValue = e.target.value;
          dispatch(updateScreenData({ timelineColor: newValue }));
        }}
        style={{ width: "100%" }}
      />
      <div className="self-center">
        <HelpIcon
          id="screen-timeline-timelinecolor-helpIcon"
          label={t("timelineColorTooltip")}
        />
      </div>
    </div>
  );
};

// - - - - - -

type TimelineThicknessTextFieldProps = {
  activeScreen: TimelineScreen;
};

export const TimelineThicknessTextField = ({
  activeScreen,
}: TimelineThicknessTextFieldProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.timelineScreen",
  });

  return (
    <div className="w-full flex">
      <TextField
        type="number"
        id="screen-timeline-timelinethickness-textfield"
        label={t("timelineThicknessLabel")}
        lineDirection="center"
        value={activeScreen.timelineThickness ?? 4}
        onChange={(newValue: string) => {
          const thickness = Number(newValue); // empty string is converted to 0
          if (isNaN(thickness) || thickness < 1 || thickness > 25) {
            return;
          }

          dispatch(updateScreenData({ timelineThickness: thickness }));
        }}
        style={{ width: "100%" }}
      />
      <div className="self-center">
        <HelpIcon
          id="screen-timeline-timelinethickness-helpIcon"
          label={t("timelineThicknessTooltip")}
        />
      </div>
    </div>
  );
};
