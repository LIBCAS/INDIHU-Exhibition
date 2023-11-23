import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

// Components
import { TextField, FontIcon, Button } from "react-md";
import HelpIcon from "components/help-icon";

// Models
import { FinishScreen, File as IndihuFile } from "models";
import { AppDispatch } from "store/store";

// Actions and utils
import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions/screen-actions";
import { setDialog } from "actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";

// - -

type DescriptionProps = {
  activeScreen: FinishScreen;
};

const Description = ({ activeScreen }: DescriptionProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor");

  const image = dispatch(getFileById(activeScreen.image));

  const setImage = (img: IndihuFile) => {
    dispatch(updateScreenData({ image: img.id }));
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="description-container">
          <div className="part margin-horizontal">
            <div className="row flex-centered">
              <TextField
                id="screen-start-textfield-image"
                label={t("descFields.backgroundImage")}
                value={image ? image.name : ""}
                disabled
              />
              {image && (
                <img
                  src={`/api/files/${image.fileId}`}
                  onLoad={(e) => {
                    const imgEl = e.currentTarget;
                    dispatch(
                      updateScreenData({
                        imageOrigData: {
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
              <div className="row flex-centered">
                {image && (
                  <FontIcon
                    className="icon"
                    onClick={() =>
                      dispatch(
                        setDialog(DialogType.ConfirmDialog, {
                          title: (
                            <FontIcon className="color-black">delete</FontIcon>
                          ),
                          text: "Opravdu chcete odstranit obrázek?",
                          onSubmit: () =>
                            dispatch(updateScreenData({ image: null })),
                        })
                      )
                    }
                  >
                    delete
                  </FontIcon>
                )}
                <Button
                  raised
                  label={t("descFields.backgroundImageSelectLabel")}
                  onClick={() =>
                    dispatch(
                      setDialog(DialogType.ScreenFileChoose, {
                        onChoose: setImage,
                        typeMatch: new RegExp(/^image\/.*$/),
                        accept: "image/*",
                      })
                    )
                  }
                />
                <HelpIcon
                  label={t("descFields.backgroundImageTooltip")}
                  id="editor-start-description-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;
