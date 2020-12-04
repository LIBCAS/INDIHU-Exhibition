import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import SelectField from "react-md/lib/SelectFields";

import ImageComponent from "../Image";
import HelpIcon from "../../HelpIcon";

import { setDialog } from "../../../actions/dialogActions";
import { getFileById } from "../../../actions/fileActions";
import { updateScreenData } from "../../../actions/expoActions";

import { animationType, animationTypeText } from "../../../enums/animationType";
import { helpIconText } from "../../../enums/text";

const options = [
  {
    label: animationTypeText.WITHOUT_FULL_SCREEN,
    value: animationType.WITHOUT_FULL_SCREEN
  },
  {
    label: animationTypeText.WITHOUT_NO_CROP,
    value: animationType.WITHOUT_NO_CROP
  },
  {
    label: animationTypeText.WITHOUT_AND_BLUR_BACKGROUND,
    value: animationType.WITHOUT_AND_BLUR_BACKGROUND
  },
  { label: animationTypeText.FROM_TOP, value: animationType.FROM_TOP },
  { label: animationTypeText.FROM_BOTTOM, value: animationType.FROM_BOTTOM },
  {
    label: animationTypeText.FROM_LEFT_TO_RIGHT,
    value: animationType.FROM_LEFT_TO_RIGHT
  },
  {
    label: animationTypeText.FROM_RIGHT_TO_LEFT,
    value: animationType.FROM_RIGHT_TO_LEFT
  }
];

const Image = ({ activeScreen, setDialog, getFileById, updateScreenData }) => {
  const image = activeScreen.image ? getFileById(activeScreen.image) : null;

  const setImage = image => {
    updateScreenData({ image: image.id });
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen screen-with-select-on-bottom">
        <div className="screen-two-cols">
          <div className="flex-row-nowrap one-image-row">
            <ImageComponent
              {...{
                title: "Obrázek na pozadí",
                image: image,
                setImage: setImage,
                onDelete: () =>
                  updateScreenData({ image: null, imageOrigData: null }),
                onLoad: (width, height) =>
                  updateScreenData({
                    imageOrigData: {
                      width,
                      height
                    }
                  }),
                helpIconLabel:
                  helpIconText.EDITOR_CHAPTER_START_DESCRIPTION_IMAGE,
                id: "editor-chapter-start-description-image"
              }}
            />
          </div>
          <div className="flex-row-nowrap flex-centered">
            <SelectField
              id="chapter-start-selectfield-animation"
              className="select-field big"
              label="Animace obrázku"
              menuItems={options}
              itemLabel={"label"}
              itemValue={"value"}
              position={"below"}
              defaultValue={activeScreen.animationType}
              onChange={value => updateScreenData({ animationType: value })}
            />
            <HelpIcon
              {...{
                label: helpIconText.EDITOR_CHAPTER_START_DESCRIPTION_ANIMATION,
                id: "editor-chapter-start-description-animation"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default compose(
  connect(
    null,
    {
      setDialog,
      getFileById,
      updateScreenData
    }
  )
)(Image);
