import { connect } from "react-redux";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers, withState, lifecycle } from "recompose";
import { get } from "lodash";
import Button from "react-md/lib/Buttons/Button";
import Radio from "react-md/lib/SelectionControls/Radio";
import TextFieldMD from "react-md/lib/TextFields";

import Dialog from "./dialog-wrap";
import TextField from "../form/text-field";
import SelectField from "../form/select-field";
import * as Validation from "../form/validation";

import { changeScreenDocument } from "../../actions/expoActions";
import { changeSwitchState } from "../../actions/app-actions";
import { tabFolder } from "../../actions/file-actions";

import { fileTypeOpts, documentOpts } from "../../enums/file-type";

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
}) => (
  <Dialog
    title="Upravit dokument"
    name="ScreenDocumentChange"
    submitLabel="Upravit"
    handleSubmit={handleSubmit}
    onClose={() => tabFolder(null)}
  >
    <form onSubmit={handleSubmit}>
      <Field
        component={TextField}
        componentId="screen-document-change-textfield-filename"
        name="fileName"
        label="Název dokumentu"
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
        label={documentOpts[0].label}
        checked={documentType === documentOpts[0].value}
        onClick={() => changeDocumentType(documentOpts[0].value)}
      />
      <Radio
        id="screen-document-change-radio-url"
        name="radioStatePrepare"
        className="radio-option"
        value={documentOpts[1].value}
        label={documentOpts[1].label}
        checked={documentType === documentOpts[1].value}
        onClick={() => changeDocumentType(documentOpts[1].value)}
      />
      <Radio
        id="screen-document-change-radio-file"
        name="radioStatePrepare"
        className="radio-option"
        value={documentOpts[2].value}
        label={documentOpts[2].label}
        checked={documentType === documentOpts[2].value}
        onClick={() => changeDocumentType(documentOpts[2].value)}
      />

      {documentType === documentOpts[1].value && (
        <div>
          <Field
            component={TextField}
            componentId="screen-document-change-textfield-url"
            name="url"
            label="URL adresa"
            validate={[Validation.required]}
            onChange={(e, value) =>
              addDialogData("ScreenDocumentChange", { url: value })
            }
          />
          <Field
            component={SelectField}
            componentId="screen-document-change-selectfield-urltype"
            name="urlType"
            label="Typ souboru"
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
              label="Soubor"
              disabled
            />
            <Button
              flat
              label="Vybrat"
              onClick={() =>
                setDialog("ScreenDocumentChoose", {
                  onChoose: (file) => change("name", get(file, "name")),
                })
              }
            />
          </div>

          {activeScreen?.type === "START" && (
            <Field
              component={SelectField}
              componentId="screen-document-change-selectfield-documentFileType"
              name="documentFileType"
              label="Typ vybraného souboru"
              menuItems={[
                { value: "exhibitionFile", label: "Soubor k výstavě" },
                { value: "worksheet", label: "Pracovní list" },
              ]}
              validate={[Validation.required]}
              onChange={(e, value) =>
                addDialogData("ScreenDocumentChange", {
                  documentFileType: value,
                })
              }
            />
          )}
        </>
      )}
    </form>
  </Dialog>
);

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
