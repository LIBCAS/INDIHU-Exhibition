import React from "react";
import { connect } from "react-redux";
import { map, filter, find, isEmpty, compact, concat, get } from "lodash";
import { compose, withState } from "recompose";
import { SelectField } from "react-md";

import InfopointsSequencesTable from "../InfopointsSequencesTable";
import Carousel from "../Carousel";
import Image from "../Image";
import HelpIcon from "../../HelpIcon";

import { setDialog } from "../../../actions/dialogActions";
import { getFileById } from "../../../actions/fileActions";
import { updateScreenData } from "../../../actions/expoActions";
import { animationType, animationTypeText } from "../../../enums/animationType";
import { helpIconText } from "../../../enums/text";
import { hasValue } from "../../../utils";

const options = [
  { label: animationTypeText.WITHOUT, value: animationType.WITHOUT },
  {
    label: animationTypeText.WITHOUT_AND_BLUR_BACKGROUND,
    value: animationType.WITHOUT_AND_BLUR_BACKGROUND
  },
  { label: animationTypeText.FADE_IN_OUT, value: animationType.FADE_IN_OUT },
  {
    label: animationTypeText.FADE_IN_OUT_AND_BLUR_BACKGROUND,
    value: animationType.FADE_IN_OUT_AND_BLUR_BACKGROUND
  },
  { label: animationTypeText.FLY_IN_OUT, value: animationType.FLY_IN_OUT },
  {
    label: animationTypeText.FLY_IN_OUT_AND_BLUR_BACKGROUND,
    value: animationType.FLY_IN_OUT_AND_BLUR_BACKGROUND
  }
];

