import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import Button from "react-md/lib/Buttons/Button";
import FontIcon from "react-md/lib/FontIcons";
import TextField from "react-md/lib/TextFields";

import Image from "../Image";
import HelpIcon from "../../HelpIcon";

import { setDialog } from "../../../actions/dialogActions";
import { getFileById } from "../../../actions/fileActions";
import { updateScreenData } from "../../../actions/expoActions";

import { helpIconText } from "../../../enums/text";

const Images = ({ activeScreen, setDialog, getFileById, updateScreenData }) => {
  const image1 = activeScreen.image1 ? getFileById(activeScreen.image1) : null;
  const image2 = activeScreen.image2 ? getFileById(activeScreen.image2) : null;
  const object = activeScreen.object ? getFileById(activeScreen.object) : null;

  const setImage1 = image1 => {
    updateScreenData({ image1: image1.id });
  };
  const setImage2 = image2 => {
    updateScreenData({ image2: image2.id });
  };
  const setObject = object => {
    updateScreenData({ object: object.id });
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="screen-two-cols">
          <div className="flex-row-nowrap one-image-row">
            <Image
              {...{
                title: "Zadání",
                image: image1,
                setImage: setImage1,
                onDelete: () =>
                  updateScreenData({ image1: null, image1OrigData: null }),
                onLoad: (width, height) =>
                  updateScreenData({
                    image1OrigData: {
                      width,
                      height
                    }
                  }),
                helpIconLabel: helpIconText.EDITOR_GAME_MOVE_IMAGE1,
                id: "editor-game-move-image1"
              }}
            />
          </div>
          <div className="flex-row-nowrap one-image-row">
            <Image
              {...{
                title: "Výsledek",
                image: image2,
                setImage: setImage2,
                onDelete: () =>
                  updateScreenData({ image2: null, image2OrigData: null }),
                onLoad: (width, height) =>
                  updateScreenData({
                    image2OrigData: {
                      width,
                      height
                    }
                  }),
                helpIconLabel: helpIconText.EDITOR_GAME_MOVE_IMAGE2,
                id: "editor-game-move-image2"
              }}
            />
          </div>
        </div>
        <div className="flex-row-nowrap flex-centered full-width">
          Objekt
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
                  setDialog("ConfirmDialog", {
                    title: <FontIcon className="color-black">delete</FontIcon>,
                    text: "Opravdu chcete odstranit objekt?",
                    onSubmit: () =>
                      updateScreenData({ object: null, objectOrigData: null })
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
                  onChoose: setObject,
                  typeMatch: new RegExp(/^image\/.*$/),
                  accept: "image/*"
                })
              }
              className={!object ? "margin-left-small" : undefined}
            />
            <HelpIcon
              {...{
                label: helpIconText.EDITOR_GAME_MOVE_OBJECT,
                id: "editor-game-move-object"
              }}
            />
          </div>
        </div>
        {object && (
          <img
            src={`/api/files/${object.fileId}`}
            onLoad={({ target: img }) => {
              updateScreenData({
                objectOrigData: {
                  width: img.width,
                  height: img.height
                }
              });
            }}
            className="hidden"
            alt=""
          />
        )}
      </div>
    </div>
  );
};

export default compose(
  connect(
    null,
    {
      setDialog,
      getFileById,
      updateScreenData
    }
  )
)(Images);
