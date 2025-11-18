import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import TextField from "react-md/lib/TextFields";
import SelectField from "react-md/lib/SelectFields";
import HelpIcon from "components/help-icon";

// Types
import { AppDispatch } from "store/store";
import {
  TimelineLeftBoundary,
  TimelineRightBoundary,
  TimelineScreen,
  TimelineType,
} from "models";

// Utils
import { updateScreenData } from "actions/expoActions";
import {
  TimelineTypeEnum,
  TimelineLeftBoundaryEnum,
  TimelineRightBoundaryEnum,
} from "enums/administration-screens/screen-timeline";
import {
  DEFAULT_TIMELINE_BG_TRANSPARENCY,
  DEFAULT_TIMELINE_COLOR,
  DEFAULT_TIMELINE_LEFT_BOUNDARY,
  DEFAULT_TIMELINE_RIGHT_BOUNDARY,
  DEFAULT_TIMELINE_THICKNESS,
  DEFAULT_TIMELINE_TYPE,
} from "../default-values";

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
        defaultValue={activeScreen.timelineType ?? DEFAULT_TIMELINE_TYPE}
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
        value={
          activeScreen.backgroundImageTransparency ??
          DEFAULT_TIMELINE_BG_TRANSPARENCY
        }
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
        value={activeScreen.timelineColor ?? DEFAULT_TIMELINE_COLOR}
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
        value={activeScreen.timelineThickness ?? DEFAULT_TIMELINE_THICKNESS}
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

// - - - - - -

type TimelineLeftBoundarySelectFieldProps = {
  activeScreen: TimelineScreen;
};

export const TimelineLeftBoundarySelectField = ({
  activeScreen,
}: TimelineLeftBoundarySelectFieldProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.timelineScreen",
  });

  return (
    <div className="w-full flex">
      <SelectField
        menuItems={[
          {
            label: t("leftBoundaryNothingOption"),
            value: TimelineLeftBoundaryEnum.NOTHING,
          },
          {
            label: t("leftBoundaryLineSegmentOption"),
            value: TimelineLeftBoundaryEnum.LINE_SEGMENT,
          },
          {
            label: t("leftBoundaryDotOption"),
            value: TimelineLeftBoundaryEnum.DOT,
          },
        ]}
        itemLabel={"label"}
        itemValue={"value"}
        label={t("leftBoundaryLabel")}
        position="below"
        id="screen-timeline-timelineLeftBoundary-selectField"
        defaultValue={
          activeScreen.timelineLeftBoundary ?? DEFAULT_TIMELINE_LEFT_BOUNDARY
        }
        onChange={(newTimelineLeftBoundary: TimelineLeftBoundary) => {
          dispatch(
            updateScreenData({ timelineLeftBoundary: newTimelineLeftBoundary })
          );
        }}
        fullWidth
      />
      <div className="self-center">
        <HelpIcon
          id="screen-timeline-timelineLeftBoundaryHelpIcon"
          label={t("leftBoundaryTooltip")}
        />
      </div>
    </div>
  );
};

// - - - - - -

type TimelineRightBoundarySelectFieldProps = {
  activeScreen: TimelineScreen;
};

export const TimelineRightBoundarySelectField = ({
  activeScreen,
}: TimelineRightBoundarySelectFieldProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.timelineScreen",
  });

  return (
    <div className="w-full flex">
      <SelectField
        menuItems={[
          {
            label: t("rightBoundaryNothingOption"),
            value: TimelineRightBoundaryEnum.NOTHING,
          },
          {
            label: t("rightBoundaryLineSegmentOption"),
            value: TimelineRightBoundaryEnum.LINE_SEGMENT,
          },
          {
            label: t("rightBoundaryArrowOption"),
            value: TimelineRightBoundaryEnum.ARROW,
          },
        ]}
        itemLabel={"label"}
        itemValue={"value"}
        label={t("rightBoundaryLabel")}
        position="below"
        id="screen-timeline-timelineRightBoundary-selectField"
        defaultValue={
          activeScreen.timelineRightBoundary ?? DEFAULT_TIMELINE_RIGHT_BOUNDARY
        }
        onChange={(newTimelineRightBoundary: TimelineRightBoundary) => {
          dispatch(
            updateScreenData({
              timelineRightBoundary: newTimelineRightBoundary,
            })
          );
        }}
        fullWidth
      />
      <div className="self-center">
        <HelpIcon
          id="screen-timeline-timelineRightBoundaryHelpIcon"
          label={t("rightBoundaryTooltip")}
        />
      </div>
    </div>
  );
};
