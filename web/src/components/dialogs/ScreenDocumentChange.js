import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers, withState, lifecycle } from "recompose";
import { get } from "lodash";
import Button from "react-md/lib/Buttons/Button";
import Radio from "react-md/lib/SelectionControls/Radio";
import TextFieldMD from "react-md/lib/TextFields";

import Dialog from "./DialogWrap";
import TextField from "../form/TextField";
import SelectField from "../form/SelectField";
import * as Validation from "../form/Validation";

import { changeScreenDocument } from "../../actions/expoActions";
import { changeSwitchState } from "../../actions/appActions";
import { tabFolder } from "../../actions/fileActions";

import { fileType, fileTypeText } from "../../enums/fileType";

const fileTypeOpts = [
  { label: fileTypeText.AUDIO, value: fileType.AUDIO },
  { label: fileTypeText.IMAGE, value: fileType.IMAGE },
  { label: fileTypeText.PDF, value: fileType.PDF },
  { label: fileTypeText.VIDEO, value: fileType.VIDEO }
];

const documentOpts = [
  { label: "Žádný odkaz", value: "NONE" },
  { label: "URL", value: "URL" },
  { label: "Soubor", value: "FILE" }
];

const ScreenDocumentChange = ({
  handleSubmit,
  setDialog,
  addDialogData,
  tabFolder,
  documentType,
  changeDocumentType,
  file,
  data
}) =>
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
          addDialogData("ScreenDocumentChange", { fileName: value })}
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

      {documentType === documentOpts[1].value &&
        <div>
          <Field
            component={TextField}
            componentId="screen-document-change-textfield-url"
            name="url"
            label="URL adresa"
            validate={[Validation.required]}
            onChange={(e, value) =>
              addDialogData("ScreenDocumentChange", { url: value })}
          />
          <Field
            component={SelectField}
            componentId="screen-document-change-selectfield-urltype"
            name="urlType"
            label="Typ souboru"
            menuItems={fileTypeOpts}
            validate={[Validation.required]}
            onChange={(e, value) =>
              addDialogData("ScreenDocumentChange", { urlType: value })}
          />
        </div>}
      {documentType === documentOpts[2].value &&
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
                typeMatch: new RegExp(
                  /^(image\/png|image\/jpg|image\/jpeg|application\/pdf)$/
                )
              })}
          />
        </div>}
    </form>
  </Dialog>;

export default compose(
  connect(
    ({ app: { switchState }, dialog: { data }, file: { file } }) => ({
      switchState,
      initialValues: file ? { ...file, ...data } : data,
      file,
      data
    }),
    { tabFolder, changeSwitchState }
  ),
  withState("documentType", "changeDocumentType", "NONE"),
  lifecycle({
    componentDidMount() {
      const { initialValues: { fileId, url }, changeDocumentType } = this.props;
      if (url) changeDocumentType(documentOpts[1].value);
      else if (fileId) changeDocumentType(documentOpts[2].value);
    }
  }),
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      const { file, tabFolder, initialValues, documentType } = props;

      if (
        await dispatch(
          changeScreenDocument(
            documentType === documentOpts[2].value
              ? {
                  ...file,
                  fileName: formData.fileName
                }
              : documentType === documentOpts[1].value
                ? {
                    fileName: formData.fileName,
                    url: formData.url,
                    urlType: formData.urlType
                  }
                : { fileName: formData.fileName },
            initialValues
          )
        )
      ) {
        tabFolder(null);
        dialog.closeDialog();
      } else
        throw new SubmissionError({
          type: "*Soubor již existuje"
        });
    }
  }),
  reduxForm({
    form: "screenDocumentChange",
    enableReinitialize: true
  })
)(ScreenDocumentChange);
