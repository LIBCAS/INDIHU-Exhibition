import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm } from "redux-form";
import { map } from "lodash";
import Dialog from "./dialog-wrap";
import Radio from "react-md/lib/SelectionControls/Radio";
import { moveFile, tabFile } from "../../actions/file-actions";
import { changeRadioState } from "../../actions/app-actions";
import { Trans, useTranslation } from "react-i18next";

const FileMove = ({
  handleSubmit,
  data,
  radio,
  structure,
  changeRadioState,
}) => {
  const { t } = useTranslation("expo", { keyPrefix: "fileMoveDialog" });

  const folders = structure ? structure.files : null;

  return (
    <Dialog
      title={t("title")}
      name="FileMove"
      handleSubmit={handleSubmit}
      submitLabel={t("submitLabel")}
    >
      <p>
        <Trans
          t={t}
          i18nKey={"whereToMoveFile"}
          values={{ fileName: data?.name ?? "" }}
        />
      </p>
      {folders && (
        <form onSubmit={handleSubmit}>
          {map(folders, (folder, i) => (
            <div key={i}>
              {folder.name ? (
                <Radio
                  id={`fileMove-${folder.name}`}
                  name={`FOLDER_${folder.name}`}
                  className="radio-option"
                  value={`FOLDER_${folder.name}`}
                  label={folder.name}
                  checkedIconChildren={"folder"}
                  uncheckedIconChildren={"folder_open"}
                  checked={radio === `FOLDER_${folder.name}`}
                  onChange={() => changeRadioState(`FOLDER_${folder.name}`)}
                />
              ) : (
                <Radio
                  id={`fileMove-${folder.name}`}
                  name={"ROOT"}
                  className="radio-option"
                  value={"ROOT"}
                  label={t("uncategorized")}
                  checkedIconChildren={"folder"}
                  uncheckedIconChildren={"folder_open"}
                  checked={radio === "ROOT"}
                  onChange={() => changeRadioState("ROOT")}
                />
              )}
            </div>
          ))}
        </form>
      )}
    </Dialog>
  );
};

export default compose(
  connect(
    ({
      dialog: { data },
      app: { radio },
      expo: {
        activeExpo: { structure },
      },
    }) => ({
      data,
      radio,
      structure,
    }),
    { changeRadioState }
  ),
  withHandlers({
    onSubmit: (dialog) => async (formData, dispatch, props) => {
      const { radio, data } = props;
      if (radio === "ROOT") dispatch(moveFile(data.file, null, data.folder));
      else dispatch(moveFile(data.file, radio.substr(7), data.folder));
      dispatch(tabFile(null));
      dialog.closeDialog();
    },
  }),
  reduxForm({
    form: "fileMove",
  })
)(FileMove);
