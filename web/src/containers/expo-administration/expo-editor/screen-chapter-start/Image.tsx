import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import SelectField from "react-md/lib/SelectFields";
import ImageBox from "components/editors/ImageBox";
import HelpIcon from "components/help-icon";

// Models
import {
  IntroScreen,
  File as IndihuFile,
  ScreenChapterStartAnimationType,
} from "models";
import { AppDispatch } from "store/store";

// Actions and utils
import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions/screen-actions";

import { ScreenChapterStartAnimationEnum } from "enums/administration-screens";

// - -

type ImageProps = {
  activeScreen: IntroScreen;
};

const Image = ({ activeScreen }: ImageProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor");

  const image = dispatch(getFileById(activeScreen.image));

  const setImage = (img: IndihuFile) => {
    dispatch(updateScreenData({ image: img.id }));
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen screen-with-select-on-bottom">
        <div className="screen-two-cols">
          <div className="flex-row-nowrap one-image-row">
            <ImageBox
              title={t("descFields.introScreen.imageBoxTitle")}
              image={image}
              setImage={setImage}
              onDelete={() =>
                dispatch(updateScreenData({ image: null, imageOrigData: null }))
              }
              onLoad={(width, height) =>
                dispatch(updateScreenData({ imageOrigData: { width, height } }))
              }
              helpIconId="editor-chapter-start-description-image"
              helpIconLabel={t("descFields.introScreen.imageBoxTooltip")}
            />
          </div>
          <div className="flex-row-nowrap flex-centered">
            <SelectField
              id="chapter-start-selectfield-animation"
              className="select-field big"
              label={t("descFields.introScreen.imageAnimationLabel")}
              menuItems={[
                {
                  label: t(
                    "descFields.introScreen.imageAnimationWithoutFullScreen"
                  ),
                  value: ScreenChapterStartAnimationEnum.WITHOUT_FULL_SCREEN,
                },
                {
                  label: t(
                    "descFields.introScreen.imageAnimationWithoutNoCrop"
                  ),
                  value: ScreenChapterStartAnimationEnum.WITHOUT_NO_CROP,
                },
                {
                  label: t(
                    "descFields.introScreen.imageAnimationWithoutAndBlurBackground"
                  ),
                  value:
                    ScreenChapterStartAnimationEnum.WITHOUT_AND_BLUR_BACKGROUND,
                },
                {
                  label: t("descFields.introScreen.imageAnimationFromTop"),
                  value: ScreenChapterStartAnimationEnum.FROM_TOP,
                },
                {
                  label: t("descFields.introScreen.imageAnimationFromBottom"),
                  value: ScreenChapterStartAnimationEnum.FROM_BOTTOM,
                },
                {
                  label: t(
                    "descFields.introScreen.imageAnimationFromLeftToRight"
                  ),
                  value: ScreenChapterStartAnimationEnum.FROM_LEFT_TO_RIGHT,
                },
                {
                  label: t(
                    "descFields.introScreen.imageAnimationFromRightToLeft"
                  ),
                  value: ScreenChapterStartAnimationEnum.FROM_RIGHT_TO_LEFT,
                },
              ]}
              itemLabel={"label"}
              itemValue={"value"}
              position={"below"}
              defaultValue={activeScreen.animationType}
              onChange={(value: ScreenChapterStartAnimationType) =>
                dispatch(updateScreenData({ animationType: value }))
              }
            />
            <HelpIcon
              label={t("descFields.introScreen.imageAnimationTooltip")}
              id="editor-chapter-start-description-animation"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Image;
