import { useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import Carousel from "components/editors/carousel";
import HelpIcon from "components/help-icon";
import ImageBox from "components/editors/ImageBox";

// Types
import { AppDispatch } from "store/store";
import { ImageAnimationScreen, File as IndihuFile } from "models";

// Actions
import { updateScreenData } from "actions/expoActions";
import { getFileById } from "actions/file-actions-typed";
import ImageAnimationDirectionSelectField from "./fields/ImageAnimationDirectionSelectField";
import ImageAnimationSpeedSelectField from "./fields/ImageAnimationSpeedSelectField";

// - - - - - -

type ImageAnimationProps = {
  activeScreen: ImageAnimationScreen;
};

const ImageAnimation = ({ activeScreen }: ImageAnimationProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.imageAnimation",
  });

  // - - - States - - -

  const [activeImageIdx, setActiveImageIdx] = useState<number>(-1);

  // - - - Derived variables - - -

  const activeImageFile = useMemo(() => {
    if (activeImageIdx === -1) {
      return null;
    }

    const foundImg = activeScreen.images?.find(
      (currImg, currImgIdx) => !!currImg && currImgIdx === activeImageIdx
    );

    const foundImgFile = dispatch(getFileById(foundImg?.id));
    return foundImgFile;
  }, [activeScreen.images, activeImageIdx, dispatch]);

  // - - - Callbacks - - -

  const setActiveImageFile = useCallback(
    (img: IndihuFile) => {
      if (!activeScreen.images) {
        return;
      }

      dispatch(
        updateScreenData({
          images: activeScreen.images.map((currImg, currImgIdx) =>
            currImgIdx === activeImageIdx ? { ...currImg, id: img.id } : currImg
          ),
        })
      );
    },
    [activeScreen.images, activeImageIdx, dispatch]
  );

  // - - - GUI - - -

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <Carousel
          images={activeScreen.images ?? []}
          activeImageIndex={activeImageIdx}
          onClickCard={(i) => setActiveImageIdx(activeImageIdx === i ? -1 : i)}
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
            setActiveImageIdx(activeImageIdx - 1);
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
            setActiveImageIdx(activeImageIdx + 1);
          }}
          onDelete={(i) => {
            dispatch(
              updateScreenData({
                images: activeScreen.images.filter(
                  (img, imgIdx) => imgIdx !== i
                ),
              })
            );
            setActiveImageIdx(-1);
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
              setActiveImageIdx(activeScreen.images.length - 1);
            }
          }}
        />

        <div className="flex-row flex-space-between">
          <span>
            <span>TODO - text 1</span>
            <HelpIcon
              label="TODO - tooltip 1"
              id="editor-parallax-image-bottom"
            />
          </span>
          <span>
            <span>TODO - text 2</span>
            <HelpIcon label="TODO - tooltip 2" id="editor-parallax-image-top" />
          </span>
        </div>

        {/* Two cols */}
        {activeImageIdx !== -1 && (
          <div className="screen-two-cols mt-24">
            {/* First column */}
            <div className="fex-row-nowrap one-image-row">
              <ImageBox
                key={`image-animation-${activeImageIdx}`}
                title="TODO title"
                image={activeImageFile}
                setImage={setActiveImageFile}
                onDelete={() => {
                  dispatch(
                    updateScreenData({
                      images: activeScreen.images?.map((img, imgIdx) =>
                        imgIdx === activeImageIdx ? null : img
                      ),
                    })
                  );
                }}
                onLoad={(width: number, height: number) => {
                  dispatch(
                    updateScreenData({
                      images: activeScreen.images?.map((img, imgIdx) =>
                        imgIdx === activeImageIdx
                          ? { ...img, imageOrigData: { width, height } }
                          : img
                      ),
                    })
                  );
                }}
                helpIconLabel="TODO label"
                helpIconId="editor-image-animation-image-box"
              />
            </div>

            {/* Second column */}
            <div className="half-width-min flex-col justify-center items-center gap-4 mb-16">
              <ImageAnimationDirectionSelectField
                activeScreen={activeScreen}
                activeImgIndex={activeImageIdx}
              />
              <ImageAnimationSpeedSelectField
                activeScreen={activeScreen}
                activeImgIndex={activeImageIdx}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageAnimation;
