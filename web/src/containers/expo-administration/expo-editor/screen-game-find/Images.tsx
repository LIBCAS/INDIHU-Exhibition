import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { useNumberOfPinsListener } from "./useNumberOfPinsListener";

// Components
import Checkbox from "react-md/lib/SelectionControls/Checkbox";
import ImageBox from "components/editors/ImageBox";
import HelpIcon from "components/help-icon";

import { NumberOfPinsField } from "./NumberOfPinsField";
import { PinTextField } from "./PinTextField";

// Models
import { GameFindScreen, File as IndihuFile } from "models";
import { AppDispatch } from "store/store";

// Actions and utils
import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions";
import { GAME_FIND_DEFAULT_NUMBER_OF_PINS } from "constants/screen";

// - -

type ImagesProps = {
  activeScreen: GameFindScreen;
};

const Images = ({ activeScreen }: ImagesProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.gameFindScreen",
  });

  const { numberOfPins = GAME_FIND_DEFAULT_NUMBER_OF_PINS, pinsTexts } =
    activeScreen;

  const image1 = dispatch(getFileById(activeScreen.image1));
  const image2 = dispatch(getFileById(activeScreen.image2));

  const setImage1 = (img: IndihuFile) => {
    dispatch(updateScreenData({ image1: img.id }));
  };

  const setImage2 = (img: IndihuFile) => {
    dispatch(updateScreenData({ image2: img.id }));
  };

  //
  useNumberOfPinsListener(activeScreen);

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
              helpIconId="editor-game-find-image1"
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
              helpIconId="editor-game-find-image2"
              helpIconLabel={t("imageResultTooltip")}
            />
          </div>
        </div>

        <div className="flex-row-nowrap flex-centered full-width">
          <Checkbox
            id="game-find-checkbox-show-user"
            name="simple-checkboxes"
            label={t("showUsersTip")}
            checked={activeScreen.showTip ?? false}
            onChange={(value: boolean) =>
              dispatch(updateScreenData({ showTip: value }))
            }
          />
          <HelpIcon
            label={t("showUsersTipTooltip")}
            id="editor-game-find-show-tip"
          />
        </div>

        {/* Pins */}
        <div className="ml-10 mt-6 flex flex-col justify-center items-start gap-4">
          <div className="w-48">
            <NumberOfPinsField numberOfPinsValue={numberOfPins} />
          </div>

          <div className="ml-5 flex flex-col justify-center items-center gap-2">
            {pinsTexts?.map((pinText: string, index: number) => {
              if (index >= numberOfPins) {
                return null;
              }

              const onPinTextUpdate = (newPinText: string) =>
                dispatch(
                  updateScreenData({
                    pinsTexts: pinsTexts.map((pinText, idx) =>
                      index === idx ? newPinText : pinText
                    ),
                  })
                );

              return (
                <PinTextField
                  key={index}
                  pinTextValue={pinText}
                  index={index}
                  onPinTextUpdate={onPinTextUpdate}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Images;
