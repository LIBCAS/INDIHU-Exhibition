import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import SelectField from "react-md/lib/SelectFields";

import Image from "../Image";
import HelpIcon from "../../HelpIcon";

import { setDialog } from "../../../actions/dialogActions";
import { getFileById } from "../../../actions/fileActions";
import { updateScreenData } from "../../../actions/expoActions";

import { animationType, animationTypeText } from "../../../enums/animationType";

import { helpIconText } from "../../../enums/text";

const options = [
  { label: animationTypeText.HOVER, value: animationType.HOVER },
  { label: animationTypeText.CLICK, value: animationType.CLICK },
  { label: animationTypeText.HORIZONTAL, value: animationType.HORIZONTAL },
  { label: animationTypeText.VERTICAL, value: animationType.VERTICAL },
  {
    label: animationTypeText.FADE_IN_OUT_TWO_IMAGES,
    value: animationType.FADE_IN_OUT_TWO_IMAGES
  }
];

const Images = ({ activeScreen, setDialog, getFileById, updateScreenData }) => {
  const image1 = activeScreen.image1 ? getFileById(activeScreen.image1) : null;
  const image2 = activeScreen.image2 ? getFileById(activeScreen.image2) : null;

  const setImage1 = image1 => {
    updateScreenData({ image1: image1.id });
  };
  const setImage2 = image2 => {
    updateScreenData({ image2: image2.id });
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="screen-two-cols">
          <div className="flex-row-nowrap one-image-row">
            <Image
              {...{
                title: "Obrázek před",
                image: image1,
                setImage: setImage1,
                onDelete: () =>
                  updateScreenData({ image1: null, image1OrigData: null }),
                onLoad: (width, height) =>
                  updateScreenData({
                    image1OrigData: {
                      width,
                      height
                    }
                  })
              }}
            />
          </div>
          <div className="flex-row-nowrap one-image-row">
            <Image
              {...{
                title: "Obrázek po",
                image: image2,
                setImage: setImage2,
                onDelete: () =>
                  updateScreenData({ image2: null, image2OrigData: null }),
                onLoad: (width, height) =>
                  updateScreenData({
                    image2OrigData: {
                      width,
                      height
                    }
                  })
              }}
            />
          </div>
        </div>
        <div className="flex-row-nowrap flex-centered full-width">
          <SelectField
            id="screen-image-change-selectfield-animation"
            className="select-field"
            label="Způsob přechodu mezi obrázky"
            menuItems={options}
            itemLabel={"label"}
            itemValue={"value"}
            position={"below"}
            defaultValue={activeScreen.animationType}
            onChange={value => updateScreenData({ animationType: value })}
          />
          <HelpIcon
            {...{ label: helpIconText.EDITOR_IMAGE_CHANGE_ANIMATION }}
          />
        </div>
      </div>
    </div>
  );
};

export default compose(
  connect(null, {
    setDialog,
    getFileById,
    updateScreenData
  })
)(Images);
