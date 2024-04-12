import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import Carousel from "components/editors/carousel";
import HelpIcon from "components/help-icon";
import { SelectField } from "react-md";

// Models
import { ParallaxScreeen, File as IndihuFile } from "models";
import { AppDispatch } from "store/store";

// Actions and utils
import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions";
import { ScreenParallaxAnimationEnum } from "enums/administration-screens";

import { filter } from "lodash";
import ImageBox from "components/editors/ImageBox";
// - -

type ParallaxProps = {
  activeScreen: ParallaxScreeen;
};

const Parallax = ({ activeScreen }: ParallaxProps) => {
  const { t } = useTranslation("expo-editor");
  const dispatch = useDispatch<AppDispatch>();

  const [activeImageIndex, setActiveImageIndex] = useState<number>(-1);

  const activeImageId = activeScreen.images?.find(
    (img, imgIndex) => img && imgIndex === activeImageIndex
  );
  const activeImage = dispatch(getFileById(activeImageId));

  const setImage = (img: IndihuFile) => {
    dispatch(
      updateScreenData({
        images: activeScreen.images?.map((currImg, currImgIndex) =>
          currImgIndex === activeImageIndex ? img.id : currImg
        ),
      })
    );
  };

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
                  defaultValue={activeScreen.animationType}
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
                    "descFields.parallaxScreen.parallaxAnimationTooltip"
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
