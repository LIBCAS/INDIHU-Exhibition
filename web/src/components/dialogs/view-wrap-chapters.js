import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm } from "redux-form";
import { get, map } from "lodash";
import { Button } from "react-md";

import Dialog from "./dialog-wrap";
import { changeRadioState } from "../../actions/app-actions";
import { loadExpo } from "../../actions/expoActions";
import { useTranslation } from "react-i18next";

const ViewWrapChapters = ({
  handleSubmit,
  dialogData,
  history,
  closeDialog,
}) => {
  const { t } = useTranslation("expo", { keyPrefix: "viewWrapChapterDialog" });

  return (
    <Dialog
      title={t("title")}
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
    form: "ViewWrapChaptersForm",
  })
)(ViewWrapChapters);
