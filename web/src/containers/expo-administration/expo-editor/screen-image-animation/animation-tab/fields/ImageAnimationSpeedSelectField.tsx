import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import SelectField from "react-md/lib/SelectFields";

// Types
import { AppDispatch } from "store/store";
import { ImageAnimationSpeed, ImageAnimationScreen } from "models";
import { ImageAnimationSpeedEnum } from "enums/administration-screens";

// Utils
import { updateScreenData } from "actions/expoActions";
import { DEFAULT_IMAGE_ANIMATION_SPEED } from "../../default-values";

// - - - - - -

type Props = {
  activeScreen: ImageAnimationScreen;
  activeImgIndex: number;
};

const ImageAnimationSpeedSelectField = ({
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
            label: "Todo - Slow",
            value: ImageAnimationSpeedEnum.SLOW,
          },
          {
            label: "Todo - Medium",
            value: ImageAnimationSpeedEnum.MEDIUM,
          },
          {
            label: "Todo - Fast",
            value: ImageAnimationSpeedEnum.FAST,
          },
        ]}
        itemLabel={"label"}
        itemValue={"value"}
        label={"TODO label"}
        position="below"
        id="image-animation-speed-selectfield"
        name="image-animation-speed-selectfield"
        defaultValue={
          activeScreen.images?.[activeImgIndex]?.animationSpeed ??
          DEFAULT_IMAGE_ANIMATION_SPEED
        }
        onChange={(newValue: ImageAnimationSpeed) => {
          dispatch(
            updateScreenData({
              images: activeScreen.images?.map((img, imgIdx) =>
                imgIdx === activeImgIndex
                  ? { ...img, animationSpeed: newValue }
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

export default ImageAnimationSpeedSelectField;
