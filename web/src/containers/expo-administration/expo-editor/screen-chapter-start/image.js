import { connect } from "react-redux";
import { compose } from "recompose";
import SelectField from "react-md/lib/SelectFields";

import ImageComponent from "components/editors/image";
import HelpIcon from "components/help-icon";

import { setDialog } from "actions/dialog-actions";
import { getFileById } from "actions/file-actions";
import { updateScreenData } from "actions/expoActions";

import { ScreenChapterStartAnimationEnum } from "enums/administration-screens";
import { useTranslation } from "react-i18next";

// - -

const Image = ({ activeScreen, getFileById, updateScreenData }) => {
  const { t } = useTranslation("expo-editor");

  const image = activeScreen.image ? getFileById(activeScreen.image) : null;

  const setImage = (image) => {
    updateScreenData({ image: image.id });
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen screen-with-select-on-bottom">
        <div className="screen-two-cols">
          <div className="flex-row-nowrap one-image-row">
            <ImageComponent
              {...{
                title: t("descFields.introScreen.imageBoxTitle"),
                image: image,
                setImage: setImage,
                onDelete: () =>
                  updateScreenData({ image: null, imageOrigData: null }),
                onLoad: (width, height) =>
                  updateScreenData({
                    imageOrigData: {
                      width,
                      height,
                    },
                  }),
                helpIconLabel: t("descFields.introScreen.imageBoxTooltip"),
                id: "editor-chapter-start-description-image",
              }}
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
              onChange={(value) => updateScreenData({ animationType: value })}
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

export default compose(
  connect(null, {
    setDialog,
    getFileById,
    updateScreenData,
  })
)(Image);
