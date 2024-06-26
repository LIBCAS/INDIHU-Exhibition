import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import Checkbox from "react-md/lib/SelectionControls/Checkbox";
import ImageBox from "components/editors/ImageBox";
import HelpIcon from "components/help-icon";

// Models
import { GameDrawScreen, File as IndihuFile } from "models";
import { AppDispatch } from "store/store";

// Actions and utils
import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions";

// - -

type ImagesProps = {
  activeScreen: GameDrawScreen;
};

const Images = ({ activeScreen }: ImagesProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.gameDrawScreen",
  });

  const image1 = dispatch(getFileById(activeScreen.image1));
  const image2 = dispatch(getFileById(activeScreen.image2));

  const setImage1 = (img: IndihuFile) => {
    dispatch(updateScreenData({ image1: img.id }));
  };

  const setImage2 = (img: IndihuFile) => {
    dispatch(updateScreenData({ image2: img.id }));
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
              helpIconId="editor-game-draw-image1"
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
              helpIconId="editor-game-draw-image2"
              helpIconLabel={t("imageResultTooltip")}
            />
          </div>
        </div>
        <div className="flex-row-nowrap flex-centered full-width">
          <Checkbox
            id="game-draw-checkbox-show-user"
            name="simple-checkboxes"
            label={t("showUsersDrawing")}
            value={activeScreen.showDrawing}
            onChange={(value: boolean) =>
              dispatch(updateScreenData({ showDrawing: value }))
            }
          />
          <HelpIcon
            label={t("showUsersDrawingTooltip")}
            id="editor-game-draw-show-drawing"
          />
        </div>
      </div>
    </div>
  );
};

export default Images;
