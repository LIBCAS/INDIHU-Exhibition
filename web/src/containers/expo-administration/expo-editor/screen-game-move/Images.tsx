import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import Button from "react-md/lib/Buttons/Button";
import FontIcon from "react-md/lib/FontIcons";
import TextField from "react-md/lib/TextFields";
import ImageBox from "components/editors/ImageBox";
import HelpIcon from "components/help-icon";

import ObjectImagePreview from "./ObjectImagePreview";
import InfopointsTable from "components/editors/InfopointsTable";

// Models
import { GameMoveScreen, File as IndihuFile } from "models";
import { AppDispatch } from "store/store";

// Actions and utils
import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions";
import { setDialog } from "actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";
import { compact, concat } from "lodash";

// - -

type ImagesProps = {
  activeScreen: GameMoveScreen;
};

const Images = ({ activeScreen }: ImagesProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.gameMoveScreen",
  });

  // - - - Assignment image - - -

  const assignmentImageFile = dispatch(getFileById(activeScreen.image1));

  const setAssignmentImageFile = (img: IndihuFile) => {
    dispatch(updateScreenData({ image1: img.id }));
  };

  // - - - Result image - - -

  const image2 = dispatch(getFileById(activeScreen.image2));

  const setImage2 = (img: IndihuFile) => {
    dispatch(updateScreenData({ image2: img.id }));
  };

  // - - - Object image 1 - - -

  const objectFile = dispatch(getFileById(activeScreen.object));

  const setObjectFile = useCallback(
    (img: IndihuFile) => {
      dispatch(updateScreenData({ object: img.id }));
    },
    [dispatch]
  );

  const initializeObjectFile = useCallback(
    (width: number, height: number) => {
      dispatch(
        updateScreenData({
          objectOrigData: {
            width: width,
            height: height,
          },
        })
      );
    },
    [dispatch]
  );

  const resetObjectFile = useCallback(() => {
    dispatch(
      updateScreenData({
        object: null,
        objectOrigData: null,
        objectPositionProps: null,
        objectSizeProps: null,
      })
    );
  }, [dispatch]);

  // - - - Object image 2 - - -

  const object2File = dispatch(getFileById(activeScreen.object2));

  const setObject2File = useCallback(
    (img: IndihuFile) => {
      dispatch(updateScreenData({ object2: img.id }));
    },
    [dispatch]
  );

  const initializeObject2File = useCallback(
    (width: number, height: number) => {
      dispatch(
        updateScreenData({
          object2OrigData: {
            width: width,
            height: height,
          },
        })
      );
    },
    [dispatch]
  );

  const resetObject2File = useCallback(() => {
    dispatch(
      updateScreenData({
        object2: null,
        object2OrigData: null,
        object2PositionProps: null,
        object2SizeProps: null,
      })
    );
  }, [dispatch]);

  // - - - Object image 3 - - -

  const object3File = dispatch(getFileById(activeScreen.object3));

  const setObject3File = useCallback(
    (img: IndihuFile) => {
      dispatch(updateScreenData({ object3: img.id }));
    },
    [dispatch]
  );

  const initializeObject3File = useCallback(
    (width: number, height: number) => {
      dispatch(
        updateScreenData({
          object3OrigData: {
            width: width,
            height: height,
          },
        })
      );
    },
    [dispatch]
  );

  const resetObject3File = useCallback(() => {
    dispatch(
      updateScreenData({
        object3: null,
        object3OrigData: null,
        object3PositionProps: null,
        object3SizeProps: null,
      })
    );
  }, [dispatch]);

  // - - - GUI - - -

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="screen-two-cols">
          <div className="flex-row-nowrap one-image-row">
            <ImageBox
              title={t("imageAssignmentLabel")}
              image={assignmentImageFile}
              setImage={setAssignmentImageFile}
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
              helpIconId="editor-game-move-image1"
              helpIconLabel={t("imageAssignmentTooltip")}
            />
          </div>

          <div className="flex-row-nowrap one-image-row">
            <ImageBox
              title={t("imageResultLabel")}
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
              helpIconId="editor-game-move-image2"
              helpIconLabel={t("imageResultTooltip")}
              infopoints={activeScreen.image2Infopoints ?? []}
              onInfopointMove={(movedInfopointIdx, newLeft, newTop) => {
                dispatch(
                  updateScreenData({
                    image2Infopoints: activeScreen.image2Infopoints?.map(
                      (ip, ipIdx) =>
                        ipIdx === movedInfopointIdx
                          ? { ...ip, left: newLeft, top: newTop }
                          : ip
                    ),
                  })
                );
              }}
              infopointTooltipId="result-image-infopoint"
            />
          </div>
        </div>

        <ObjectImagePanel
          objectFile={objectFile}
          objectOrder={1}
          onObjectChoose={setObjectFile}
          onObjectDelete={resetObjectFile}
        />

        <ObjectImagePanel
          objectFile={object2File}
          objectOrder={2}
          onObjectChoose={setObject2File}
          onObjectDelete={resetObject2File}
        />

        <ObjectImagePanel
          objectFile={object3File}
          objectOrder={3}
          onObjectChoose={setObject3File}
          onObjectDelete={resetObject3File}
        />

        {objectFile && (
          <img
            src={`/api/files/${objectFile.fileId}`}
            onLoad={(e) => {
              const imgEl = e.currentTarget;
              initializeObjectFile(imgEl.width, imgEl.height);
            }}
            className="hidden"
            alt="hidden-object1-file"
          />
        )}

        {object2File && (
          <img
            src={`/api/files/${object2File.fileId}`}
            onLoad={(e) => {
              const imgEl = e.currentTarget;
              initializeObject2File(imgEl.width, imgEl.height);
            }}
            className="hidden"
            alt="hidden-object2-file"
          />
        )}

        {object3File && (
          <img
            src={`/api/files/${object3File.fileId}`}
            onLoad={(e) => {
              const imgEl = e.currentTarget;
              initializeObject3File(imgEl.width, imgEl.height);
            }}
            className="hidden"
            alt="hidden-object3-file"
          />
        )}

        {assignmentImageFile && (
          <ObjectImagePreview
            activeScreen={activeScreen}
            image1Src={`/api/files/${assignmentImageFile.fileId}`}
            objectImgSrc={objectFile ? `/api/files/${objectFile.fileId}` : null}
            object2ImgSrc={
              object2File ? `/api/files/${object2File.fileId}` : null
            }
            object3ImgSrc={
              object3File ? `/api/files/${object3File.fileId}` : null
            }
          />
        )}

        {/* Result Image Infopoints Table */}
        {image2 && (
          <div className="w-full flex justify-center items-center mb-16">
            <div className="w-[45%]">
              <InfopointsTable
                title={t("imageResultInfopointsTableTitle")}
                infopoints={activeScreen.image2Infopoints ?? []}
                onInfopointAdd={(dialogFormData) => {
                  dispatch(
                    updateScreenData({
                      image2Infopoints: compact(
                        concat(activeScreen.image2Infopoints ?? [], {
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
                      image2Infopoints: activeScreen.image2Infopoints?.map(
                        (ip, ipIdx) =>
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
                      image2Infopoints: activeScreen.image2Infopoints?.filter(
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
                      image2Infopoints: activeScreen.image2Infopoints?.map(
                        (ip, ipIdx) =>
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
        )}
      </div>
    </div>
  );
};

export default Images;

// - - - - - -

type ObjectImagePanelProps = {
  objectFile: IndihuFile | null;
  objectOrder: number;
  onObjectChoose: (file: IndihuFile) => void;
  onObjectDelete: () => void;
};

const ObjectImagePanel = ({
  objectFile,
  objectOrder,
  onObjectChoose,
  onObjectDelete,
}: ObjectImagePanelProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.gameMoveScreen",
  });

  return (
    <div className="flex-row-nowrap flex-centered full-width">
      <div>{`${t("object")} ${objectOrder}`}</div>

      <FontIcon className="small-margin">image</FontIcon>
      <TextField
        id="screen-game-move-textfield-music"
        value={objectFile ? objectFile.name : ""}
        disabled
      />

      <div className="row flex-centered">
        {objectFile && (
          <FontIcon
            className="icon"
            onClick={() =>
              dispatch(
                setDialog(DialogType.ConfirmDialog, {
                  title: <FontIcon className="color-black">delete</FontIcon>,
                  text: "Opravdu chcete odstranit objekt?",
                  onSubmit: () => onObjectDelete(),
                })
              )
            }
          >
            delete
          </FontIcon>
        )}
        <Button
          raised
          label={t("objectSelectLabel")}
          onClick={() =>
            dispatch(
              setDialog(DialogType.ScreenFileChoose, {
                onChoose: onObjectChoose,
                typeMatch: new RegExp(/^image\/.*$/),
                accept: "image/*",
              })
            )
          }
          className={!objectFile ? "margin-left-small" : undefined}
        />
        <HelpIcon label={t("objectTooltip")} id="editor-game-move-object" />
      </div>
    </div>
  );
};
