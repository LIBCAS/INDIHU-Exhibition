import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";

import Image from "../Image";
import HelpIcon from "../../HelpIcon";

import { setDialog } from "../../../actions/dialogActions";
import { getFileById } from "../../../actions/fileActions";
import { updateScreenData } from "../../../actions/expoActions";

import { helpIconText } from "../../../enums/text";

const Images = ({ activeScreen, setDialog, getFileById, updateScreenData }) => {
  const image1 = activeScreen.image1 ? getFileById(activeScreen.image1) : null;
  const image2 = activeScreen.image2 ? getFileById(activeScreen.image2) : null;

  const setImage1 = image1 => {
    updateScreenData({ image1: image1.id });
  };
  const setImage2 = image2 => {
    updateScreenData({ image2: image2.id });
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
                helpIconLabel: helpIconText.EDITOR_GAME_FIND_IMAGE1,
                id: "editor-game-find-image1"
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
                helpIconLabel: helpIconText.EDITOR_GAME_FIND_IMAGE2,
                id: "editor-game-find-image2"
              }}
            />
          </div>
        </div>
        <div className="flex-row-nowrap flex-centered full-width">
          <Checkbox
            id="game-find-checkbox-show-user"
            name="simple-checkboxes"
            label="Zobrazit uživatelův tip"
            value={activeScreen.showTip}
            onChange={value => updateScreenData({ showTip: value })}
          />
          <HelpIcon
            {...{
              label: helpIconText.EDITOR_GAME_FIND_SHOW_TIP,
              id: "editor-game-find-show-tip"
            }}
          />
        </div>
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
