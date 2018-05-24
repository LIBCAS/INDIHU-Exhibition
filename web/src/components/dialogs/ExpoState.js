import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import Radio from "react-md/lib/SelectionControls/Radio";
import Dialog from "./DialogWrap";
import { changeStateExpo } from "../../actions/expoActions";
import { changeRadioState } from "../../actions/appActions";

import HelpIcon from "../HelpIcon";

import { expoState, expoStateText } from "../../enums/expoState";
import { helpIconText } from "../../enums/text";

const ExpoState = ({ handleSubmit, radio, changeRadioState }) =>
  <Dialog
    title="Změna stavu výstavy"
    name="ExpoState"
    handleSubmit={handleSubmit}
    submitLabel="Změnit"
  >
    <form onSubmit={handleSubmit}>
      <div className="radio-row">
        <Radio
          id="expo-state-radio-prepare"
          name="radioStatePrepare"
          className="radio-option"
          value={expoState.PREPARE}
          label={expoStateText.PREPARE}
          checked={radio === expoState.PREPARE}
          onChange={() => changeRadioState(expoState.PREPARE)}
        />
        <HelpIcon {...{ label: helpIconText.EXPO_STATE_RADIO_PREPARE }} />
      </div>
      <div className="radio-row">
        <Radio
          id="expo-state-radio-opened"
          name="radioStatePublic"
          className="radio-option"
          value={expoState.OPENED}
          label={expoStateText.OPENED}
          checked={radio === expoState.OPENED}
          onChange={() => changeRadioState(expoState.OPENED)}
        />
        <HelpIcon {...{ label: helpIconText.EXPO_STATE_RADIO_OPENED }} />
      </div>
      <div className="radio-row">
        <Radio
          id="expo-state-radio-ended"
          name="radioStateFinish"
          className="radio-option"
          value={expoState.ENDED}
          label={expoStateText.ENDED}
          checked={radio === expoState.ENDED}
          onChange={() => changeRadioState(expoState.ENDED)}
        />
        <HelpIcon {...{ label: helpIconText.EXPO_STATE_RADIO_ENDED }} />
      </div>
    </form>
  </Dialog>;

export default compose(
  connect(({ dialog: { data } }) => ({ data }), null),
  withRouter,
  connect(
    ({ app: { radio } }) => ({
      radio
    }),
    { changeRadioState }
  ),
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      if (await dispatch(changeStateExpo(props.data.id, props.radio))) {
        dialog.closeDialog();
      }
    }
  }),
  reduxForm({
    form: "expoState"
  })
)(ExpoState);
