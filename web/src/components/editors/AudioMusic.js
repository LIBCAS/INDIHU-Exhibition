import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import TextField from "react-md/lib/TextFields";
import FontIcon from "react-md/lib/FontIcons";
import Button from "react-md/lib/Buttons/Button";

import HelpIcon from "../HelpIcon";

import { setDialog } from "../../actions/dialogActions";

import { helpIconText } from "../../enums/text";

const AudioMusic = ({
  isAudio,
  audio,
  music,
  updateScreenData,
  setDialog,
  textFieldLabel,
  id,
  helpIconTitle
}) =>
  <div className="row flex-centered">
    <TextField
      id={`editor-${isAudio ? "audio" : "music"}-textfield-music`}
      label={
        textFieldLabel
          ? textFieldLabel
          : isAudio ? "Zvuková stopa obrazovky" : "Zvuková stopa kapitoly"
      }
      value={audio ? audio.name : music ? music.name : ""}
      disabled
    />
    <div className="row flex-centered">
      <FontIcon
        className="icon"
        onClick={() =>
          isAudio
            ? updateScreenData({ audio: null, timeAuto: undefined })
            : updateScreenData({ music: null })}
      >
        delete
      </FontIcon>
      <Button
        raised
        label="vybrat"
        onClick={() =>
          setDialog("ScreenFileChoose", {
            onChoose: isAudio
              ? audio =>
                  updateScreenData({
                    audio: audio.id,
                    timeAuto: true,
                    time: audio.duration
                  })
              : music => updateScreenData({ music: music.id }),
            typeMatch: new RegExp(/^audio\/.*$/)
          })}
      />
      <HelpIcon
        {...{
          label: helpIconTitle
            ? helpIconTitle
            : isAudio ? helpIconText.EDITOR_AUDIO : helpIconText.EDITOR_MUSIC,
          id
        }}
      />
    </div>
  </div>;

export default compose(connect(null, { setDialog }))(AudioMusic);
