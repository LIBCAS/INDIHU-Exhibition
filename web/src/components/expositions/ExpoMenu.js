import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button } from "react-md";

import { setDialog } from "../../actions/dialogActions";

const ExpoMenu = ({
  setDialog,
  id,
  title,
  url,
  canEdit,
  canDelete,
  expositions,
  activeExpo,
  state,
  inProgress
}) =>
  <Button
    id="expo-menu-card-action-menu"
    icon
    onClick={e => {
      e.stopPropagation();
      setDialog("ExpositionMenu", {
        id,
        title,
        url,
        canEdit,
        canDelete,
        expositions,
        activeExpo,
        state,
        inProgress
      });
    }}
  >
    more_vert
  </Button>;

export default withRouter(
  connect(
    ({ expo: { expositions, activeExpo } }) => ({
      expositions,
      activeExpo
    }),
    { setDialog }
  )(ExpoMenu)
);
