import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components

// Types
import { AppDispatch } from "store/store";
import { ImageAnimationScreen } from "models";

// Actions
import { updateScreenData } from "actions/expoActions";

// - - - - - -

type ImageAnimationProps = {
  activeScreen: ImageAnimationScreen;
};

const ImageAnimation = ({ activeScreen }: ImageAnimationProps) => {
  console.log();
  console.log("*** ImageAnimation ***");
  console.log("activeScreen: ", activeScreen);

  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.imageAnimation",
  });

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div>TODO1</div>
      </div>
    </div>
  );
};

export default ImageAnimation;
