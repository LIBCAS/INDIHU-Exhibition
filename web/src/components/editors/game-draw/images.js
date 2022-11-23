import { connect } from "react-redux";
import { compose } from "recompose";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";

import Image from "../image";
import HelpIcon from "../../help-icon";

import { setDialog } from "../../../actions/dialog-actions";
import { getFileById } from "../../../actions/file-actions";
import { updateScreenData } from "../../../actions/expoActions";

import { helpIconText } from "../../../enums/text";

const Images = ({ activeScreen, getFileById, updateScreenData }) => {
  const image1 = activeScreen.image1 ? getFileById(activeScreen.image1) : null;
  const image2 = activeScreen.image2 ? getFileById(activeScreen.image2) : null;

  const setImage1 = (image1) => {
    updateScreenData({ image1: image1.id });
  };
  const setImage2 = (image2) => {
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
                      height,
                    },
                  }),
                helpIconLabel: helpIconText.EDITOR_GAME_DRAW_IMAGE1,
                id: "editor-game-draw-image1",
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
                      height,
                    },
                  }),
                helpIconLabel: helpIconText.EDITOR_GAME_DRAW_IMAGE2,
                id: "editor-game-draw-image2",
              }}
            />
          </div>
        </div>
        <div className="flex-row-nowrap flex-centered full-width">
          <Checkbox
            id="game-draw-checkbox-show-user"
            name="simple-checkboxes"
            label="Zobrazit uživatelovu kresbu"
            value={activeScreen.showDrawing}
            onChange={(value) => updateScreenData({ showDrawing: value })}
          />
          <HelpIcon
            {...{
              label: helpIconText.EDITOR_GAME_DRAW_SHOW_DRAWING,
              id: "editor-game-draw-show-drawing",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default compose(
  connect(null, {
    setDialog,
    getFileById,
    updateScreenData,
  })
)(Images);
