import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import ImageBox from "components/editors/ImageBox";
import InfopointsTable from "components/editors/InfopointsTable";

// Models
import { GameSizingScreen, File as IndihuFile } from "models";
import { AppDispatch } from "store/store";

// Actions and utils
import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions";
import { compact, concat } from "lodash";

// - -

type ImagesProps = {
  activeScreen: GameSizingScreen;
};

const Images = ({ activeScreen }: ImagesProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.gameSizingScreen",
  });

  const image1 = dispatch(getFileById(activeScreen.image1));
  const image2 = dispatch(getFileById(activeScreen.image2));
  const image3 = dispatch(getFileById(activeScreen.image3));

  const setImage1 = (img: IndihuFile) => {
    dispatch(updateScreenData({ image1: img.id }));
  };

  const setImage2 = (img: IndihuFile) => {
    dispatch(updateScreenData({ image2: img.id }));
  };

  const setImage3 = (img: IndihuFile) => {
    dispatch(updateScreenData({ image3: img.id }));
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="screen-two-cols">
          <div className="flex-row-nowrap one-image-row">
            <ImageBox
              title={t("imageReferenceLabel")}
              image={image1}
              setImage={setImage1}
              onDelete={() =>
                dispatch(
                  updateScreenData({ image1: null, image1OrigData: null })
                )
              }
              onLoad={(width, height) =>
                dispatch(
                  updateScreenData({ image1OrigData: { width, height } })
                )
              }
              helpIconId="editor-game-sizing-image1"
              helpIconLabel={t("imageReferenceTooltip")}
            />
          </div>
          <div className="flex-row-nowrap one-image-row">
            <ImageBox
              title={t("imageCompareLabel")}
              image={image2}
              setImage={setImage2}
              onDelete={() =>
                dispatch(
                  updateScreenData({ image2: null, image2OrigData: null })
                )
              }
              onLoad={(width, height) =>
                dispatch(
                  updateScreenData({ image2OrigData: { width, height } })
                )
              }
              helpIconId="editor-game-sizing-image2"
              helpIconLabel={t("imageCompareTooltip")}
            />
          </div>
        </div>

        <div className="flex-row-nowrap flex-centered full-width">
          <div className="flex-row-nowrap one-image-row">
            <ImageBox
              title={t("imageResultLabel")}
              image={image3}
              setImage={setImage3}
              onDelete={() =>
                dispatch(
                  updateScreenData({ image3: null, image3OrigData: null })
                )
              }
              onLoad={(width, height) =>
                dispatch(
                  updateScreenData({ image3OrigData: { width, height } })
                )
              }
              helpIconId="editor-game-sizing-image3"
              helpIconLabel={t("imageResultTooltip")}
              infopoints={activeScreen.infopoints3 ?? []}
              onInfopointMove={(movedInfopointIdx, newLeft, newTop) => {
                dispatch(
                  updateScreenData({
                    infopoints3: activeScreen.infopoints3?.map((ip, ipIdx) =>
                      ipIdx === movedInfopointIdx
                        ? { ...ip, left: newLeft, top: newTop }
                        : ip
                    ),
                  })
                );
              }}
            />
          </div>
        </div>

        {/* Infopoints Table */}
        {image3 && (
          <div className="w-[45%]">
            <InfopointsTable
              title={t("resultInfopointsTableTitle")}
              infopoints={activeScreen.infopoints3 ?? []}
              onInfopointAdd={(dialogFormData) => {
                dispatch(
                  updateScreenData({
                    infopoints3: compact(
                      concat(activeScreen.infopoints3 ?? [], {
                        // Add new infopoints object
                        ...dialogFormData,
                        left: 17,
                        top: 17,
                      })
                    ),
                  })
                );
              }}
              onInfopointEdit={(infopointIdxToEdit, dialogFormData) => {
                dispatch(
                  updateScreenData({
                    infopoints3: activeScreen.infopoints3?.map((ip, ipIdx) =>
                      ipIdx === infopointIdxToEdit
                        ? { ...ip, ...dialogFormData }
                        : ip
                    ),
                  })
                );
              }}
              onInfopointDelete={(infopointIdxToDelete) => {
                dispatch(
                  updateScreenData({
                    infopoints3: activeScreen.infopoints3?.filter(
                      (_ip, ipIdx) => ipIdx !== infopointIdxToDelete
                    ),
                  })
                );
              }}
              onInfopointAlwaysVisibleChange={(
                infopointIdxToEdit,
                newIsAlwaysVisibleValue
              ) => {
                dispatch(
                  updateScreenData({
                    infopoints3: activeScreen.infopoints3?.map((ip, ipIdx) =>
                      ipIdx === infopointIdxToEdit
                        ? { ...ip, alwaysVisible: newIsAlwaysVisibleValue }
                        : ip
                    ),
                  })
                );
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Images;
