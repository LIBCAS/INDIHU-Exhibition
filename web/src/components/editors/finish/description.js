import { connect } from "react-redux";
import { compose, withState } from "recompose";
import { TextField, FontIcon, Button } from "react-md";

import { setDialog } from "../../../actions/dialog-actions";
import { getFileById } from "../../../actions/file-actions";
import HelpIcon from "../../help-icon";

import { helpIconText } from "../../../enums/text";

const Description = ({
  activeScreen,
  updateScreenData,
  setDialog,
  getFileById,
}) => {
  const image = getFileById(activeScreen.image);

  const setImage = (image) => {
    updateScreenData({ image: image.id });
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="description-container">
          <div className="part margin-horizontal">
            <div className="row flex-centered">
              <TextField
                id="screen-start-textfield-image"
                label="Obrázek na pozadí"
                value={image ? image.name : ""}
                disabled
              />
              {image && (
                <img
                  src={`/api/files/${image.fileId}`}
                  onLoad={({ target: img }) => {
                    updateScreenData({
                      imageOrigData: {
                        width: img.width,
                        height: img.height,
                      },
                    });
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
                      setDialog("ConfirmDialog", {
                        title: (
                          <FontIcon className="color-black">delete</FontIcon>
                        ),
                        text: "Opravdu chcete odstranit obrázek?",
                        onSubmit: () => updateScreenData({ image: null }),
                      })
                    }
                  >
                    delete
                  </FontIcon>
                )}
                <Button
                  raised
                  label="vybrat"
                  onClick={() =>
                    setDialog("ScreenFileChoose", {
                      onChoose: setImage,
                      typeMatch: new RegExp(/^image\/.*$/),
                      accept: "image/*",
                    })
                  }
                />
                <HelpIcon
                  {...{
                    label: helpIconText.EDITOR_START_DESCRIPTION_IMAGE,
                    id: "editor-start-description-image",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default compose(
  connect(null, { setDialog, getFileById }),
  withState("error", "setError", null)
)(Description);
