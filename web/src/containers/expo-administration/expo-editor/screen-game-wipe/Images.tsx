import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import EraseToolSelect from "../screen-game-sizing/EraseToolSelect";
import ImageBox from "components/editors/ImageBox";
import InfopointsTable from "components/editors/InfopointsTable";

// Types
import { AppDispatch } from "store/store";
import { GameWipeScreen, File as IndihuFile } from "models";

// Utils
import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions";
import { compact, concat } from "lodash";

// - - - - - -

type ImagesProps = {
  activeScreen: GameWipeScreen;
};

const Images = ({ activeScreen }: ImagesProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.gameWipeScreen",
  });

  const image1File = dispatch(getFileById(activeScreen.image1));
  const image2File = dispatch(getFileById(activeScreen.image2));

  const setImage1File = (img: IndihuFile) => {
    dispatch(updateScreenData({ image1: img.id }));
  };

  const setImage2File = (img: IndihuFile) => {
    dispatch(updateScreenData({ image2: img.id }));
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="mt-4 mb-6 flex justify-start">
          <div className="w-[220px] mb-4">
            <EraseToolSelect activeScreen={activeScreen} />
          </div>
        </div>

        <div className="w-full flex flex-col justify-start items-center gap-12 xl:flex-row xl:justify-around xl:items-start xl:gap-8">
          <div className="flex flex-col gap-4">
            <ImageBox
              title={t("upperImageLabel")}
              image={image1File}
              setImage={setImage1File}
              onDelete={() => {
                dispatch(
                  updateScreenData({ image1: null, image1OrigData: null })
                );
              }}
              onLoad={(width, height) => {
                dispatch(
                  updateScreenData({ image1OrigData: { width, height } })
                );
              }}
              helpIconLabel={t("upperImageTooltip")}
              helpIconId="editor-game-wipe-image1"
              infopoints={activeScreen.infopoints1 ?? []}
              onInfopointMove={(
                movedInfopointIndex,
                newLeftPosition,
                newTopPosition
              ) => {
                dispatch(
                  updateScreenData({
                    infopoints1: activeScreen.infopoints1?.map((ip, ipIdx) =>
                      ipIdx === movedInfopointIndex
                        ? { ...ip, left: newLeftPosition, top: newTopPosition }
                        : ip
                    ),
                  })
                );
              }}
              infopointTooltipId="image1-infopoint"
            />

            <InfopointsTable
              key="infopoints-table-image1"
              title={t("upperImageInfopointsTableLabel")}
              infopoints={activeScreen.infopoints1 ?? []}
              onInfopointAdd={(dialogFormData) => {
                dispatch(
                  updateScreenData({
                    infopoints1: compact(
                      concat(activeScreen.infopoints1 ?? [], {
                        // Add new infopoint object
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
                    infopoints1: activeScreen.infopoints1?.map((ip, ipIdx) =>
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
                    infopoints1: activeScreen.infopoints1?.filter(
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
                    infopoints1: activeScreen.infopoints1?.map((ip, ipIdx) =>
                      ipIdx === infopointIdxToEdit
                        ? { ...ip, alwaysVisible: newIsAlwaysVisibleValue }
                        : ip
                    ),
                  })
                );
              }}
            />
          </div>

          <div className="flex flex-col gap-4">
            <ImageBox
              title={t("bottomImageLabel")}
              image={image2File}
              setImage={setImage2File}
              onDelete={() => {
                dispatch(
                  updateScreenData({ image2: null, image2OrigData: null })
                );
              }}
              onLoad={(width, height) => {
                dispatch(
                  updateScreenData({ image2OrigData: { width, height } })
                );
              }}
              helpIconLabel={t("bottomImageTooltip")}
              helpIconId="editor-game-wipe-image2"
              infopoints={activeScreen.infopoints2 ?? []}
              onInfopointMove={(
                movedInfopointIndex,
                newLeftPosition,
                newTopPosition
              ) => {
                dispatch(
                  updateScreenData({
                    infopoints2: activeScreen.infopoints2?.map((ip, ipIdx) =>
                      ipIdx === movedInfopointIndex
                        ? { ...ip, left: newLeftPosition, top: newTopPosition }
                        : ip
                    ),
                  })
                );
              }}
              infopointTooltipId="image2-infopoint"
            />

            <InfopointsTable
              key="infopoints-table-image2"
              title={t("bottomImageInfopointsTableLabel")}
              infopoints={activeScreen.infopoints2 ?? []}
              onInfopointAdd={(dialogFormData) => {
                dispatch(
                  updateScreenData({
                    infopoints2: compact(
                      concat(activeScreen.infopoints2 ?? [], {
                        // Add new infopoint object
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
                    infopoints2: activeScreen.infopoints2?.map((ip, ipIdx) =>
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
                    infopoints2: activeScreen.infopoints2?.filter(
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
                    infopoints2: activeScreen.infopoints2?.map((ip, ipIdx) =>
                      ipIdx === infopointIdxToEdit
                        ? { ...ip, alwaysVisible: newIsAlwaysVisibleValue }
                        : ip
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

export default Images;
