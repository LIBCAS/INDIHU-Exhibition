import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { get, isEmpty } from "lodash";
import { reduxForm } from "redux-form";
import { FontIcon } from "react-md/lib";

import Dialog from "./dialog-wrap";
import { deleteFolder, isFileInFolderUsed } from "../../actions/file-actions";
import { useTranslation, Trans } from "react-i18next";

const FileDeleteFolder = ({ handleSubmit, data, isFileInFolderUsed }) => {
  const { t } = useTranslation("expo", { keyPrefix: "fileDeleteFolderDialog" });

  const screens = data ? isFileInFolderUsed(data.name) : false;

  return (
    <Dialog
      title={<FontIcon className="color-black">delete</FontIcon>}
      name="FileDeleteFolder"
      handleSubmit={handleSubmit}
      submitLabel={t("submitLabel")}
    >
      <p>
        <Trans
          t={t}
          i18nKey="warningText"
          values={{ folderName: get(data, "name", "") }}
          components={{ strong: <strong /> }}
        />
      </p>
      <div className="flex-row-nowrap flex-center">
        <FontIcon className="color-red">priority_high</FontIcon>
        <p style={{ fontSize: "0.9em" }}>
          <strong>{t("actionIsIrreversible")}</strong>
        </p>
      </div>
      {!isEmpty(screens) ? (
        <p style={{ fontSize: "0.9em", marginLeft: 24 }}>
          <br />
          {t("folderFilesAreUsedInFollowingScreens")}
          {screens.map((screen) => (
            <span key={screen}>
              <br />
              <strong>{screen}</strong>
            </span>
          ))}
          .
        </p>
      ) : (
        ""
      )}
    </Dialog>
  );
};

export default compose(
  connect(({ dialog: { data } }) => ({ data }), {
    isFileInFolderUsed,
  }),
  withHandlers({
    onSubmit: (dialog) => async (_, dispatch, props) => {
      dispatch(deleteFolder(props.data.name));
      dialog.closeDialog();
    },
  }),
  reduxForm({
    form: "fileDeleteFolder",
  })
)(FileDeleteFolder);
