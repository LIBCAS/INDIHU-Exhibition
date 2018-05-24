import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MenuButton from "react-md/lib/Menus/MenuButton";
import ListItem from "react-md/lib/Lists/ListItem";
import Divider from "react-md/lib/Dividers";
import { find } from "lodash";

import { setDialog } from "../../actions/dialogActions";
import { changeRadioState } from "../../actions/appActions";
import { loadExpo } from "../../actions/expoActions";
import { openViewer } from "../../utils";

const ExpoMenu = ({
  setDialog,
  id,
  url,
  canEdit,
  canDelete,
  history,
  expositions,
  changeRadioState,
  activeExpo,
  loadExpo,
  state,
  inProgress
}) =>
  <MenuButton
    id="expo-menu-card-action-menu"
    icon
    buttonChildren="more_vert"
    onClick={e => e.stopPropagation()}
  >
    <ListItem
      primaryText="Upravit"
      onClick={e => {
        e.stopPropagation();
        if (canEdit && state !== "ENDED" && !inProgress) {
          history.push(`/expo/${id}/structure`);
        } else {
          setDialog("Info", {
            title: "Nelze upravovat",
            text: "Výstavu nelze upravovat.",
            autoClose: true
          });
        }
      }}
      className="action"
    />
    <ListItem
      primaryText="Náhled"
      className="action"
      onClick={e => {
        e.stopPropagation();
        openViewer(`/view/${url}`);
      }}
    />
    <ListItem
      primaryText="Změnit stav"
      onClick={e => {
        e.stopPropagation();
        setDialog("ExpoState", { id });
        changeRadioState(
          find(expositions.items, { id })
            ? find(expositions.items, { id }).state
            : null
        );
      }}
    />
    <ListItem
      primaryText="Přejmenovat"
      onClick={e => {
        e.stopPropagation();
        setDialog("ExpoRename", { id });
      }}
    />
    <ListItem
      primaryText="Sdílet"
      onClick={async e => {
        e.stopPropagation();
        if (!activeExpo || activeExpo.id !== id) await loadExpo(id);
        setDialog("ExpoShare", { id, author: activeExpo.author });
      }}
    />
    <ListItem
      primaryText="Exportovat"
      onClick={e => {
        e.stopPropagation();
        setDialog("ExpoExport");
      }}
    />
    <ListItem
      primaryText="Duplikovat"
      onClick={e => {
        e.stopPropagation();
        setDialog("ExpoDuplicate", { id });
      }}
    />
    {canDelete && <Divider />}
    {canDelete &&
      <ListItem
        primaryText="Smazat"
        onClick={e => {
          e.stopPropagation();
          setDialog("ExpoDelete", {
            id,
            name: find(expositions, { id })
              ? find(expositions, { id }).title
              : null
          });
        }}
      />}
  </MenuButton>;

export default withRouter(
  connect(
    ({ expo: { expositions, activeExpo } }) => ({
      expositions,
      activeExpo
    }),
    { setDialog, changeRadioState, loadExpo }
  )(ExpoMenu)
);
