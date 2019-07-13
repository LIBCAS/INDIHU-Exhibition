import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm } from "redux-form";
import { get, map } from "lodash";
import { Button } from "react-md";

import Dialog from "./DialogWrap";
import { changeRadioState } from "../../actions/appActions";
import { loadExpo } from "../../actions/expoActions";

const ViewWrapChapters = ({
  handleSubmit,
  dialogData,
  history,
  closeDialog
}) => (
  <Dialog
    title="Kapitoly"
    name="ViewWrapChapters"
    handleSubmit={handleSubmit}
    noDialogMenu={true}
    noOverflowScrollOnClose={true}
  >
    <div className="flex-col flex-centered viewer-chapters">
      {map(
        get(dialogData, "chapters"),
        ({ chapter: { title }, chapterNumber }, key) => (
          <Button
            key={key}
            flat
            label={title}
            onClick={() => {
              closeDialog();
              history.push(
                `/view/${get(dialogData, "url")}/${chapterNumber}/0`
              );
            }}
            className="viewer-chapters-button"
          />
        )
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
    form: "ViewWrapChaptersForm"
  })
)(ViewWrapChapters);
