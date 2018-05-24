import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Button from "react-md/lib/Buttons/Button";

import ExpoMenu from "./ExpoMenu";

import { setDialog } from "../../actions/dialogActions";
import { changeRadioState } from "../../actions/appActions";
import { loadExpo } from "../../actions/expoActions";
import { openViewer } from "../../utils";

const ExpoCardActions = ({
  id,
  url,
  canEdit,
  canDelete,
  inProgress,
  history,
  changeRadioState,
  activeExpo,
  loadExpo,
  state,
  setDialog
}) =>
  <div onClick={e => e.stopPropagation()}>
    <Button
      flat
      label="Upravit"
      onClick={() =>
        canEdit && state !== "ENDED" && !inProgress
          ? history.push(`/expo/${id}/structure`)
          : setDialog("Info", {
              title: "Nelze upravovat",
              text: "Výstavu nelze upravovat.",
              autoClose: true
            })}
      className="action-button"
    />
    <Button
      flat
      label="Náhled"
      className="action-button"
      onClick={() => openViewer(`/view/${url}`)}
    />
    <div className="expo-more">
      <ExpoMenu
        id={id}
        canEdit={canEdit}
        canDelete={canDelete}
        url={url}
        state={state}
        history={history}
        inProgress={inProgress}
      />
    </div>
  </div>;

export default withRouter(
  connect(
    ({ expo: { activeExpo } }) => ({
      activeExpo
    }),
    { changeRadioState, loadExpo, setDialog }
  )(ExpoCardActions)
);
