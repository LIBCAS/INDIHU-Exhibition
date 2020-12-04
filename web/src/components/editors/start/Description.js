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
import { giveMeExpoTime } from "../../../utils";

const Description = ({ activeExpo, activeScreen, updateScreenData, setDialog, getFileById, error, setError }) => {
  const image = getFileById(activeScreen.image);
  const audio = getFileById(activeScreen.audio);

  const setImage = image => {
    updateScreenData({ image: image.id });
  };

  const expoTime = giveMeExpoTime(activeExpo.structure.screens);

  const expoTimeNumber = Number(activeScreen.expoTime);

  const expoTimeValue = isNaN(expoTimeNumber) ? 0 : Math.round(expoTimeNumber / 60);

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
              <HelpIcon
                {...{
                  label: helpIconText.EDITOR_START_DESCRIPTION_TITLE,
                  id: "editor-start-description-title"
                }}
              />
            </div>
            <div className="flex-row-nowrap">
              <TextField
                id="screen-start-textfield-subtitle"
                label="Podnázev"
                defaultValue={activeScreen.subTitle}
                onChange={value => updateScreenData({ subTitle: value })}
              />
              <HelpIcon
                {...{
                  label: helpIconText.EDITOR_START_DESCRIPTION_SUBTITLE,
                  id: "editor-start-description-subtitle"
                }}
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
              <HelpIcon
                {...{
                  label: helpIconText.EDITOR_START_DESCRIPTION_PEREX,
                  id: "editor-start-description-perex"
                }}
              />
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
              {image && (
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
                />
              )}
              <div className="row flex-centered">
                {image && (
                  <FontIcon
                    className="icon"
                    onClick={() =>
                      setDialog("ConfirmDialog", {
                        title: <FontIcon className="color-black">delete</FontIcon>,
                        text: "Opravdu chcete odstranit obrázek?",
                        onSubmit: () => updateScreenData({ image: null })
                      })
                    }
                  >
                    delete
                  </FontIcon>
                )}
                <Button
                  raised
                  label="vybrat"
                  onClick={() =>
                    setDialog("ScreenFileChoose", {
                      onChoose: setImage,
                      typeMatch: new RegExp(/^image\/.*$/),
                      accept: "image/*"
                    })
                  }
                />
                <HelpIcon
                  {...{
                    label: helpIconText.EDITOR_START_DESCRIPTION_IMAGE,
                    id: "editor-start-description-image"
                  }}
                />
              </div>
            </div>
            <div className="flex-row-nowrap flex-space-between flex-center">
              <SelectField
                id="screen-start-selectfield-animation"
                className="select-field big"
                label="Animace obrázku"
                menuItems={animationTypeViewStartEnum}
                itemLabel={"label"}
                itemValue={"value"}
                position={"below"}
                defaultValue={activeScreen.animationType}
                onChange={value => updateScreenData({ animationType: value })}
              />
              <HelpIcon
                {...{
                  label: helpIconText.EDITOR_START_DESCRIPTION_ANIMATION,
                  id: "editor-start-description-animation"
                }}
              />
            </div>
            <AudioMusic
              {...{
                textFieldLabel: "Audio verze výstavy",
                audio,
                updateScreenData,
                isAudio: true,
                helpIconTitle: helpIconText.EDITOR_START_DESCRIPTION_AUDIO,
                id: "editor-start-description-audio"
              }}
            />
            <div className="flex-col">
              <div className="flex-row-nowrap">
                <div className="form-input form-input-with-suffix">
                  <TextField
                    id="screen-start-textfield-expoTime"
                    label="Délka trvání výstavy"
                    defaultValue={expoTimeValue}
                    onChange={value => {
                      const numberValue = Number(value);
                      const nan = isNaN(numberValue);

                      if (nan || numberValue > 1000000) {
                        setError("Zadejte číslo v rozsahu 0 až 1000000.");
                      } else {
                        setError(null);
                      }

                      updateScreenData({ expoTime: !nan ? Math.abs(numberValue * 60) : value });
                    }}
                    type="number"
                  />
                  <span className="form-input-suffix">min</span>
                </div>
                <HelpIcon
                  {...{
                    label: helpIconText.EDITOR_START_DESCRIPTION_EXPOTIME,
                    id: "editor-start-description-expotime"
                  }}
                />
              </div>
              {error && (
                <div>
                  <span className="invalid">{error}</span>
                </div>
              )}
              <div className="margin-bottom-small">
                Odhadovaný čas bez her: <b>{expoTime}</b>
              </div>
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
                  label: helpIconText.EDITOR_START_DESCRIPTION_ORGANIZATION,
                  id: "editor-start-description-organization"
                }}
              />
            </div>
            <div className="flex-row-nowrap">
              <TextField
                id="screen-start-textfield-organization-link"
                label="Odkaz na webové stránky organizace"
                defaultValue={activeScreen.organizationLink}
                onChange={value => updateScreenData({ organizationLink: value })}
              />
              <HelpIcon
                {...{
                  label: helpIconText.EDITOR_START_DESCRIPTION_ORGANIZATION_LINK,
                  id: "editor-start-description-organization-link"
                }}
              />
            </div>
            <div className="row">
              <Checkbox
                id="screen-start-checkbox-screencompleted"
                name="simple-checkboxes"
                label="Obrazovka je dokončená"
                checked={activeScreen.screenCompleted}
                value={activeScreen.screenCompleted}
                onChange={value => updateScreenData({ screenCompleted: value })}
                className="checkbox-no-padding-left"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default compose(
  connect(
    null,
    { setDialog, getFileById }
  ),
  withState("error", "setError", null)
)(Description);
