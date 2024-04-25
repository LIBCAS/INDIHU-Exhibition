import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";

import { SelectField, TextField } from "react-md";
import Carousel from "components/editors/carousel";
import HelpIcon from "components/help-icon";
import ImageBox from "components/editors/ImageBox";
import InfopointsTable from "components/editors/InfopointsTable";

import Time from "components/editors/time";

import { SlideshowScreen, File as IndihuFile } from "models";
import { AppDispatch } from "store/store";

import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions";
import { isEmpty } from "lodash";
import { SlideshowScreenAnimationEnum } from "enums/administration-screens";

// - -

type SlideshowProps = {
  activeScreen: SlideshowScreen;
  sumOfPhotosTimes?: number | null; // in case of slideshow description
};

const Slideshow = ({ activeScreen, sumOfPhotosTimes }: SlideshowProps) => {
  const { t } = useTranslation("expo-editor");

  const [activeImageIndex, setActiveImageIndex] = useState<number>(-1);
  const dispatch = useDispatch<AppDispatch>();

  const audioFile =
    "audio" in activeScreen && activeScreen.audio
      ? dispatch(getFileById(activeScreen.audio))
      : null;

  const activeImageFile = useMemo(() => {
    const activeImageObj = activeScreen.images?.find(
      (currImage, currImageIndex) =>
        currImageIndex === activeImageIndex &&
        !isEmpty(currImage) &&
        currImage.id
    );

    if (activeImageIndex !== -1 && activeImageObj) {
      const activeImageFile = dispatch(getFileById(activeImageObj.id));
      return activeImageFile;
    }
    return null;
  }, [activeImageIndex, activeScreen.images, dispatch]);

  // When choosing new (editing) image
  const setActiveImageFile = (img: IndihuFile) => {
    if (!activeScreen.images) {
      return;
    }
    dispatch(
      updateScreenData({
        images: activeScreen.images.map((currImage, currImageIndex) =>
          currImageIndex === activeImageIndex
            ? { ...currImage, id: img.id, infopoints: [] }
            : currImage
        ),
      })
    );
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <Carousel
          images={activeScreen.images}
          activeImageIndex={activeImageIndex}
          onClickCard={(i) => {
            setActiveImageIndex(activeImageIndex === i ? -1 : i);
            dispatch(
              updateScreenData({
                images: activeScreen.images?.map((img, imgIndex) =>
                  imgIndex === i
                    ? activeImageIndex === i
                      ? { ...img, active: false }
                      : { ...img, active: true }
                    : { ...img, active: false }
                ),
              })
            );
          }}
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
            if (!activeScreen.images) {
              return;
            }
            dispatch(
              updateScreenData({
                images: activeScreen.images.filter(
                  (img, imgIndex) => imgIndex !== i
                ),
              })
            );
            setActiveImageIndex(-1);
          }}
          onAdd={() => {
            // Not initialized yet
            if (!activeScreen.images) {
              dispatch(
                updateScreenData({
                  images: [{ active: true }],
                })
              );
              setActiveImageIndex(0);
            }

            if (activeScreen.images) {
              dispatch(
                updateScreenData({
                  images: [
                    ...activeScreen.images.map((img) => ({
                      ...img,
                      active: false,
                    })),
                    { active: true },
                  ],
                })
              );
              setActiveImageIndex(activeScreen.images.length);
            }
          }}
        />

        <div className="mt-2 mb-2 mx-[2.5%] flex justify-start max-w-[600px]">
          <Time
            audio={audioFile}
            activeScreen={activeScreen}
            sumOfPhotosTimes={sumOfPhotosTimes}
          />
        </div>

        {activeImageIndex !== -1 && (
          <div className="screen-image">
            <div className="flex flex-col gap-2 mt-2 mb-4">
              <AnimationSelectField activeScreen={activeScreen} />
            </div>

            {/* Two cols */}
            <div className="screen-two-cols">
              {/* First column - just image */}
              <div className="flex-row-nowrap one-image-row">
                <ImageBox
                  key={`image-${activeImageIndex}`}
                  title={t("descFields.slideshowScreen.imageBoxTitle")}
                  image={activeImageFile}
                  setImage={setActiveImageFile}
                  onDelete={() => {
                    dispatch(
                      updateScreenData({
                        images: activeScreen.images?.map((img, imgIndex) =>
                          imgIndex === activeImageIndex ? {} : img
                        ),
                      })
                    );
                  }}
                  onLoad={(width: number, height: number) => {
                    dispatch(
                      updateScreenData({
                        images: activeScreen.images?.map((img, imgIndex) =>
                          imgIndex === activeImageIndex
                            ? { ...img, imageOrigData: { width, height } }
                            : img
                        ),
                      })
                    );
                  }}
                  helpIconLabel={t(
                    "descFields.slideshowScreen.imageBoxTooltip"
                  )}
                  helpIconId="editor-slideshow-image"
                  // Infopoints support
                  infopoints={
                    activeScreen.images?.[activeImageIndex]?.infopoints ?? []
                  }
                  onInfopointMove={(
                    movedInfopointIndex,
                    newLeftPosition,
                    newTopPosition
                  ) => {
                    dispatch(
                      updateScreenData({
                        images: activeScreen.images?.map((img, imgIndex) =>
                          imgIndex === activeImageIndex
                            ? {
                                ...img,
                                infopoints: img.infopoints.map((ip, ipIndex) =>
                                  ipIndex === movedInfopointIndex
                                    ? {
                                        ...ip,
                                        left: newLeftPosition,
                                        top: newTopPosition,
                                      }
                                    : ip
                                ),
                              }
                            : img
                        ),
                      })
                    );
                  }}
                />
              </div>
              {/* Second column - photo time + infopoint table */}
              <div className="flex-col half-width-min gap-4">
                {activeImageFile && activeScreen.timePhotosManual && (
                  <PhotoTimeTextField
                    activeScreen={activeScreen}
                    activeImageIndex={activeImageIndex}
                    defaultValue={
                      activeScreen.images?.[activeImageIndex]?.time ?? 5
                    }
                  />
                )}
                {activeImageFile && (
                  <InfopointsTable
                    infopoints={
                      activeScreen.images?.[activeImageIndex]?.infopoints ?? []
                    }
                    onInfopointAdd={(dialogFormData) => {
                      if (!activeScreen.images) {
                        return;
                      }
                      dispatch(
                        updateScreenData({
                          images: activeScreen.images.map((img, imgIndex) =>
                            imgIndex === activeImageIndex
                              ? {
                                  ...img,
                                  infopoints: [
                                    ...img.infopoints,
                                    // Add new infopoint object
                                    { ...dialogFormData, top: 17, left: 17 },
                                  ],
                                }
                              : img
                          ),
                        })
                      );
                    }}
                    onInfopointEdit={(infopointIndexToEdit, dialogFormData) => {
                      if (!activeScreen.images) {
                        return;
                      }
                      dispatch(
                        updateScreenData({
                          images: activeScreen.images.map((img, imgIndex) =>
                            imgIndex === activeImageIndex
                              ? {
                                  ...img,
                                  infopoints: img.infopoints.map(
                                    (ip, ipIndex) =>
                                      infopointIndexToEdit === ipIndex
                                        ? { ...ip, ...dialogFormData }
                                        : { ...ip }
                                  ),
                                }
                              : img
                          ),
                        })
                      );
                    }}
                    onInfopointDelete={(infopointIndexToDelete) => {
                      if (!activeScreen.images) {
                        return;
                      }
                      dispatch(
                        updateScreenData({
                          images: activeScreen.images.map((img, imgIndex) =>
                            imgIndex === activeImageIndex
                              ? {
                                  ...img,
                                  infopoints: img.infopoints.filter(
                                    (_ip, ipIndex) =>
                                      ipIndex !== infopointIndexToDelete
                                  ),
                                }
                              : img
                          ),
                        })
                      );
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Slideshow;

// - - -

type AnimationSelectFieldProps = { activeScreen: SlideshowScreen };

const AnimationSelectField = ({ activeScreen }: AnimationSelectFieldProps) => {
  const { t } = useTranslation("expo-editor");
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="mx-[2.5%] flex justify-start">
      <SelectField
        id="screen-slideshow-selectfield-animation"
        className="min-w-[300px]"
        label={t("descFields.slideshowScreen.imageTransitionLabel")}
        menuItems={[
          {
            label: t("descFields.slideshowScreen.imageTransitionWithout"),
            value: SlideshowScreenAnimationEnum.WITHOUT,
          },
          {
            label: t(
              "descFields.slideshowScreen.imageTransitionWithoutAndBlurBackground"
            ),
            value: SlideshowScreenAnimationEnum.WITHOUT_AND_BLUR_BACKGROUND,
          },
          {
            label: t("descFields.slideshowScreen.imageTransitionFadeInOut"),
            value: SlideshowScreenAnimationEnum.FADE_IN_OUT,
          },
          {
            label: t(
              "descFields.slideshowScreen.imageTransitionFadeInOutAndBlurBackground"
            ),
            value: SlideshowScreenAnimationEnum.FADE_IN_OUT_AND_BLUR_BACKGROUND,
          },
          {
            label: t("descFields.slideshowScreen.imageTransitionFlyInOut"),
            value: SlideshowScreenAnimationEnum.FLY_IN_OUT,
          },
          {
            label: t(
              "descFields.slideshowScreen.imageTransitionFlyInOutAndBlurBackground"
            ),
            value: SlideshowScreenAnimationEnum.FLY_IN_OUT_AND_BLUR_BACKGROUND,
          },
        ]}
        itemLabel={"label"}
        itemValue={"value"}
        position={"below"}
        defaultValue={activeScreen.animationType}
        onChange={(value: any) => {
          dispatch(
            updateScreenData({
              animationType: value,
            })
          );
        }}
      />
      <div className="self-center">
        <HelpIcon
          label={t("descFields.slideshowScreen.imageTransitionTooltip")}
          id="editor-slideshow-animation"
        />
      </div>
    </div>
  );
};

// - - -

type PhotoTimeTextFieldProps = {
  activeScreen: SlideshowScreen;
  activeImageIndex: number;
  defaultValue: number;
};

const PhotoTimeTextField = ({
  activeScreen,
  activeImageIndex,
  defaultValue,
}: PhotoTimeTextFieldProps) => {
  const { t } = useTranslation("expo-editor");
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div
      className="flex flex-col"
      key={`photo-time-textfield-${activeImageIndex}`}
    >
      <div className="mt-6">
        {t("descFields.slideshowScreen.actualImageTime")}
      </div>

      <div className="flex">
        <TextField
          id={`screen-slideshow-textfield-photo-${activeImageIndex}-time`}
          type="number"
          lineDirection="center"
          style={{ width: "60px" }}
          defaultValue={defaultValue}
          onChange={(newValue: string) => {
            const newNumberValue = parseFloat(newValue);
            if (isNaN(newNumberValue) || newNumberValue < 1) {
              return;
            }

            dispatch(
              updateScreenData({
                images: activeScreen.images?.map((image, imageIndex) =>
                  imageIndex === activeImageIndex
                    ? { ...image, time: newNumberValue }
                    : image
                ),
              })
            );
          }}
        />
        <div className="self-center">
          <HelpIcon
            label={t("descFields.slideshowScreen.actualImageTimeTooltip")}
            id="screen-slideshow-time"
            place="right"
          />
        </div>
      </div>
    </div>
  );
};
