import { compose, withState } from "recompose";
import { connect } from "react-redux";

// Components
import { SelectField } from "react-md";
import Carousel from "../carousel";
import Image from "../image";
import HelpIcon from "../../help-icon";
import InfopointsTable from "../InfopointsTable";

// Actions
import { setDialog } from "../../../actions/dialog-actions";
import { getFileById } from "../../../actions/file-actions";
import { updateScreenData } from "../../../actions/expoActions";

// Utils
import { map, filter, find, isEmpty } from "lodash";

// Models
import {
  animationType,
  animationTypeText,
} from "../../../enums/animation-type";
import { helpIconText } from "../../../enums/text";

// - - -

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

const Photogallery = ({
  activeScreen,
  updateScreenData,
  getFileById,
  activeImageIndex,
  setActiveImageIndex,
  activePoint,
}) => {
  // null OR image object like in activeScreen.images[index]
  const image =
    activeImageIndex !== -1 &&
    find(
      activeScreen.images,
      (image, i) => i === activeImageIndex && !isEmpty(image) && image.id
    )
      ? getFileById(
          find(
            activeScreen.images,
            (image, i) => i === activeImageIndex && !isEmpty(image) && image.id
          ).id
        )
      : null;

  const setImage = (img) => {
    updateScreenData({
      images: map(activeScreen.images, (image, i) =>
        activeImageIndex === i
          ? { ...image, id: img.id, infopoints: [] }
          : image
      ),
    });
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        {/* 1. Carousel Container + its actions */}
        <Carousel
          {...{
            images: activeScreen.images,
            activeImageIndex,
            onClickCard: (i) => {
              setActiveImageIndex(activeImageIndex === i ? -1 : i);
              updateScreenData({
                images: map(activeScreen.images, (image, j) =>
                  i === j
                    ? activeImageIndex === i
                      ? { ...image, active: false }
                      : { ...image, active: true }
                    : { ...image, active: false }
                ),
              });
            },
            onClickLeft: (i) => {
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
              });
              setActiveImageIndex(activeImageIndex - 1);
            },
            onClickRight: (i) => {
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
              });
              setActiveImageIndex(activeImageIndex + 1);
            },
            onDelete: (i) => {
              updateScreenData({
                images: filter(activeScreen.images, (img, j) => j !== i),
              });
              setActiveImageIndex(-1);
            },
            onAdd: () => {
              updateScreenData({
                images: activeScreen.images
                  ? [
                      ...map(activeScreen.images, (img) => {
                        return { ...img, active: false };
                      }),
                      { active: true },
                    ]
                  : [{ active: true }],
              });
              if (!isEmpty(activeScreen.images))
                setActiveImageIndex(activeScreen.images.length);
            },
          }}
        />

        {/* 2. Clicked image from gallery administration and settings */}
        {activeImageIndex !== -1 && (
          <div className="screen-image">
            <div className="screen-two-cols">
              {/* a) Left column: image panel */}
              <div className="flex-row-nowrap one-image-row">
                <Image
                  {...{
                    key: `image-${activeImageIndex}`,
                    title: "Obrázek",
                    image,
                    setImage,
                    onDelete: () =>
                      updateScreenData({
                        images: map(activeScreen.images, (image, i) =>
                          i === activeImageIndex ? {} : image
                        ),
                      }),
                    onLoad: (width, height) =>
                      updateScreenData({
                        images: map(activeScreen.images, (image, index) =>
                          index === activeImageIndex
                            ? {
                                ...image,
                                imageOrigData: {
                                  width,
                                  height,
                                },
                              }
                            : image
                        ),
                      }),
                    images: activeScreen.images,
                    updateScreenData,
                    activePoint,
                    helpIconLabel: helpIconText.EDITOR_PHOTOGALLERY_IMAGE,
                    id: "editor-photogallery-image",
                  }}
                />
              </div>

              {/* b) Right column: infopoint panel + animation setting */}
              <div className="flex-col half-width-min">
                <div className="flex-row-nowrap flex-centered">
                  <SelectField
                    id="screen-photogallery-selectfield-animation"
                    className="select-field big"
                    label="Přechody obrázků"
                    menuItems={options}
                    itemLabel={"label"}
                    itemValue={"value"}
                    position={"below"}
                    defaultValue={activeScreen.animationType}
                    onChange={(value) =>
                      updateScreenData({
                        animationType: value,
                      })
                    }
                  />
                  <HelpIcon
                    {...{
                      label: helpIconText.EDITOR_PHOTOGALLERY_ANIMATION,
                      id: "editor-photogallery-animation",
                    }}
                  />
                </div>

                {image && (
                  <InfopointsTable
                    infopoints={
                      activeScreen.images[activeImageIndex].infopoints
                    }
                    onInfopointAdd={(dialogFormData) =>
                      updateScreenData({
                        images: map(activeScreen.images, (image, imageIndex) =>
                          imageIndex === activeImageIndex
                            ? {
                                ...image,
                                infopoints: [
                                  ...image.infopoints,
                                  // Add new infopoint object
                                  {
                                    ...dialogFormData,
                                    top: 17,
                                    left: 17,
                                  },
                                ],
                              }
                            : image
                        ),
                      })
                    }
                    onInfopointEdit={(infopointIndexToEdit, dialogFormData) =>
                      updateScreenData({
                        images: map(activeScreen.images, (image, imageIndex) =>
                          imageIndex === activeImageIndex
                            ? {
                                ...image,
                                infopoints: map(
                                  image.infopoints,
                                  (currentInfopoint, i) =>
                                    infopointIndexToEdit === i
                                      ? {
                                          ...currentInfopoint,
                                          ...dialogFormData,
                                        }
                                      : {
                                          ...currentInfopoint,
                                        }
                                ),
                              }
                            : image
                        ),
                      })
                    }
                    onInfopointDelete={(infopointIndexToDelete) =>
                      updateScreenData({
                        images: map(activeScreen.images, (image, imageIndex) =>
                          imageIndex === activeImageIndex
                            ? {
                                ...image,
                                infopoints: filter(
                                  image.infopoints,
                                  (_currentInfopoint, i) =>
                                    infopointIndexToDelete !== i
                                ),
                              }
                            : image
                        ),
                      })
                    }
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

export default compose(
  connect(null, { setDialog, getFileById, updateScreenData }),
  withState("activeImageIndex", "setActiveImageIndex", -1),
  withState("activePoint", "setActivePoint", null)
)(Photogallery);
