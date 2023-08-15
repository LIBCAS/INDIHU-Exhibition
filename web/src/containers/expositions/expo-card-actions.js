import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Button from "react-md/lib/Buttons/Button";

import ExpoMenu from "./expo-menu";

import { setDialog } from "../../actions/dialog-actions";
import { changeRadioState } from "../../actions/app-actions";
import { loadExpo } from "../../actions/expoActions";
import { openViewer } from "../../utils";

const ExpoCardActions = ({
  id,
  title,
  url,
  canEdit,
  canDelete,
  inProgress,
  history,
  state,
  setDialog,
}) => (
  <div onClick={(e) => e.stopPropagation()}>
    <Button
      flat
      label="Upravit"
      onClick={() =>
        canEdit && state !== "ENDED"
          ? history.push(`/expo/${id}/structure`)
          : setDialog("Info", {
              title: "Nelze upravovat",
              text: "Výstavu nelze upravovat.",
              autoClose: true,
            })
      }
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
        title={title}
        canEdit={canEdit}
        canDelete={canDelete}
        url={url}
        state={state}
        history={history}
        inProgress={inProgress}
      />
    </div>
  </div>
);

export default withRouter(
  connect(
    ({ expo: { activeExpo } }) => ({
      activeExpo,
    }),
    { changeRadioState, loadExpo, setDialog }
  )(ExpoCardActions)
);
