import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import SelectField from "react-md/lib/SelectFields";

// Types
import { AppDispatch } from "store/store";
import { ImageAnimationDirection, ImageAnimationScreen } from "models";
import { ImageAnimationDirectionEnum } from "enums/administration-screens";

// Utils
import { updateScreenData } from "actions/expoActions";
import { DEFAULT_IMAGE_ANIMATION_DIRECTION } from "../../default-values";

// - - - - - -

type Props = {
  activeScreen: ImageAnimationScreen;
  activeImgIndex: number;
};

const ImageAnimationDirectionSelectField = ({
  activeScreen,
  activeImgIndex,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.imageAnimationScreen",
  });

  return (
    <div className="w-full">
      <SelectField
        menuItems={[
          {
            label: "Todo - Without",
            value: ImageAnimationDirectionEnum.WITHOUT,
          },
          {
            label: "Todo - left to right",
            value: ImageAnimationDirectionEnum.FROM_LEFT_TO_RIGHT,
          },
          {
            label: "Todo - from right to left",
            value: ImageAnimationDirectionEnum.FROM_RIGHT_TO_LEFT,
          },
          {
            label: "Todo - from top",
            value: ImageAnimationDirectionEnum.FROM_TOP,
          },
          {
            label: "Todo - from bottom",
            value: ImageAnimationDirectionEnum.FROM_BOTTOM,
          },
        ]}
        itemLabel={"label"}
        itemValue={"value"}
        label={"TODO label"}
        position="below"
        id="image-animation-direction-selectfield"
        name="image-animation-direction-selectfield"
        defaultValue={
          activeScreen.images?.[activeImgIndex]?.animationDirection ??
          DEFAULT_IMAGE_ANIMATION_DIRECTION
        }
        onChange={(newValue: ImageAnimationDirection) => {
          dispatch(
            updateScreenData({
              images: activeScreen.images?.map((img, imgIdx) =>
                imgIdx === activeImgIndex
                  ? { ...img, animationDirection: newValue }
                  : img
              ),
            })
          );
        }}
        fullWidth
      />
    </div>
  );
};

export default ImageAnimationDirectionSelectField;
