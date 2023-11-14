import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import Button from "react-md/lib/Buttons/Button";
import FontIcon from "react-md/lib/FontIcons";
import TextField from "react-md/lib/TextFields";
import ImageBox from "components/editors/ImageBox";
import HelpIcon from "components/help-icon";

// Models
import { GameMoveScreen, File as IndihuFile } from "models";
import { AppDispatch } from "store/store";

// Actions and utils
import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions";
import { setDialog } from "actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";

// - -

type ImagesProps = {
  activeScreen: GameMoveScreen;
};

const Images = ({ activeScreen }: ImagesProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.gameMoveScreen",
  });

  const image1 = dispatch(getFileById(activeScreen.image1));
  const image2 = dispatch(getFileById(activeScreen.image2));
  const object = dispatch(getFileById(activeScreen.object));

  const setImage1 = (img: IndihuFile) => {
    dispatch(updateScreenData({ image1: img.id }));
  };

  const setImage2 = (img: IndihuFile) => {
    dispatch(updateScreenData({ image2: img.id }));
  };

  const setObject = (img: IndihuFile) => {
    dispatch(updateScreenData({ object: img.id }));
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="screen-two-cols">
          <div className="flex-row-nowrap one-image-row">
            <ImageBox
              title={t("imageAssignmentLabel")}
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
            />
          </div>
        </div>
        <div className="flex-row-nowrap flex-centered full-width">
          {t("object")}
          <FontIcon className="small-margin">image</FontIcon>
          <TextField
            id="screen-game-move-textfield-music"
            value={object ? object.name : ""}
            disabled
          />
          <div className="row flex-centered">
            {object && (
              <FontIcon
                className="icon"
                onClick={() =>
                  dispatch(
                    setDialog(DialogType.ConfirmDialog, {
                      title: (
                        <FontIcon className="color-black">delete</FontIcon>
                      ),
                      text: "Opravdu chcete odstranit objekt?",
                      onSubmit: () =>
                        dispatch(
                          updateScreenData({
                            object: null,
                            objectOrigData: null,
                          })
                        ),
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
                    onChoose: setObject,
                    typeMatch: new RegExp(/^image\/.*$/),
                    accept: "image/*",
                  })
                )
              }
              className={!object ? "margin-left-small" : undefined}
            />
            <HelpIcon label={t("objectTooltip")} id="editor-game-move-object" />
          </div>
        </div>
        {object && (
          <img
            src={`/api/files/${object.fileId}`}
            onLoad={(e) => {
              const imgEl = e.currentTarget;
              dispatch(
                updateScreenData({
                  objectOrigData: {
                    width: imgEl.width,
                    height: imgEl.height,
                  },
                })
              );
            }}
            className="hidden"
            alt=""
          />
        )}
      </div>
    </div>
  );
};

export default Images;
