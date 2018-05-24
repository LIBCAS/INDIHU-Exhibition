import React from "react";
import { connect } from "react-redux";
import Radio from "react-md/lib/SelectionControls/Radio";

import HelpIcon from "../HelpIcon";

import { changeStateExpo } from "../../actions/expoActions";

import { expoState, expoStateText } from "../../enums/expoState";
import { helpIconText } from "../../enums/text";

const StateOptions = ({ activeExpo, changeStateExpo }) =>
  <div>
    <div className="radio-row">
      <Radio
        id="expo-state-options-radio-prepare"
        name="radioStatePrepare"
        className="radio-option"
        value={expoState.PREPARE}
        label={expoStateText.PREPARE}
        checked={activeExpo.state === expoState.PREPARE}
        onClick={() => changeStateExpo(activeExpo.id, expoState.PREPARE)}
      />
      <HelpIcon {...{ label: helpIconText.STATE_OPTIONS_PREPARE }} />
    </div>
    <div className="radio-row">
      <Radio
        id="expo-state-options-radio-opened"
        name="radioStatePublic"
        className="radio-option"
        value={expoState.OPENED}
        label={expoStateText.OPENED}
        checked={activeExpo.state === expoState.OPENED}
        onClick={() => changeStateExpo(activeExpo.id, expoState.OPENED)}
      />
      <HelpIcon {...{ label: helpIconText.STATE_OPTIONS_OPENED }} />
    </div>
    <div className="radio-row">
      <Radio
        id="expo-state-options-radio-ended"
        name="radioStateFinish"
        className="radio-option"
        value={expoState.ENDED}
        label={expoStateText.ENDED}
        checked={activeExpo.state === expoState.ENDED}
        onClick={() => changeStateExpo(activeExpo.id, expoState.ENDED)}
      />
      <HelpIcon {...{ label: helpIconText.STATE_OPTIONS_ENDED }} />
    </div>
  </div>;

export default connect(({ expo: { activeExpo } }) => ({ activeExpo }), {
  changeStateExpo
})(StateOptions);
