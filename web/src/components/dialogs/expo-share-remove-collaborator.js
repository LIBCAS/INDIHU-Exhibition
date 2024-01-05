import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { compose, withHandlers } from "recompose";

import Dialog from "./dialog-wrap";
import { removeCollaborator } from "../../actions/expoActions";
import { useTranslation, Trans } from "react-i18next";

const ExpoShareRemoveCollaborator = ({ handleSubmit, data }) => {
  const { t } = useTranslation("expo", {
    keyPrefix: "expoShareRemoveCollaboratorDialog",
  });

  return (
    <Dialog
      title={t("title")}
      name="ExpoShareRemoveCollaborator"
      submitLabel={t("submitLabel")}
      handleSubmit={handleSubmit}
    >
      <p>
        <Trans
          t={t}
          i18nKey="collaboratorWillBeRemoved"
          values={{ collaboratorName: data?.name ?? "" }}
        />
      </p>
    </Dialog>
  );
};

export default compose(
  connect(({ dialog: { data } }) => ({ data }), null),
  withHandlers({
    onSubmit: (dialog) => async (formData, dispatch, props) => {
      if (await dispatch(removeCollaborator(props.data.id)))
        dialog.closeDialog();
    },
  }),
  reduxForm({
    form: "expoShareRemoveCollaborator",
  })
)(ExpoShareRemoveCollaborator);
