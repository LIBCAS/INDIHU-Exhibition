import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import { SelectField, TextField } from "react-md";
import ImageBox from "components/editors/ImageBox";
import SequencesTable from "./SequencesTable";
import HelpIcon from "components/help-icon";

// Models
import { ZoomScreen, File as IndihuFile } from "models";
import { AppDispatch } from "store/store";

// Utils
import { updateScreenData } from "actions/expoActions";
import { getFileById } from "actions/file-actions-typed";
import { compact, concat } from "lodash";
import { ZOOM_SCREEN_DEFAULT_SEQ_DELAY_TIME } from "constants/screen";
import { ZoomInTooltipPositionEnum } from "enums/administration-screens";

// - -

type SequenceProps = {
  activeScreen: ZoomScreen;
  totalZoomScreenTime: number;
};

const Sequence = ({ activeScreen, totalZoomScreenTime }: SequenceProps) => {
  const { t } = useTranslation("expo-editor");
  const dispatch = useDispatch<AppDispatch>();

  const imageFile = dispatch(getFileById(activeScreen.image));
  const setImageFile = (imgFile: IndihuFile) => {
    dispatch(updateScreenData({ image: imgFile.id, sequences: [] }));
  };

  useEffect(() => {
    dispatch(updateScreenData({ time: totalZoomScreenTime }));
  }, [totalZoomScreenTime, dispatch]);

  return (
    <div className="container container-tabMenu">
      <div className="screen screen-image">
        <div className="mt-2 mb-4 mx-[2.5%] flex justify-start items-center gap-10">
          <div className="flex items-center">
            <SelectField
              id="screen-zoom-in-tooltip-position"
              label={t("descFields.imageZoomScreen.zoomPositionLabel")}
              className="min-w-[230px]"
              menuItems={[
                {
                  value: ZoomInTooltipPositionEnum.TOP_LEFT,
                  label: t(
                    "descFields.imageZoomScreen.zoomPositionTopLeftOption"
                  ),
                },
                {
                  value: ZoomInTooltipPositionEnum.TOP_RIGHT,
                  label: t(
                    "descFields.imageZoomScreen.zoomPositionTopRightOption"
                  ),
                },
              ]}
              itemLabel="label"
              itemValue="value"
              position="below"
              defaultValue={activeScreen.tooltipPosition}
              onChange={(newTooltipPosition: "TOP_LEFT" | "TOP_RIGHT") => {
                dispatch(
                  updateScreenData({ tooltipPosition: newTooltipPosition })
                );
              }}
            />
            <HelpIcon
              label={t("descFields.imageZoomScreen.zoomPositionTooltip")}
              id="editor-zoom-in-tooltip-position"
            />
          </div>

          <div className="flex items-center">
            <TextField
              id="editor-zoom-in-delay-time"
              label={t("descFields.imageZoomScreen.seqDelayLabel")}
              type="number"
              // defaultValue={
              //   activeScreen.seqDelayTime ?? ZOOM_SCREEN_DEFAULT_SEQ_DELAY_TIME
              // }
              value={
                activeScreen.seqDelayTime ?? ZOOM_SCREEN_DEFAULT_SEQ_DELAY_TIME
              }
              onChange={(newDelayTime: string) => {
                const parsedDelayTime = parseFloat(newDelayTime);
                if (isNaN(parsedDelayTime)) {
                  return;
                }
                if (parsedDelayTime < 1) {
                  return;
                }
                dispatch(updateScreenData({ seqDelayTime: parsedDelayTime }));
              }}
            />
            <HelpIcon
              label={t("descFields.imageZoomScreen.seqDelayTooltip")}
              id="editor-zoom-in-delay-time"
            />
          </div>
        </div>

        {/* ImageBox + SequenceTable */}
        <div className="mt-10 flex flex-col justify-start items-center gap-6 xl:flex-row xl:justify-around xl:gap-0">
          <ImageBox
            title={t("descFields.imageZoomScreen.imageBoxTitle")}
            image={imageFile}
            setImage={setImageFile}
            onDelete={() => {
              dispatch(
                updateScreenData({
                  image: null,
                  imageOrigData: null,
                  sequences: null,
                })
              );
            }}
            onLoad={(width: number, height: number) => {
              dispatch(updateScreenData({ imageOrigData: { width, height } }));
            }}
            helpIconId="editor-zoom-in-image"
            helpIconLabel={t("descFields.imageZoomScreen.imageBoxTooltip")}
            infopoints={activeScreen.sequences}
            onInfopointMove={(
              movedInfopointIndex,
              newLeftPosition,
              newTopPosition
            ) => {
              dispatch(
                updateScreenData({
                  sequences: activeScreen.sequences?.map((seq, seqIdx) =>
                    movedInfopointIndex === seqIdx
                      ? { ...seq, left: newLeftPosition, top: newTopPosition }
                      : seq
                  ),
                })
              );
            }}
          />

          <div className="mt-4 flex flex-col gap-1">
            <div className="flex gap-2 text-lg">
              <div>{t("descFields.imageZoomScreen.totalScreenTime")}</div>
              <div>
                {totalZoomScreenTime} {t("descFields.imageZoomScreen.seconds")}
              </div>
            </div>

            <SequencesTable
              sequences={activeScreen.sequences ?? []}
              onSequenceAdd={(dialogFormData) => {
                dispatch(
                  updateScreenData({
                    sequences: compact(
                      concat(activeScreen.sequences, {
                        // Add new sequence object
                        ...dialogFormData,
                        top: 17,
                        left: 17,
                      })
                    ),
                  })
                );
              }}
              onSequenceEdit={(sequenceIndexToEdit, dialogFormData) => {
                dispatch(
                  updateScreenData({
                    sequences: activeScreen.sequences?.map((seq, seqIndex) =>
                      seqIndex === sequenceIndexToEdit
                        ? { ...seq, ...dialogFormData }
                        : seq
                    ),
                  })
                );
              }}
              onSequenceDelete={(sequenceIndexToDelete) => {
                dispatch(
                  updateScreenData({
                    sequences: activeScreen.sequences?.filter(
                      (_seq, seqIndex) => sequenceIndexToDelete !== seqIndex
                    ),
                  })
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sequence;
