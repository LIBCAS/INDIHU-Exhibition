import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm } from "redux-form";
import { get, find } from "lodash";
import { Button } from "react-md";

import Dialog from "./DialogWrap";
import { changeRadioState } from "../../actions/appActions";
import { loadExpo } from "../../actions/expoActions";
import { openViewer } from "../../utils";

const ExpositionMenu = ({
  handleSubmit,
  dialogData,
  history,
  setDialog,
  changeRadioState,
  loadExpo,
  closeDialog
}) => (
  <Dialog
    title={get(dialogData, "title", "Výstava")}
    name="ExpositionMenu"
    handleSubmit={handleSubmit}
    submitLabel="Zavřít"
    noStornoButton={true}
    style={{ width: 300 }}
  >
    <div className="flex-col flex-centered exposition-menu">
      <Button
        flat
        label="Upravit"
        onClick={e => {
          e.stopPropagation();
          closeDialog();
          if (
            get(dialogData, "canEdit") &&
            get(dialogData, "state") !== "ENDED"
          ) {
            history.push(`/expo/${get(dialogData, "id")}/structure`);
          } else {
            setDialog("Info", {
              title: "Nelze upravovat",
              text: "Výstavu nelze upravovat.",
              autoClose: true
            });
          }
        }}
        className="exposition-menu-button"
      />
      <Button
        flat
        label="Náhled"
        onClick={e => {
          e.stopPropagation();
          closeDialog();
          openViewer(`/view/${get(dialogData, "url")}`);
        }}
        className="exposition-menu-button"
      />
      <Button
        flat
        label="Změnit stav"
        onClick={e => {
          e.stopPropagation();
          closeDialog();
          setDialog("ExpoState", { id: get(dialogData, "id") });
          changeRadioState(
            find(get(dialogData, "expositions.items"), {
              id: get(dialogData, "id")
            })
              ? find(get(dialogData, "expositions.items"), {
                  id: get(dialogData, "id")
                }).state
              : null
          );
        }}
        className="exposition-menu-button"
      />
      <Button
        flat
        label="Přejmenovat"
        onClick={e => {
          e.stopPropagation();
          closeDialog();
          setDialog("ExpoRename", { id: get(dialogData, "id") });
        }}
        className="exposition-menu-button"
      />
      <Button
        flat
        label="Sdílet"
        onClick={async e => {
          e.stopPropagation();
          closeDialog();
          if (
            !get(dialogData, "activeExpo") ||
            get(dialogData, "activeExpo.id") !== get(dialogData, "id")
          )
            await loadExpo(get(dialogData, "id"));
          setDialog("ExpoShare", {
            id: get(dialogData, "id"),
            author: get(dialogData, "activeExpo.author")
          });
        }}
        className="exposition-menu-button"
      />
      {/*
      <Button
        flat
        label="Exportovat"
        onClick={e => {
          e.stopPropagation();
          closeDialog();
          setDialog("ExpoExport");
        }}
        className="exposition-menu-button"
      />
      */}
      <Button
        flat
        label="Duplikovat"
        onClick={e => {
          e.stopPropagation();
          closeDialog();
          setDialog("ExpoDuplicate", { id: get(dialogData, "id") });
        }}
        className="exposition-menu-button"
      />
      {get(dialogData, "canDelete") && (
        <div className="exposition-menu-divider" />
      )}
      {get(dialogData, "canDelete") && (
        <Button
          flat
          label="Smazat"
          onClick={e => {
            e.stopPropagation();
            closeDialog();
            setDialog("ExpoDelete", {
              id: get(dialogData, "id"),
              name: get(
                find(get(dialogData, "expositions.items"), {
                  id: get(dialogData, "id")
                }),
                "title"
              )
            });
          }}
          className="exposition-menu-button"
        />
      )}
    </div>
  </Dialog>
);

export default compose(
  connect(
    null,
    { changeRadioState, loadExpo }
  ),
  withHandlers({
    onSubmit: ({ closeDialog }) => () => {
      closeDialog();
    }
  }),
  reduxForm({
    form: "ExpositionMenuForm"
  })
)(ExpositionMenu);
