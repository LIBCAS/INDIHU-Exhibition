import { useTranslation, Trans } from "react-i18next";

import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import { get } from "lodash";
import { FontIcon } from "react-md/lib";

import Dialog from "./dialog-wrap";
import { deleteExpo } from "../../actions/expoActions";

const ExpoDelete = ({ handleSubmit, data }) => {
  const { t } = useTranslation("expo", { keyPrefix: "expoDeleteDialog" });

  return (
    <Dialog
      title={<FontIcon className="color-black">delete</FontIcon>}
      name="ExpoDelete"
      handleSubmit={handleSubmit}
      submitLabel={t("submitLabel")}
    >
      <p>
        <Trans
          t={t}
          i18nKey="expoWillBeDeleted"
          values={{ expoName: get(data, "name") }}
          components={{ strong: <strong /> }}
        />
      </p>
      <div className="flex-row-nowrap flex-center">
        <FontIcon className="color-red">priority_high</FontIcon>
        <p>
          <strong style={{ fontSize: "0.9em" }}>
            {t("actionIsPermanent")}
          </strong>
        </p>
      </div>
    </Dialog>
  );
};

export default compose(
  connect(({ dialog: { data } }) => ({ data }), null),
  withRouter,
  withHandlers({
    onSubmit: (dialog) => async (_, dispatch, props) => {
      if (await dispatch(deleteExpo(props.data.id))) {
        dialog.closeDialog();
      }
    },
  }),
  reduxForm({
    form: "expoDelete",
  })
)(ExpoDelete);
