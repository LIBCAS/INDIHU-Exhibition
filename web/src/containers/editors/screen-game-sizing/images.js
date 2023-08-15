import { connect } from "react-redux";
import { compose } from "recompose";

import Image from "../../../components/editors/image";

import { setDialog } from "../../../actions/dialog-actions";
import { getFileById } from "../../../actions/file-actions";
import { updateScreenData } from "../../../actions/expoActions";
import { helpIconText } from "../../../enums/text";

const Images = ({ activeScreen, getFileById, updateScreenData }) => {
  const image1 = activeScreen.image1 ? getFileById(activeScreen.image1) : null;
  const image2 = activeScreen.image2 ? getFileById(activeScreen.image2) : null;
  const image3 = activeScreen.image3 ? getFileById(activeScreen.image3) : null;

  const setImage1 = (image1) => {
    updateScreenData({ image1: image1.id });
  };
  const setImage2 = (image2) => {
    updateScreenData({ image2: image2.id });
  };
  const setImage3 = (image3) => {
    updateScreenData({ image3: image3.id });
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="screen-two-cols">
          <div className="flex-row-nowrap one-image-row">
            <Image
              {...{
                title: "Obrázek referenčního předmětu",
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
                helpIconLabel: helpIconText.EDITOR_GAME_SIZING_IMAGE1,
                id: "editor-game-sizing-image1",
              }}
            />
          </div>
          <div className="flex-row-nowrap one-image-row">
            <Image
              {...{
                title: "Obrázek porovnávaného předmětu",
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
                helpIconLabel: helpIconText.EDITOR_GAME_SIZING_IMAGE2,
                id: "editor-game-sizing-image2",
              }}
            />
          </div>
        </div>
        <div className="flex-row-nowrap flex-centered full-width">
          <div className="flex-row-nowrap one-image-row">
            <Image
              {...{
                title: "Výsledný obrázek",
                image: image3,
                setImage: setImage3,
                onDelete: () =>
                  updateScreenData({ image3: null, image3OrigData: null }),
                onLoad: (width, height) =>
                  updateScreenData({
                    image3OrigData: {
                      width,
                      height,
                    },
                  }),
                helpIconLabel: helpIconText.EDITOR_GAME_SIZING_IMAGE3,
                id: "editor-game-sizing-image3",
              }}
            />
          </div>
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
