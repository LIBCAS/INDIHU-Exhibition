import { useDispatch } from "react-redux";

import SelectField from "react-md/lib/SelectFields";
import ImageBox from "components/editors/ImageBox";

import { GameWipeScreen, File as IndihuFile, EraserToolType } from "models";
import { AppDispatch } from "store/store";

import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions";
import { helpIconText } from "enums/text";
import { dispatch } from "index";

// - -

type ImagesProps = {
  activeScreen: GameWipeScreen;
};

const Images = ({ activeScreen }: ImagesProps) => {
  const dispatch = useDispatch<AppDispatch>();

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
          <div className="w-[250px]">
            <EraseToolSelect activeScreen={activeScreen} />
          </div>
        </div>
        <div className="w-full flex flex-col justify-around items-center gap-2 lg:flex-row">
          <div className="flex-row-nowrap one-image-row">
            <ImageBox
              title="Vrchní obrázek"
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
              helpIconLabel={helpIconText.EDITOR_GAME_WIPE_IMAGE1}
              helpIconId="editor-game-wipe-image1"
            />
          </div>

          <div className="flex-row-nowrap one-image-row">
            <ImageBox
              title="Spodní obrázek"
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
              helpIconLabel={helpIconText.EDITOR_GAME_WIPE_IMAGE2}
              helpIconId="editor-game-wipe-image2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Images;

// - - -

type EraseToolSelectProps = { activeScreen: GameWipeScreen };

const EraseToolSelect = ({ activeScreen }: EraseToolSelectProps) => {
  return (
    <SelectField
      menuItems={[
        {
          label: "Guma 1",
          value: "eraser1",
        },
        {
          label: "Guma 2",
          value: "eraser2",
        },
        {
          label: "Guma 3",
          value: "eraser3",
        },
        {
          label: "Guma 4",
          value: "eraser4",
        },
      ]}
      itemLabel="label"
      itemValue="value"
      label="Vyberte si gumovací nástroj"
      position="below"
      id="erase-tool-select"
      defaultValue={activeScreen.eraserToolType ?? "eraser1"}
      onChange={(newEraserToolType: EraserToolType) => {
        dispatch(updateScreenData({ eraserToolType: newEraserToolType }));
      }}
      fullWidth
    />
  );
};
