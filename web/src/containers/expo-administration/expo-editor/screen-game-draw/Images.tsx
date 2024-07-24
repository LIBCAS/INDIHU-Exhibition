import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import Button from "react-md/lib/Buttons/Button";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";
import ImageBox from "components/editors/ImageBox";
import HelpIcon from "components/help-icon";

// Models
import { GameDrawScreen, File as IndihuFile } from "models";
import { AppDispatch } from "store/store";

// Actions and utils
import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions";
import {
  GAME_DRAW_DEFAULT_COLOR,
  GAME_DRAW_DEFAULT_THICKNESS,
} from "constants/screen";

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

  const resetInitialDrawingSettings = useCallback(() => {
    dispatch(
      updateScreenData({
        initialColor: GAME_DRAW_DEFAULT_COLOR,
        initialThickness: GAME_DRAW_DEFAULT_THICKNESS,
      })
    );
  }, [dispatch]);

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
            checked={activeScreen.showDrawing ?? false}
            onChange={(value: boolean) =>
              dispatch(updateScreenData({ showDrawing: value }))
            }
          />
          <HelpIcon
            label={t("showUsersDrawingTooltip")}
            id="editor-game-draw-show-drawing"
          />
        </div>

        {/* Initial settings (color and thickness) */}
        <div className="mt-6 mb-1">
          <div className="text-lg">{t("initialDrawingSettingsTitle")}</div>

          <div className="flex flex-col gap-1 w-fit">
            <div className="flex items-center gap-3">
              <div>{t("initialDrawingColorLabel")}</div>
              <input
                type="color"
                className="hover:cursor-pointer"
                defaultValue={
                  activeScreen.initialColor ?? GAME_DRAW_DEFAULT_COLOR
                }
                onChange={(e) => {
                  const newInitialColor = e.target.value;
                  dispatch(updateScreenData({ initialColor: newInitialColor }));
                }}
              />
              <div>
                ({activeScreen.initialColor ?? GAME_DRAW_DEFAULT_COLOR})
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div>{t("initialDrawingThicknessLabel")}</div>
              <input
                type="range"
                draggable={false}
                min={1}
                max={50}
                defaultValue={
                  activeScreen.initialThickness ?? GAME_DRAW_DEFAULT_THICKNESS
                }
                onChange={(e) => {
                  const newInitialThickness = parseInt(e.target.value);
                  dispatch(
                    updateScreenData({
                      initialThickness: newInitialThickness,
                    })
                  );
                }}
              />
              <div>
                ({activeScreen.initialThickness ?? GAME_DRAW_DEFAULT_THICKNESS})
              </div>
            </div>

            <div className="mt-2">
              <Button
                raised
                label={t("resetInitialDrawingSettingsBtnLabel")}
                className="btn"
                onClick={resetInitialDrawingSettings}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Images;
