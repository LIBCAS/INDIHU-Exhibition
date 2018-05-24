import React from "react";
import { connect } from "react-redux";
import TextField from "react-md/lib/TextFields";
import FontIcon from "react-md/lib/FontIcons";
import Button from "react-md/lib/Buttons/Button";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";
import { setDialog } from "../../../actions/dialogActions";
import { getFileById } from "../../../actions/fileActions";

import AudioMusic from "../AudioMusic";
import HelpIcon from "../../HelpIcon";
import CharacterCount from "../CharacterCount";

import { helpIconText } from "../../../enums/text";

const Description = ({
  activeScreen,
  updateScreenData,
  setDialog,
  getFileById
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
            <AudioMusic
              {...{
                textFieldLabel: "Audio verze výstavy",
                audio,
                updateScreenData,
                isAudio: true
              }}
            />
            <div className="flex-row-nowrap">
              <div className="form-input">
                <TextField
                  id="screen-start-textfield-expoTime"
                  label="Délka trvání výstavy"
                  defaultValue={activeScreen.expoTime}
                  onChange={value => {
                    if (!isNaN(Number(value)))
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

export default connect(null, { setDialog, getFileById })(Description);
