import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";

import { SelectField, TextField } from "react-md";
import Carousel from "components/editors/carousel";
import HelpIcon from "components/help-icon";
import InfopointsTable from "components/editors/InfopointsTable";

import { SlideshowScreen, File as IndihuFile } from "models";
import { AppDispatch } from "store/store";

import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions/screen-actions-typed";
import { helpIconText } from "enums/text";
import { animationType, animationTypeText } from "enums/animation-type";
import { isEmpty } from "lodash";
import ImageBox from "components/editors/ImageBox";

// - -

const options = [
  { label: animationTypeText.WITHOUT, value: animationType.WITHOUT },
  {
    label: animationTypeText.WITHOUT_AND_BLUR_BACKGROUND,
    value: animationType.WITHOUT_AND_BLUR_BACKGROUND,
  },
  { label: animationTypeText.FADE_IN_OUT, value: animationType.FADE_IN_OUT },
  {
    label: animationTypeText.FADE_IN_OUT_AND_BLUR_BACKGROUND,
    value: animationType.FADE_IN_OUT_AND_BLUR_BACKGROUND,
  },
  { label: animationTypeText.FLY_IN_OUT, value: animationType.FLY_IN_OUT },
  {
    label: animationTypeText.FLY_IN_OUT_AND_BLUR_BACKGROUND,
    value: animationType.FLY_IN_OUT_AND_BLUR_BACKGROUND,
  },
];

// - -

type SlideshowProps = {
  activeScreen: SlideshowScreen;
};

const Slideshow = ({ activeScreen }: SlideshowProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(-1);
  const dispatch = useDispatch<AppDispatch>();

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

        {activeImageIndex !== -1 && (
          <div className="screen-image">
            <AnimationSelectField activeScreen={activeScreen} />

            {/* Two cols */}
            <div className="screen-two-cols">
              {/* First column - just image */}
              <div className="flex-row-nowrap one-image-row">
                <ImageBox
                  key={`image-${activeImageIndex}`}
                  title="Obrázek"
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
                  helpIconLabel={helpIconText.EDITOR_SLIDESHOW_IMAGE}
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
                    onInfopointAdd={async (dialogFormData) => {
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
                    onInfopointEdit={async (
                      infopointIndexToEdit,
                      dialogFormData
                    ) => {
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
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="w-full flex justify-center mt-2 mb-4">
      <div className="w-[95%] flex justify-start">
        <SelectField
          id="screen-slideshow-selectfield-animation"
          className="select-field big"
          style={{ marginRight: 0, marginTop: 0 }}
          label="Přechody obrázků"
          menuItems={options}
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
            label={helpIconText.EDITOR_SLIDESHOW_ANIMATION}
            id="editor-slideshow-animation"
          />
        </div>
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
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div
      className="flex flex-col"
      key={`photo-time-textfield-${activeImageIndex}`}
    >
      <div className="mt-6">Doba zobrazení aktuálního snímku</div>

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
            label="Po uplynutí této doby aktuální snímek přejde na snímek následující, resp. na další obrazovku v případě, že aktuální snímek je poslední v pořadí"
            id="screen-slideshow-time"
            place="right"
          />
        </div>
      </div>
    </div>
  );
};
