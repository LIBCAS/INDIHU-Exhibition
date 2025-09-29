import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import {
  TimelineNameTextField,
  TimelineTypeSelectField,
  TimelineBgImageTransparencyTextField,
  EvenDistributionPointsCheckbox,
  TimelineColorTextField,
  TimelineThicknessTextField,
} from "./components/Fields";
import TimelineBox from "./components/TimelineBox";
import InfopointsTable from "components/editors/InfopointsTable";
import ReactMdButton from "react-md/lib/Buttons/Button";

// Types
import { AppDispatch } from "store/store";
import { DialogType } from "components/dialogs/dialog-types";
import { TimelineScreen, File as IndihuFile } from "models";

// Actions
import { updateScreenData } from "actions/expoActions";
import { setDialog } from "actions/dialog-actions";
import { getFileById } from "actions/file-actions-typed";

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

  // - - - Derived variables - - -

  const backgroundImageFile = activeScreen.backgroundImage
    ? dispatch(getFileById(activeScreen.backgroundImage))
    : null;

  // - - - Callbacks - - -

  const setBackgroundImageFile = useCallback(
    (img: IndihuFile) => {
      dispatch(updateScreenData({ backgroundImage: img.id }));
    },
    [dispatch]
  );

  const chooseBgImageViaDialog = useCallback(() => {
    dispatch(
      setDialog(DialogType.ScreenFileChoose, {
        onChoose: (chosenImgFile) => {
          setBackgroundImageFile(chosenImgFile);
        },
        typeMatch: new RegExp(/^image\/.*$/),
        accept: "image/*",
      })
    );
  }, [dispatch, setBackgroundImageFile]);

  // - - - GUI - - -

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

        <div className="mt-8 lg:mt-6">
          <p className="font-bold italic underline text-base">
            Dodatočné nastavenia časovej osy:
          </p>

          <div className="mt-0">
            <EvenDistributionPointsCheckbox activeScreen={activeScreen} />
          </div>

          <div className="mt-2">
            <p>Farba časovej osy:</p>
            <div className="max-w-[400px]">
              <TimelineColorTextField activeScreen={activeScreen} />
            </div>
          </div>

          <div className="mt-2">
            <div className="max-w-[400px]">
              <TimelineThicknessTextField activeScreen={activeScreen} />
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2">
              Zvolený obrázok na pozadí:{" "}
              <span className="italic">
                {backgroundImageFile?.name ??
                  "Zatiaľ nebol zvolený žiaden obrázok"}
              </span>
            </p>

            <ReactMdButton
              raised
              label="Vyberte obrázok na pozadie"
              onClick={chooseBgImageViaDialog}
            />
          </div>

          <div className="mt-4">
            <div className="max-w-[400px]">
              <TimelineBgImageTransparencyTextField
                activeScreen={activeScreen}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
