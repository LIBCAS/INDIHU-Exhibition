import { connect } from "react-redux";
import TextField from "react-md/lib/TextFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";
import SelectField from "react-md/lib/SelectFields";

import AudioMusic from "../audio-music";
import Time from "../time";
import HelpIcon from "../../help-icon";

import { setDialog } from "../../../actions/dialog-actions";
import { getFileById } from "../../../actions/file-actions";

import { helpIconText } from "../../../enums/text";
import { horizontalPosition, verticalPosition } from "enums/screen-enums";

const Description = ({ activeScreen, updateScreenData, getFileById }) => {
  const music = getFileById(activeScreen.music);
  const audio = getFileById(activeScreen.audio);

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="description-container">
          <div className="part margin-bottom margin-horizontal">
            <div className="flex-row-nowrap">
              <TextField
                id="chapter-start-textfield-title"
                label="Název"
                defaultValue={activeScreen.title}
                onChange={(value) => updateScreenData({ title: value })}
              />
              <HelpIcon
                {...{
                  label: helpIconText.EDITOR_CHAPTER_START_DESCRIPTION_TITLE,
                  id: "editor-chapter-start-description-title",
                }}
              />
            </div>
            <div className="flex-row-nowrap">
              <TextField
                id="chapter-start-textfield-subtitle"
                label="Podnázev"
                defaultValue={activeScreen.subTitle}
                onChange={(value) => updateScreenData({ subTitle: value })}
              />
              <HelpIcon
                {...{
                  label: helpIconText.EDITOR_CHAPTER_START_DESCRIPTION_SUBTITLE,
                  id: "editor-chapter-start-description-title",
                }}
              />
            </div>
            <div className="row">
              <Checkbox
                id="chapter-start-checkbox-animateText"
                name="simple-checkboxes"
                label="Animovat úvodní text"
                checked={!!activeScreen.animateText}
                value={!!activeScreen.animateText}
                onChange={(value) => updateScreenData({ animateText: value })}
                className="checkbox-shift-left-by-padding"
              />
            </div>
            <div className="row">
              <SelectField
                id="chapter-start-selectfield-textPosition.horizontal"
                className="select-field big"
                label="Horizontální pozice textu"
                menuItems={[
                  { value: horizontalPosition.LEFT, label: "Vlevo" },
                  { value: horizontalPosition.CENTER, label: "Veprostřed" },
                  { value: horizontalPosition.RIGHT, label: "Vpravo" },
                ]}
                itemLabel={"label"}
                itemValue={"value"}
                position={"below"}
                defaultValue={activeScreen?.textPosition?.horizontal}
                onChange={(value) =>
                  updateScreenData({
                    textPosition: {
                      ...activeScreen?.textPosition,
                      horizontal: value,
                    },
                  })
                }
              />
              <SelectField
                id="chapter-start-selectfield-textPosition.vertical"
                className="select-field big"
                label="Vertikální pozice textu"
                menuItems={[
                  { value: verticalPosition.TOP, label: "Nahoře" },
                  { value: verticalPosition.CENTER, label: "Veprostřed" },
                  { value: verticalPosition.BOTTOM, label: "Dole" },
                ]}
                itemLabel={"label"}
                itemValue={"value"}
                position={"below"}
                defaultValue={activeScreen?.textPosition?.vertical}
                onChange={(value) =>
                  updateScreenData({
                    textPosition: {
                      ...activeScreen?.textPosition,
                      vertical: value,
                    },
                  })
                }
              />
            </div>
          </div>
          <div className="part margin-bottom margin-horizontal">
            <AudioMusic
              {...{
                isAudio: true,
                audio,
                updateScreenData,
                helpIconTitle:
                  helpIconText.EDITOR_CHAPTER_START_DESCRIPTION_AUDIO,
                id: "editor-chapter-start-description-audio",
              }}
            />
            <Time {...{ audio, activeScreen, updateScreenData }} />
            <AudioMusic
              {...{
                music,
                updateScreenData,
                helpIconTitle:
                  helpIconText.EDITOR_CHAPTER_START_DESCRIPTION_MUSIC,
                id: "editor-chapter-start-description-music",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(null, { setDialog, getFileById })(Description);
