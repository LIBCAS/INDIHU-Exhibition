import { connect } from "react-redux";
import { get } from "lodash";
import { compose, withHandlers } from "recompose";
import { reduxForm } from "redux-form";
import { FontIcon } from "react-md/lib";

import Dialog from "./dialog-wrap";
import { deleteFile, tabFile, isFileUsed } from "../../actions/file-actions";
import { useTranslation, Trans } from "react-i18next";

const FileDelete = ({ handleSubmit, data, isFileUsed, dialogName }) => {
  const { t } = useTranslation("expo", { keyPrefix: "fileDeleteDialog" });

  const screen =
    data && dialogName === "FileDelete" ? isFileUsed(data.id) : false;

  return (
    <Dialog
      title={<FontIcon className="color-black">delete</FontIcon>}
      name="FileDelete"
      handleSubmit={handleSubmit}
      submitLabel={t("submitLabel")}
    >
      <p>
        <Trans
          t={t}
          i18nKey="warningText"
          values={{ fileName: get(data, "name", "") }}
          components={{ strong: <strong /> }}
        />
      </p>
      <div className="flex-row-nowrap flex-center">
        <FontIcon className="color-red">priority_high</FontIcon>
        <p style={{ fontSize: "0.9em" }}>
          <strong>{t("actionIsIrreversible")}</strong>
        </p>
      </div>
      {screen ? (
        <p style={{ fontSize: "0.9em", marginLeft: 24 }}>
          <br />
          {t("fileIsUsedInScreen")} <strong>{screen}</strong>.
        </p>
      ) : (
        ""
      )}
    </Dialog>
  );
};

export default compose(
  connect(({ dialog: { data, name } }) => ({ data, dialogName: name }), {
    isFileUsed,
  }),
  withHandlers({
    onSubmit: (dialog) => async (_, dispatch, props) => {
      if (await dispatch(deleteFile(props.data.id))) {
        dispatch(tabFile(null));
      }
      dialog.closeDialog();
    },
  }),
  reduxForm({
    form: "fileDelete",
  })
)(FileDelete);
