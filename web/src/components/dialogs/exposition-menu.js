import { useTranslation } from "react-i18next";

import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm } from "redux-form";
import { get, find } from "lodash";
import { Button } from "react-md";

import Dialog from "./dialog-wrap";
import { changeRadioState } from "../../actions/app-actions";
import { loadExpo } from "../../actions/expoActions";
import { openViewer } from "../../utils";

const ExpositionMenu = ({
  handleSubmit,
  dialogData,
  history,
  setDialog,
  changeRadioState,
  loadExpo,
  closeDialog,
}) => {
  const { t } = useTranslation("exhibitions-page");

  return (
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
          label={t("expoCardActions.update")}
          onClick={(e) => {
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
                autoClose: true,
              });
            }
          }}
          className="exposition-menu-button"
        />
        <Button
          flat
          label={t("expoCardActions.preview")}
          onClick={(e) => {
            e.stopPropagation();
            closeDialog();
            openViewer(`/view/${get(dialogData, "url")}`);
          }}
          className="exposition-menu-button"
        />
        <Button
          flat
          label={t("expoCardActions.stateChange")}
          onClick={(e) => {
            e.stopPropagation();
            closeDialog();
            setDialog("ExpoState", { id: get(dialogData, "id") });
            changeRadioState(
              find(get(dialogData, "expositions.items"), {
                id: get(dialogData, "id"),
              })
                ? find(get(dialogData, "expositions.items"), {
                    id: get(dialogData, "id"),
                  }).state
                : null
            );
          }}
          className="exposition-menu-button"
        />
        <Button
          flat
          label={t("expoCardActions.rename")}
          onClick={(e) => {
            e.stopPropagation();
            closeDialog();
            setDialog("ExpoRename", { id: get(dialogData, "id") });
          }}
          className="exposition-menu-button"
        />
        <Button
          flat
          label={t("expoCardActions.share")}
          onClick={async (e) => {
            e.stopPropagation();
            closeDialog();
            if (
              !get(dialogData, "activeExpo") ||
              get(dialogData, "activeExpo.id") !== get(dialogData, "id")
            )
              await loadExpo(get(dialogData, "id"));
            setDialog("ExpoShare", {
              expoId: get(dialogData, "id"),
            });
          }}
          className="exposition-menu-button"
        />
        <Button
          flat
          label={t("expoCardActions.duplicate")}
          onClick={(e) => {
            e.stopPropagation();
            closeDialog();
            setDialog("ExpoDuplicate", {
              id: get(dialogData, "id"),
              expositionsFilterState: get(dialogData, "expositionsFilterState"),
            });
          }}
          className="exposition-menu-button"
        />
        {get(dialogData, "canDelete") && (
          <div className="exposition-menu-divider" />
        )}
        {get(dialogData, "canDelete") && (
          <Button
            flat
            label={t("expoCardActions.delete")}
            onClick={(e) => {
              e.stopPropagation();
              closeDialog();
              setDialog("ExpoDelete", {
                id: get(dialogData, "id"),
                name: get(
                  find(get(dialogData, "expositions.items"), {
                    id: get(dialogData, "id"),
                  }),
                  "title"
                ),
              });
            }}
            className="exposition-menu-button"
          />
        )}
      </div>
    </Dialog>
  );
};

export default compose(
  connect(null, { changeRadioState, loadExpo }),
  withHandlers({
    onSubmit:
      ({ closeDialog }) =>
      () => {
        closeDialog();
      },
  }),
  reduxForm({
    form: "ExpositionMenuForm",
  })
)(ExpositionMenu);
