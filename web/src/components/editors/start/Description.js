import React from "react";
import { connect } from "react-redux";
import { compose, withState } from "recompose";
import { TextField, SelectField, FontIcon, Button, Checkbox } from "react-md";

import { setDialog } from "../../../actions/dialogActions";
import { getFileById } from "../../../actions/fileActions";
import AudioMusic from "../AudioMusic";
import HelpIcon from "../../HelpIcon";
import CharacterCount from "../CharacterCount";

import { helpIconText } from "../../../enums/text";
import { animationTypeViewStartEnum } from "../../../enums/animationType";

const Description = ({
  activeScreen,
  updateScreenData,
  setDialog,
  getFileById,
  error,
  setError
}) => {
  const image = getFileById(activeScreen.image);
  const audio = getFileById(activeScreen.audio);

  const setImage = image => {
    updateScreenData({ image: image.id });
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="description-container">
          <div className="part margin-bottom margin-horizontal">
            <div className="flex-row-nowrap">
              <TextField
                id="screen-start-textfield-title"
                label="Název"
                defaultValue={activeScreen.title}
                onChange={value => updateScreenData({ title: value })}
              />
              <HelpIcon {...{ label: helpIconText.EDITOR_DESCRIPTION_TITLE }} />
            </div>
            <div className="flex-row-nowrap">
              <TextField
                id="screen-start-textfield-subtitle"
                label="Podnázev"
                defaultValue={activeScreen.subTitle}
                onChange={value => updateScreenData({ subTitle: value })}
              />
              <HelpIcon
                {...{ label: helpIconText.EDITOR_DESCRIPTION_SUBTITLE }}
              />
            </div>
            <div className="flex-row-nowrap">
              <TextField
                id="screen-start-textfield-perex"
                label="Perex"
                rows={5}
                defaultValue={activeScreen.perex}
                onChange={value => updateScreenData({ perex: value })}
              />
              <HelpIcon {...{ label: helpIconText.EDITOR_DESCRIPTION_PEREX }} />
            </div>
            <CharacterCount {...{ text: activeScreen.perex }} />
          </div>
          <div className="part margin-horizontal">
            <div className="row flex-centered">
              <TextField
                id="screen-start-textfield-image"
                label="Obrázek na pozadí"
                value={image ? image.name : ""}
                disabled
              />
              {image &&
                <img
                  src={`/api/files/${image.fileId}`}
                  onLoad={({ target: img }) => {
                    updateScreenData({
                      imageOrigData: {
                        width: img.width,
                        height: img.height
                      }
                    });
                  }}
                  className="hidden"
                  alt=""
                />}
              <div className="row flex-centered">
                <FontIcon
                  className="icon"
                  onClick={() => updateScreenData({ image: null })}
                >
                  delete
                </FontIcon>
                <Button
                  raised
                  label="vybrat"
                  onClick={() =>
                    setDialog("ScreenFileChoose", {
                      onChoose: setImage,
                      typeMatch: new RegExp(/^image\/.*$/)
                    })}
                />
                <HelpIcon
                  {...{ label: helpIconText.EDITOR_START_DESCRIPTION_IMAGE }}
                />
              </div>
            </div>
            <div className="flex-row-nowrap flex-space-between flex-center">
              <SelectField
                id="screen-start-selectfield-animation"
                className="select-field"
                label="Animace obrázku"
                menuItems={animationTypeViewStartEnum}
                itemLabel={"label"}
                itemValue={"value"}
                position={"below"}
                defaultValue={activeScreen.animationType}
                onChange={value => updateScreenData({ animationType: value })}
              />
              <HelpIcon
                {...{ label: helpIconText.EDITOR_START_DESCRIPTION_ANIMATION }}
              />
            </div>
            <AudioMusic
              {...{
                textFieldLabel: "Audio verze výstavy",
                audio,
                updateScreenData,
                isAudio: true
              }}
            />
            <div className="flex-col">
              <div className="flex-row-nowrap">
                <div className="form-input form-input-with-suffix">
                  <TextField
                    id="screen-start-textfield-expoTime"
                    label="Délka trvání výstavy"
                    defaultValue={activeScreen.expoTime}
                    onChange={value => {
                      if (isNaN(Number(value)) || Number(value) > 1000000000) {
                        setError("Zadejte číslo v rozsahu 0 až 1000000000.");
                      } else {
                        setError(null);
                      }

                      updateScreenData({ expoTime: Math.abs(value) });
                    }}
                    type="number"
                  />
                  <span className="form-input-suffix">vteřin</span>
                </div>
                <HelpIcon
                  {...{
                    label: helpIconText.EDITOR_START_DESCRIPTION_EXPOTIME
                  }}
                />
              </div>
              {error &&
                <div>
                  <span className="invalid">
                    {error}
                  </span>
                </div>}
            </div>
            <div className="flex-row-nowrap">
              <TextField
                id="screen-start-textfield-organization"
                label="Organizace"
                defaultValue={activeScreen.organization}
                onChange={value => updateScreenData({ organization: value })}
              />
              <HelpIcon
                {...{
                  label: helpIconText.EDITOR_START_DESCRIPTION_ORGANIZATION
                }}
              />
            </div>
            <div className="row flex-centered">
              <Checkbox
                id="screen-start-checkbox-screencompleted"
                name="simple-checkboxes"
                label="Obrazovka je dokončená"
                checked={activeScreen.screenCompleted}
                value={activeScreen.screenCompleted}
                onChange={value => updateScreenData({ screenCompleted: value })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default compose(
  connect(null, { setDialog, getFileById }),
  withState("error", "setError", null)
)(Description);
