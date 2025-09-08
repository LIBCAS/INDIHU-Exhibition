import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import {
  TimelineNameTextField,
  TimelineTypeSelectField,
} from "./components/Fields";
import TimelineBox from "./components/TimelineBox";
import InfopointsTable from "components/editors/InfopointsTable";

// Types
import { AppDispatch } from "store/store";
import { TimelineScreen } from "models";

// Actions
import { updateScreenData } from "actions/expoActions";

// Utils
import { concat } from "lodash";

// - - - - - -

type TimelineProps = {
  activeScreen: TimelineScreen;
};

const Timeline = ({ activeScreen }: TimelineProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.timelineScreen",
  });

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        {/* Fields */}
        <div className="w-full sm:w-3/4 mx-auto">
          <div className="flex flex-col gap-4 justify-start items-center">
            <TimelineNameTextField activeScreen={activeScreen} />
            <TimelineTypeSelectField activeScreen={activeScreen} />
          </div>
        </div>

        <div className="mt-8 flex flex-col lg:flex-row justify-center items-center gap-8">
          <div>
            <TimelineBox
              activeScreen={activeScreen}
              title={t("timelineBoxLabel")}
              helpIconLabel={t("timelineBoxTooltip")}
              helpIconId="screen-timeline-timelinebox-helpIcon"
            />
          </div>

          <div className="w-full">
            <InfopointsTable
              title={t("timelinePointsTitle")}
              infopoints={activeScreen.infopoints ?? []}
              onInfopointAdd={(dialogFormData) => {
                dispatch(
                  updateScreenData({
                    infopoints: concat(activeScreen.infopoints ?? [], {
                      // Add new infopoint object
                      ...dialogFormData,
                      left: 17,
                      top: 17,
                    }),
                  })
                );
              }}
              onInfopointEdit={(infopointIndexToEdit, dialogFormData) => {
                dispatch(
                  updateScreenData({
                    infopoints: activeScreen.infopoints?.map(
                      (infopoint, infopointIndex) =>
                        infopointIndex === infopointIndexToEdit
                          ? { ...infopoint, ...dialogFormData }
                          : infopoint
                    ),
                  })
                );
              }}
              onInfopointDelete={(infopointIndexToDelete) => {
                dispatch(
                  updateScreenData({
                    infopoints: activeScreen.infopoints?.filter(
                      (_ip, ipIndex) => infopointIndexToDelete !== ipIndex
                    ),
                  })
                );
              }}
              onInfopointAlwaysVisibleChange={(
                infopointIndexToEdit,
                newIsAlwaysVisibleValue
              ) => {
                dispatch(
                  updateScreenData({
                    infopoints: activeScreen.infopoints?.map(
                      (infopoint, infopointIndex) =>
                        infopointIndex === infopointIndexToEdit
                          ? {
                              ...infopoint,
                              alwaysVisible: newIsAlwaysVisibleValue,
                            }
                          : infopoint
                    ),
                  })
                );
              }}
              type="timeline"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
