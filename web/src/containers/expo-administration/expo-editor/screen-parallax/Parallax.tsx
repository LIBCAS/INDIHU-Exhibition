import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import { SelectField } from "react-md";
import Carousel from "components/editors/carousel";
import HelpIcon from "components/help-icon";
import ImageBox from "components/editors/ImageBox";
import { DialogType } from "components/dialogs/dialog-types";

// Models
import { AppDispatch } from "store/store";
import { ParallaxScreeen, File as IndihuFile } from "models";
import { ScreenParallaxAnimationEnum } from "enums/administration-screens";

// Redux actions
import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions";
import { setDialog } from "actions/dialog-actions";

// Utils
import { filter } from "lodash";

// - - - - - -

type ParallaxProps = {
  activeScreen: ParallaxScreeen;
};

const Parallax = ({ activeScreen }: ParallaxProps) => {
  const { t } = useTranslation("expo-editor");
  const dispatch = useDispatch<AppDispatch>();

  // - - - States - - -

  const [activeImageIndex, setActiveImageIndex] = useState<number>(-1);

  // - - - Derived variables - - -

  const activeImageId = activeScreen.images?.find(
    (img, imgIndex) => img && imgIndex === activeImageIndex
  );
  const activeImage = dispatch(getFileById(activeImageId));

  const isMaxNumberOfLayersAchieved = useMemo(
    () => activeScreen.images && activeScreen.images.length >= 4,
    [activeScreen.images]
  );

  // - - - Callbacks - - -

  const setImage = (img: IndihuFile) => {
    dispatch(
      updateScreenData({
        images: activeScreen.images?.map((currImg, currImgIndex) =>
          currImgIndex === activeImageIndex ? img.id : currImg
        ),
      })
    );
  };

  // - - - GUI - - -

  return (
    <div className="container container-tabMenu">
      <div className="screen screen-with-select-on-bottom-small">
        <Carousel
          images={activeScreen.images ?? []}
          activeImageIndex={activeImageIndex}
          onClickCard={(i) =>
            setActiveImageIndex(activeImageIndex === i ? -1 : i)
          }
          onClickLeft={(i) => {
            if (!activeScreen.images) {
              return;
            }
            dispatch(
              updateScreenData({
                images: [
                  ...activeScreen.images.slice(0, i - 1),
                  activeScreen.images[i],
                  activeScreen.images[i - 1],
                  ...activeScreen.images.slice(
                    i + 1,
                    activeScreen.images.length
                  ),
                ],
              })
            );
            setActiveImageIndex(activeImageIndex - 1);
          }}
          onClickRight={(i) => {
            if (!activeScreen.images) {
              return;
            }
            dispatch(
              updateScreenData({
                images: [
                  ...activeScreen.images.slice(0, i),
                  activeScreen.images[i + 1],
                  activeScreen.images[i],
                  ...activeScreen.images.slice(
                    i + 2,
                    activeScreen.images.length
                  ),
                ],
              })
            );
            setActiveImageIndex(activeImageIndex + 1);
          }}
          onDelete={(i) => {
            dispatch(
              updateScreenData({
                images: filter(activeScreen.images, (img, j) => j !== i),
              })
            );
            setActiveImageIndex(-1);
          }}
          onAdd={() => {
            if (isMaxNumberOfLayersAchieved) {
              dispatch(
                setDialog(DialogType.InfoDialog, {
                  noStornoButton: true,
                  title: `${t(
                    "descFields.parallaxScreen.maxNumberOfLayersAchievedErrTitle"
                  )}`,
                  content: `${t(
                    "descFields.parallaxScreen.maxNumberOfLayersAchievedErrMsg"
                  )}`,
                })
              );
              return;
            }

            dispatch(
              updateScreenData({
                images: activeScreen.images
                  ? [...activeScreen.images, null]
                  : [null],
              })
            );
            if (activeScreen.images) {
              setActiveImageIndex(activeScreen.images.length - 1);
            }
          }}
        />

        <div className="flex-row flex-space-between margin-bottom">
          <span>
            <span>{t("descFields.parallaxScreen.theLowestImage")}</span>
            <HelpIcon
              label={t("descFields.parallaxScreen.theLowestImageTooltip")}
              id="editor-parallax-image-bottom"
            />
          </span>
          <span>
            <span>{t("descFields.parallaxScreen.theTopmostImage")}</span>
            <HelpIcon
              label={t("descFields.parallaxScreen.theTopmostImageTooltip")}
              id="editor-parallax-image-top"
            />
          </span>
        </div>

        {activeImageIndex !== -1 && (
          <div className="screen-image">
            <div className="screen-two-cols">
              <div className="flex-row-nowrap one-image-row">
                <ImageBox
                  key={`image-${activeImageIndex}`}
                  title={t("descFields.parallaxScreen.imageBoxTitle")}
                  image={activeImage}
                  setImage={setImage}
                  onDelete={() => {
                    dispatch(
                      updateScreenData({
                        images: activeScreen.images?.map((img, imgIndex) =>
                          imgIndex === activeImageIndex ? null : img
                        ),
                      })
                    );
                  }}
                  onLoad={(_width, _height_) => {
                    //
                  }}
                  helpIconId="editor-parallax-image"
                  helpIconLabel={t("descFields.parallaxScreen.imageBoxTooltip")}
                />
              </div>

              <div className="flex-row-nowrap flex-centered">
                <SelectField
                  id="screen-parallax-selectfield-animation"
                  className="select-field"
                  label={t("descFields.parallaxScreen.parallaxAnimationLabel")}
                  menuItems={[
                    {
                      label: t("descFields.parallaxScreen.animationWithout"),
                      value: ScreenParallaxAnimationEnum.WITHOUT,
                    },
                    {
                      label: t("descFields.parallaxScreen.animationFromTop"),
                      value: ScreenParallaxAnimationEnum.FROM_TOP,
                    },
                    {
                      label: t("descFields.parallaxScreen.animationFromBottom"),
                      value: ScreenParallaxAnimationEnum.FROM_BOTTOM,
                    },
                    {
                      label: t(
                        "descFields.parallaxScreen.animationLeftToRight"
                      ),
                      value: ScreenParallaxAnimationEnum.FROM_LEFT_TO_RIGHT,
                    },
                    {
                      label: t(
                        "descFields.parallaxScreen.animationRightToLeft"
                      ),
                      value: ScreenParallaxAnimationEnum.FROM_RIGHT_TO_LEFT,
                    },
                  ]}
                  itemLabel={"label"}
                  itemValue={"value"}
                  position={"below"}
                  defaultValue={
                    activeScreen.animationType ??
                    ScreenParallaxAnimationEnum.WITHOUT
                  }
                  onChange={(value: any) =>
                    dispatch(
                      updateScreenData({
                        animationType: value,
                      })
                    )
                  }
                />
                <HelpIcon
                  label={t(
                    "descFields.parallaxScreen.parallaxAnimationLabelTooltip"
                  )}
                  id="editor-parallax-animation"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Parallax;