const Photogallery = ({
  activeScreen,
  updateScreenData,
  activeImageIndex,
  setActiveImageIndex,
  getFileById,
  setActivePoint,
  activePoint
}) => {
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

  const setImage = img => {
    updateScreenData({
      images: map(activeScreen.images, (image, i) =>
        activeImageIndex === i
          ? { ...image, id: img.id, infopoints: [] }
          : image
      )
    });
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <Carousel
          {...{
            images: activeScreen.images,
            activeImageIndex,
            onClickCard: i => {
              setActiveImageIndex(activeImageIndex === i ? -1 : i);
              updateScreenData({
                images: map(activeScreen.images, (image, j) =>
                  i === j
                    ? activeImageIndex === i
                      ? { ...image, active: false }
                      : { ...image, active: true }
                    : { ...image, active: false }
                )
              });
            },
            onClickLeft: i => {
              updateScreenData({
                images: [
                  ...activeScreen.images.slice(0, i - 1),
                  activeScreen.images[i],
                  activeScreen.images[i - 1],
                  ...activeScreen.images.slice(
                    i + 1,
                    activeScreen.images.length
                  )
                ]
              });
              setActiveImageIndex(activeImageIndex - 1);
            },
            onClickRight: i => {
              updateScreenData({
                images: [
                  ...activeScreen.images.slice(0, i),
                  activeScreen.images[i + 1],
                  activeScreen.images[i],
                  ...activeScreen.images.slice(
                    i + 2,
                    activeScreen.images.length
                  )
                ]
              });
              setActiveImageIndex(activeImageIndex + 1);
            },
            onDelete: i => {
              updateScreenData({
                images: filter(activeScreen.images, (img, j) => j !== i)
              });
              setActiveImageIndex(-1);
            },
            onAdd: () => {
              updateScreenData({
                images: activeScreen.images
                  ? [
                      ...map(activeScreen.images, img => {
                        return { ...img, active: false };
                      }),
                      { active: true }
                    ]
                  : [{ active: true }]
              });
              if (!isEmpty(activeScreen.images))
                setActiveImageIndex(activeScreen.images.length);
            }
          }}
        />
        {activeImageIndex !== -1 && (
          <div className="screen-image">
            <div className="screen-two-cols">
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
                        )
                      }),
                    onLoad: (width, height) =>
                      updateScreenData({
                        images: map(activeScreen.images, (image, index) =>
                          index === activeImageIndex
                            ? {
                                ...image,
                                imageOrigData: {
                                  width,
                                  height
                                }
                              }
                            : image
                        )
                      }),
                    images: activeScreen.images,
                    updateScreenData,
                    activePoint,
                    helpIconLabel: helpIconText.EDITOR_PHOTOGALLERY_IMAGE,
                    id: "editor-photogallery-image"
                  }}
                />
              </div>
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
                    onChange={value =>
                      updateScreenData({
                        animationType: value
                      })
                    }
                  />
                  <HelpIcon
                    {...{
                      label: helpIconText.EDITOR_PHOTOGALLERY_ANIMATION,
                      id: "editor-photogallery-animation"
                    }}
                  />
                </div>
                {image && (
                  <InfopointsSequencesTable
                    {...{
                      label: "Infopointy",
                      imgIdx: activeImageIndex,
                      infopoints:
                        activeScreen.images[activeImageIndex].infopoints,
                      activePoint,
                      onRowClick: i =>
                        setActivePoint(activePoint === i ? null : i),
                      onSubmit: text =>
                        updateScreenData({
                          images: map(activeScreen.images, (image, i) =>
                            i === activeImageIndex
                              ? {
                                  ...image,
                                  infopoints: map(image.infopoints, infopoint =>
                                    infopoint.edit
                                      ? { ...infopoint, text, edit: false }
                                      : infopoint
                                  )
                                }
                              : image
                          )
                        }),
                      onClear: () =>
                        updateScreenData({
                          images: map(activeScreen.images, (image, j) =>
                            j === activeImageIndex
                              ? {
                                  ...image,
                                  infopoints: map(
                                    image.infopoints,
                                    infopoint => {
                                      return {
                                        ...infopoint,
                                        edit: false
                                      };
                                    }
                                  )
                                }
                              : image
                          )
                        }),
                      onEdit: i =>
                        updateScreenData({
                          images: map(activeScreen.images, (image, j) =>
                            j === activeImageIndex
                              ? {
                                  ...image,
                                  infopoints: map(
                                    image.infopoints,
                                    (infopoint, idx) =>
                                      i === idx
                                        ? {
                                            ...infopoint,
                                            edit: true
                                          }
                                        : {
                                            ...infopoint,
                                            edit: false
                                          }
                                  )
                                }
                              : image
                          )
                        }),
                      onCheckbox: (chb, value) =>
                        updateScreenData({
                          images: map(activeScreen.images, (image, i) =>
                            i === activeImageIndex
                              ? {
                                  ...image,
                                  infopoints: map(
                                    image.infopoints,
                                    (infopoint, idx) =>
                                      chb === idx
                                        ? {
                                            ...infopoint,
                                            alwaysVisible: value
                                          }
                                        : infopoint
                                  )
                                }
                              : image
                          )
                        }),
                      onDelete: i =>
                        updateScreenData({
                          images: map(activeScreen.images, (image, j) =>
                            j === activeImageIndex
                              ? {
                                  ...image,
                                  infopoints: filter(
                                    image.infopoints,
                                    (inf, idx) => i !== idx
                                  )
                                }
                              : image
                          )
                        }),
                      onAdd: () =>
                        updateScreenData({
                          images: map(activeScreen.images, (image, i) =>
                            i === activeImageIndex
                              ? {
                                  ...image,
                                  infopoints: compact(
                                    concat(image.infopoints, {
                                      text: "Vložte popis infopointu",
                                      top: 17,
                                      left: 17,
                                      alwaysVisible: false
                                    })
                                  )
                                }
                              : image
                          )
                        }),
                      initialValues: {
                        text:
                          !hasValue(
                            get(
                              find(
                                get(
                                  find(
                                    activeScreen.images,
                                    (_, i) => i === activeImageIndex
                                  ),
                                  "infopoints"
                                ),
                                infopoint => infopoint.edit
                              ),
                              "text"
                            )
                          ) ||
                          get(
                            find(
                              get(
                                find(
                                  activeScreen.images,
                                  (_, i) => i === activeImageIndex
                                ),
                                "infopoints"
                              ),
                              infopoint => infopoint.edit
                            ),
                            "text"
                          ) === "Vložte popis infopointu"
                            ? ""
                            : get(
                                find(
                                  get(
                                    find(
                                      activeScreen.images,
                                      (_, i) => i === activeImageIndex
                                    ),
                                    "infopoints"
                                  ),
                                  infopoint => infopoint.edit
                                ),
                                "text"
                              )
                      }
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

export default compose(
  connect(
    null,
    { setDialog, getFileById, updateScreenData }
  ),
  withState("activeImageIndex", "setActiveImageIndex", -1),
  withState("activePoint", "setActivePoint", null)
)(Photogallery);
