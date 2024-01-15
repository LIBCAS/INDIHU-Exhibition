import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import Radio from "react-md/lib/SelectionControls/Radio";
import Dialog from "./dialog-wrap";
import { changeStateExpo } from "../../actions/expoActions";
import { changeRadioState } from "../../actions/app-actions";

import HelpIcon from "../help-icon";

import { expoState } from "../../enums/expo-state";
import { helpIconText } from "../../enums/text";
import { useTranslation } from "react-i18next";

const ExpoState = ({ handleSubmit, radio, changeRadioState }) => {
  const { t } = useTranslation("expo");

  return (
    <Dialog
      title={t("expoStateDialog.title")}
      name="ExpoState"
      handleSubmit={handleSubmit}
      submitLabel={t("expoStateDialog.submitLabel")}
    >
      <form onSubmit={handleSubmit}>
        <div className="radio-row">
          <Radio
            id="expo-state-radio-prepare"
            name="radioStatePrepare"
            className="radio-option"
            value={expoState.PREPARE}
            label={t("expoState.prepare")}
            checked={radio === expoState.PREPARE}
            onChange={() => changeRadioState(expoState.PREPARE)}
          />
          <HelpIcon
            label={helpIconText.EXPO_STATE_RADIO_PREPARE}
            id="react-tooltip-for-help-icon-in-dialog"
          />
        </div>
        <div className="radio-row">
          <Radio
            id="expo-state-radio-opened"
            name="radioStatePublic"
            className="radio-option"
            value={expoState.OPENED}
            label={t("expoState.opened")}
            checked={radio === expoState.OPENED}
            onChange={() => changeRadioState(expoState.OPENED)}
          />
          <HelpIcon
            label={helpIconText.EXPO_STATE_RADIO_OPENED}
            id="react-tooltip-for-help-icon-in-dialog"
          />
        </div>
        <div className="radio-row">
          <Radio
            id="expo-state-radio-ended"
            name="radioStateFinish"
            className="radio-option"
            value={expoState.ENDED}
            label={t("expoState.ended")}
            checked={radio === expoState.ENDED}
            onChange={() => changeRadioState(expoState.ENDED)}
          />
          <HelpIcon
            label={helpIconText.EXPO_STATE_RADIO_ENDED}
            id="react-tooltip-for-help-icon-in-dialog"
          />
        </div>
      </form>
    </Dialog>
  );
};

export default compose(
  connect(({ dialog: { data } }) => ({ data }), null),
  withRouter,
  connect(
    ({ app: { radio } }) => ({
      radio,
    }),
    { changeRadioState }
  ),
  withHandlers({
    onSubmit: (dialog) => async (formData, dispatch, props) => {
      if (await dispatch(changeStateExpo(props.data.id, props.radio))) {
        dialog.closeDialog();
      }
    },
  }),
  reduxForm({
    form: "expoState",
  })
)(ExpoState);
