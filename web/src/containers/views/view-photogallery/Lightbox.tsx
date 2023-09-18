import { useState } from "react";
import { useDispatch } from "react-redux";
import useElementSize, { Size } from "hooks/element-size-hook";
import { animated, SpringValue } from "react-spring";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import { AppDispatch } from "store/store";
import { PhotogalleryImages } from "models";

import { setDialog } from "actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";

// - -

type LightBoxProps = {
  currPhotoObj: PhotogalleryImages[number];
  currPhotoSrc: string | undefined;
  closeLightBox: () => void;
  overlayOpacityAnimation: { opacity: SpringValue<number> };
};

const LightBox = ({
  currPhotoSrc,
  currPhotoObj,
  closeLightBox,
  overlayOpacityAnimation,
}: LightBoxProps) => {
  const [imgContainerRef, imgContainerSize] = useElementSize();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [containedImageSize, setContainedImageSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  return (
    <TransformWrapper disablePadding>
      {({ zoomIn, resetTransform, zoomOut }) => {
        return (
          <div className="w-full h-full flex flex-col gap-2">
            <Toolbar
              zoomInside={() => zoomIn(0.2)}
              zoomOutside={() => zoomOut(0.2)}
              reset={() => resetTransform()}
              closeLightBox={closeLightBox}
              overlayOpacityAnimation={overlayOpacityAnimation}
              currPhotoObj={currPhotoObj}
            />

            {/* Image itself */}
            <div
              ref={imgContainerRef}
              style={{ width: "100%", height: "100%" }}
              className="flex justify-center items-center"
            >
              <TransformComponent
                wrapperStyle={{
                  maxWidth: `${imgContainerSize.width}px`,
                  maxHeight: `${imgContainerSize.height}px`,
                }}
                contentStyle={{
                  maxWidth: `${imgContainerSize.width}px`,
                  maxHeight: `${imgContainerSize.height}px`,
                }}
              >
                <img
                  src={currPhotoSrc}
                  alt="lightbox-image"
                  style={{
                    maxWidth: `${imgContainerSize.width}px`,
                    maxHeight: `${imgContainerSize.height}px`,
                  }}
                  onLoad={(e) => {
                    const imageEl = e.currentTarget;
                    const imageWidth = imageEl.width;
                    const imageHeight = imageEl.height;
                    setContainedImageSize({
                      width: imageWidth,
                      height: imageHeight,
                    });
                  }}
                />
              </TransformComponent>
            </div>
          </div>
        );
      }}
    </TransformWrapper>
  );
};

// - -

type ToolbarProps = {
  zoomInside: () => void;
  zoomOutside: () => void;
  reset: () => void;
  closeLightBox: () => void;
  overlayOpacityAnimation: { opacity: SpringValue<number> };
  currPhotoObj: PhotogalleryImages[number];
};

const Toolbar = ({
  zoomInside,
  zoomOutside,
  reset,
  closeLightBox,
  overlayOpacityAnimation,
  currPhotoObj,
}: ToolbarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <animated.div
      className="flex justify-between items-center"
      style={{ opacity: overlayOpacityAnimation.opacity }}
    >
      <div className="flex gap-1">
        <Button noPadding>
          <Icon
            name="zoom_in"
            useMaterialUiIcon
            color="white"
            onClick={zoomInside}
            style={{ fontSize: "24px" }}
          />
        </Button>

        <Button noPadding>
          <Icon
            name="search"
            useMaterialUiIcon
            color="white"
            onClick={reset}
            style={{ fontSize: "24px" }}
          />
        </Button>

        <Button noPadding>
          <Icon
            name="zoom_out"
            useMaterialUiIcon
            color="white"
            onClick={zoomOutside}
            style={{ fontSize: "24px" }}
          />
        </Button>

        {currPhotoObj.photoDescription && (
          <Button noPadding>
            <Icon
              name="article"
              useMaterialUiIcon
              color="white"
              onClick={() => {
                dispatch(
                  setDialog(DialogType.InformationDialog, {
                    title: (
                      <span className="text-2xl font-bold">
                        {currPhotoObj.photoTitle ?? ""}
                      </span>
                    ),
                    content: currPhotoObj.photoDescription,
                    big: true,
                  })
                );
              }}
              style={{ fontSize: "24px" }}
            />
          </Button>
        )}
      </div>

      <div>
        <Button noPadding>
          <Icon
            color="white"
            useMaterialUiIcon
            name="close"
            onClick={closeLightBox}
            style={{ fontSize: "24px" }}
          />
        </Button>
      </div>
    </animated.div>
  );
};

export default LightBox;
