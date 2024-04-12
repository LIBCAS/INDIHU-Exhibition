import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import EraseToolSelect from "../screen-game-sizing/EraseToolSelect";
import ImageBox from "components/editors/ImageBox";

import { GameWipeScreen, File as IndihuFile } from "models";
import { AppDispatch } from "store/store";

import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions";

// - -

type ImagesProps = {
  activeScreen: GameWipeScreen;
};

const Images = ({ activeScreen }: ImagesProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.gameWipeScreen",
  });

  const image1File = activeScreen.image1
    ? dispatch(getFileById(activeScreen.image1))
    : null;

  const image2File = activeScreen.image2
    ? dispatch(getFileById(activeScreen.image2))
    : null;

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
        <div className="w-full flex flex-col justify-around items-center gap-2 lg:flex-row">
          <div className="flex-row-nowrap one-image-row">
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
            />
          </div>

          <div className="flex-row-nowrap one-image-row">
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Images;
