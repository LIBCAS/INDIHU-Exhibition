import { connect } from "react-redux";
import { map, filter, find } from "lodash";
import { compose, withState } from "recompose";
import { SelectField } from "react-md";

import Carousel from "../../../components/editors/carousel";
import Image from "../../../components/editors/image";
import HelpIcon from "../../../components/help-icon";

import { setDialog } from "../../../actions/dialog-actions";
import { getFileById } from "../../../actions/file-actions";
import { updateScreenData } from "../../../actions/expoActions";
import {
  animationType,
  animationTypeText,
} from "../../../enums/animation-type";

import { helpIconText } from "../../../enums/text";

const options = [
  { label: animationTypeText.WITHOUT, value: animationType.WITHOUT },
  { label: animationTypeText.FROM_TOP, value: animationType.FROM_TOP },
  { label: animationTypeText.FROM_BOTTOM, value: animationType.FROM_BOTTOM },
  {
    label: animationTypeText.FROM_LEFT_TO_RIGHT,
    value: animationType.FROM_LEFT_TO_RIGHT,
  },
  {
    label: animationTypeText.FROM_RIGHT_TO_LEFT,
    value: animationType.FROM_RIGHT_TO_LEFT,
  },
];

const Parallax = ({
  activeScreen,
  updateScreenData,
  activeImageIndex,
  setActiveImageIndex,
  getFileById,
}) => {
  const image =
    activeImageIndex !== -1 &&
    find(activeScreen.images, (image, i) => i === activeImageIndex && image)
      ? getFileById(
          find(
            activeScreen.images,
            (image, i) => i === activeImageIndex && image
          )
        )
      : null;

  const setImage = (img) => {
    updateScreenData({
      images: map(activeScreen.images, (image, i) =>
        activeImageIndex === i ? img.id : image
      ),
    });
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen screen-with-select-on-bottom-small">
        <Carousel
          {...{
            images: activeScreen.images,
            activeImageIndex,
            onClickCard: (i) =>
              setActiveImageIndex(activeImageIndex === i ? -1 : i),
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
                  ? [...activeScreen.images, null]
                  : [null],
              });
              if (activeScreen.images)
                setActiveImageIndex(activeScreen.images.length - 1);
            },
          }}
        />
        <div className="flex-row flex-space-between margin-bottom">
          <span>
            <span>Nejspodnější</span>
            <HelpIcon
              label={helpIconText.EDITOR_PARALLAX_IMAGE_BOTTOM}
              id="editor-parallax-image-bottom"
            />
          </span>
          <span>
            <span>Nejvrchnější</span>
            <HelpIcon
              label={helpIconText.EDITOR_PARALLAX_IMAGE_TOP}
              id="editor-parallax-image-top"
            />
          </span>
        </div>
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
                          i === activeImageIndex ? null : image
                        ),
                      }),
                    helpIconLabel: helpIconText.EDITOR_PARALLAX_IMAGE,
                    id: "editor-parallax-image",
                  }}
                />
              </div>
              <div className="flex-row-nowrap flex-centered">
                <SelectField
                  id="screen-parallax-selectfield-animation"
                  className="select-field"
                  label="Celková animace paralaxu"
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
                  label={helpIconText.EDITOR_PARALLAX_ANIMATION}
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

export default compose(
  connect(null, { setDialog, getFileById, updateScreenData }),
  withState("activeImageIndex", "setActiveImageIndex", -1)
)(Parallax);
