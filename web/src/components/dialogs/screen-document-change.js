import { connect } from "react-redux";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers, withState, lifecycle } from "recompose";
import { get } from "lodash";
import Button from "react-md/lib/Buttons/Button";
import Radio from "react-md/lib/SelectionControls/Radio";
import TextFieldMD from "react-md/lib/TextFields";

import Dialog from "./dialog-wrap";
import TextField from "../form/redux-form/text-field";
import SelectField from "../form/redux-form/select-field";
import * as Validation from "../form/redux-form/validation";

import { changeScreenDocument } from "../../actions/expoActions";
import { changeSwitchState } from "../../actions/app-actions";
import { tabFolder } from "../../actions/file-actions";

import { fileTypeOpts, documentOpts } from "../../enums/file-type";
import { useTranslation } from "react-i18next";

const ScreenDocumentChange = ({
  handleSubmit,
  setDialog,
  addDialogData,
  tabFolder,
  documentType,
  changeDocumentType,
  file,
  data,
  activeScreen,
  change,
}) => {
  const { t } = useTranslation(["expo", "expo-editor"]);

  return (
    <Dialog
      title={t("screenDocumentChangeDialog.title")}
      name="ScreenDocumentChange"
      submitLabel={t("screenDocumentChangeDialog.submitLabel")}
      handleSubmit={handleSubmit}
      onClose={() => tabFolder(null)}
    >
      <form onSubmit={handleSubmit}>
        <Field
          component={TextField}
          componentId="screen-document-change-textfield-filename"
          name="fileName"
          label={t("screenDocumentChangeDialog.documentNameField")}
          validate={[Validation.required]}
          onChange={(e, value) =>
            addDialogData("ScreenDocumentChange", { fileName: value })
          }
        />

        <Radio
          id="screen-document-change-radio-none"
          name="radioStatePrepare"
          className="radio-option"
          value={documentOpts[0].value}
          label={t("documentsTable.emptyLinkLabel", {
            ns: "expo-editor",
          })}
          checked={documentType === documentOpts[0].value}
          onClick={() => changeDocumentType(documentOpts[0].value)}
        />
        <Radio
          id="screen-document-change-radio-url"
          name="radioStatePrepare"
          className="radio-option"
          value={documentOpts[1].value}
          label={t("documentsTable.urlLabel", { ns: "expo-editor" })}
          checked={documentType === documentOpts[1].value}
          onClick={() => changeDocumentType(documentOpts[1].value)}
        />
        <Radio
          id="screen-document-change-radio-file"
          name="radioStatePrepare"
          className="radio-option"
          value={documentOpts[2].value}
          label={t("documentsTable.fileLabel", { ns: "expo-editor" })}
          checked={documentType === documentOpts[2].value}
          onClick={() => changeDocumentType(documentOpts[2].value)}
        />

        {documentType === documentOpts[1].value && (
          <div className="screen-document-change-url-selectfield">
            <Field
              component={TextField}
              componentId="screen-document-change-textfield-url"
              name="url"
              label={t("screenDocumentChangeDialog.urlAdressField")}
              validate={[Validation.required]}
              onChange={(e, value) =>
                addDialogData("ScreenDocumentChange", { url: value })
              }
            />
            <Field
              component={SelectField}
              componentId="screen-document-change-selectfield-urltype"
              name="urlType"
              label={t("screenDocumentChangeDialog.fileTypeField")}
              menuItems={fileTypeOpts}
              validate={[Validation.required]}
              onChange={(e, value) =>
                addDialogData("ScreenDocumentChange", { urlType: value })
              }
            />
          </div>
        )}

        {/* If File radio is selected */}
        {documentType === documentOpts[2].value && (
          <>
            <div className="flex-col">
              <TextFieldMD
                componentId="screen-document-change-textfield-name"
                value={get(file, "name", get(data, "name"))}
                label={t("screenDocumentChangeDialog.fileField")}
                disabled
              />
              <Button
                flat
                label={t("screenDocumentChangeDialog.selectActionLabel")}
                onClick={() =>
                  setDialog("ScreenDocumentChoose", {
                    onChoose: (file) => change("name", get(file, "name")),
                  })
                }
              />
            </div>

            {activeScreen?.type === "START" && (
              <div className="screen-document-change-file-selectfield">
                <Field
                  component={SelectField}
                  componentId="screen-document-change-selectfield-documentFileType"
                  name="documentFileType"
                  label={t("screenDocumentChangeDialog.typeOfChosenFile")}
                  menuItems={[
                    {
                      value: "exhibitionFile",
                      label: t("documentsTable.exhibitionFileLabel", {
                        ns: "expo-editor",
                      }),
                    },
                    {
                      value: "worksheet",
                      label: t("documentsTable.worksheetFileLabel", {
                        ns: "expo-editor",
                      }),
                    },
                  ]}
                  validate={[Validation.required]}
                  onChange={(e, value) =>
                    addDialogData("ScreenDocumentChange", {
                      documentFileType: value,
                    })
                  }
                />
              </div>
            )}
          </>
        )}
      </form>
    </Dialog>
  );
};

export default compose(
  connect(
    ({
      app: { switchState },
      dialog: { data, name },
      file: { file },
      expo: { activeScreen },
    }) => ({
      switchState,
      // data.documentFileType can be undefined.. this selectfield is new
      initialValues: file ? { ...file, ...data } : data,
      file,
      data,
      dialogName: name,
      activeScreen,
    }),
    { tabFolder, changeSwitchState, changeScreenDocument }
  ),
  withState("documentType", "changeDocumentType", "NONE"),
  withState("oldFile", "setOldFile", null),
  lifecycle({
    componentDidMount() {
      const {
        initialValues: { fileId, url },
        changeDocumentType,
      } = this.props;
      if (url) changeDocumentType(documentOpts[1].value);
      else if (fileId) changeDocumentType(documentOpts[2].value);
    },
    UNSAFE_componentWillReceiveProps({ dialogName, oldFile, initialValues }) {
      const { setOldFile } = this.props;

      if (dialogName === "ScreenDocumentChange" && !oldFile) {
        setOldFile(initialValues);
      } else if (dialogName !== "ScreenDocumentChange" && oldFile) {
        setOldFile(null);
      }
    },
  }),
  withHandlers({
    onSubmit:
      ({
        changeScreenDocument,
        closeDialog,
        file,
        tabFolder,
        oldFile,
        documentType,
      }) =>
      (formData) => {
        if (!oldFile) {
          throw new SubmissionError({
            fileName: "Nebyla provedena žádná úprava!",
          });
        }

        const whatToSpread = file !== null ? file : formData;

        if (
          changeScreenDocument(
            documentType === documentOpts[2].value
              ? {
                  ...whatToSpread,
                  documentFileType: formData.documentFileType,
                  fileName: formData.fileName,
                }
              : documentType === documentOpts[1].value
              ? {
                  fileName: formData.fileName,
                  url: formData.url,
                  urlType: formData.urlType,
                }
              : { fileName: formData.fileName },
            oldFile
          )
        ) {
          tabFolder(null);
          closeDialog();
        } else
          throw new SubmissionError({
            fileName: "*Soubor s tímto názvem již existuje",
          });
      },
  }),
  reduxForm({
    form: "screenDocumentChange",
    enableReinitialize: true,
  })
)(ScreenDocumentChange);
