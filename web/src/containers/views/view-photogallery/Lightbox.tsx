import { useState, useCallback } from "react";
import { animated, SpringValue } from "react-spring";

import { useDialogRef } from "context/dialog-ref-provider/dialog-ref-provider";
import { DialogRefType } from "context/dialog-ref-provider/dialog-ref-types";
import DialogPortal from "context/dialog-ref-provider/DialogPortal";

import useElementSize from "hooks/element-size-hook";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import { InformationDialog } from "components/dialogs/information-dialog/information-dialog";

import { Size, PhotogalleryImages } from "models";
import { useTranslation } from "react-i18next";

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
            <div className="w-full h-full pointer-events-none">
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

            <div className="w-full h-[24px]" />
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
  const { t } = useTranslation("view-screen", {
    keyPrefix: "photogalleryScreen",
  });

  const { openNewTopDialog, closeTopDialog, isInformationDialogOpen } =
    useDialogRef();

  const openInformationDialog = useCallback(
    () => openNewTopDialog(DialogRefType.InformationDialog),
    [openNewTopDialog]
  );

  return (
    <>
      <animated.div
        className="flex justify-between items-center"
        style={{ opacity: overlayOpacityAnimation.opacity }}
      >
        <div className="flex gap-1">
          <div>
            <Button
              noPadding
              tooltip={{
                id: "photogallery-zoom-in-button-tooltip",
                content: t("zoomInTooltip"),
              }}
            >
              <Icon
                name="zoom_in"
                useMaterialUiIcon
                color="white"
                onClick={zoomInside}
                style={{ fontSize: "24px" }}
              />
            </Button>
          </div>

          <div>
            <Button
              noPadding
              tooltip={{
                id: "photogallery-zoom-reset-button-tooltip",
                content: t("resetZoomTooltip"),
              }}
            >
              <Icon
                name="search"
                useMaterialUiIcon
                color="white"
                onClick={reset}
                style={{ fontSize: "24px" }}
              />
            </Button>
          </div>

          <div>
            <Button
              noPadding
              tooltip={{
                id: "photogallery-zoom-out-button-tooltip",
                content: t("zoomOutTooltip"),
              }}
            >
              <Icon
                name="zoom_out"
                useMaterialUiIcon
                color="white"
                onClick={zoomOutside}
                style={{ fontSize: "24px" }}
              />
            </Button>
          </div>

          {currPhotoObj.photoDescription && (
            <div>
              <Button
                noPadding
                tooltip={{
                  id: "photogallery-photo-description-button-tooltip",
                  content: t("openDescTooltip"),
                }}
              >
                <Icon
                  name="article"
                  useMaterialUiIcon
                  color="white"
                  onClick={openInformationDialog}
                  style={{ fontSize: "24px" }}
                />
              </Button>
            </div>
          )}
        </div>

        <div>
          <div>
            <Button
              noPadding
              tooltip={{
                id: "photogallery-close",
                content: t("closeTooltip"),
              }}
            >
              <Icon
                color="white"
                useMaterialUiIcon
                name="close"
                onClick={closeLightBox}
                style={{ fontSize: "24px" }}
              />
            </Button>
          </div>
        </div>
      </animated.div>

      {isInformationDialogOpen && (
        <DialogPortal
          component={
            <InformationDialog
              closeThisDialog={closeTopDialog}
              title={
                <span className="text-2xl font-bold">
                  {currPhotoObj.photoTitle ?? ""}
                </span>
              }
              content={currPhotoObj.photoDescription}
              big={true}
            />
          }
        />
      )}
    </>
  );
};

export default LightBox;
