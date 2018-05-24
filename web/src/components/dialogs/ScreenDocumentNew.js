import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers, withState } from "recompose";
import Button from "react-md/lib/Buttons/Button";
import Radio from "react-md/lib/SelectionControls/Radio";

import Dialog from "./DialogWrap";
import TextField from "../form/TextField";
import SelectField from "../form/SelectField";
import * as Validation from "../form/Validation";

import { addScreenDocument } from "../../actions/expoActions";
import { tabFolder } from "../../actions/fileActions";

import { fileType, fileTypeText } from "../../enums/fileType";

const fileTypeOpts = [
  { label: fileTypeText.AUDIO, value: fileType.AUDIO },
  { label: fileTypeText.IMAGE, value: fileType.IMAGE },
  { label: fileTypeText.PDF, value: fileType.PDF },
  { label: fileTypeText.VIDEO, value: fileType.VIDEO }
];

const documentOpts = [
  { label: "Žádny odkaz", value: "NONE" },
  { label: "URL", value: "URL" },
  { label: "Soubor", value: "FILE" }
];

const ScreenDocumentNew = ({
  handleSubmit,
  setDialog,
  addDialogData,
  initialValues,
  tabFolder,
  documentType,
  changeDocumentType
}) => {
  return (
    <Dialog
      title="Nový dokument"
      name="ScreenDocumentNew"
      submitLabel="Vytvořit"
      handleSubmit={handleSubmit}
      onClose={() => tabFolder(null)}
    >
      <form onSubmit={handleSubmit}>
        <Field
          component={TextField}
          componentId="screen-document-new-textfield-filename"
          name="fileName"
          label="Název dokumentu"
          validate={[Validation.required]}
          onChange={(e, value) =>
            addDialogData("ScreenDocumentNew", { fileName: value })}
        />

        <Radio
          id="screen-document-new-radio-none"
          name="radioStatePrepare"
          className="radio-option"
          value={documentOpts[0].value}
          label={documentOpts[0].label}
          checked={documentType === documentOpts[0].value}
          onClick={() => changeDocumentType(documentOpts[0].value)}
        />
        <Radio
          id="screen-document-new-radio-url"
          name="radioStatePrepare"
          className="radio-option"
          value={documentOpts[1].value}
          label={documentOpts[1].label}
          checked={documentType === documentOpts[1].value}
          onClick={() => changeDocumentType(documentOpts[1].value)}
        />
        <Radio
          id="screen-document-new-radio-file"
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
              componentId="screen-document-new-textfield-url"
              name="url"
              label="URL adresa"
              validate={[Validation.required]}
              onChange={(e, value) =>
                addDialogData("ScreenDocumentNew", { url: value })}
            />
            <Field
              component={SelectField}
              componentId="screen-document-new-selectfield-urltype"
              name="urlType"
              label="Typ souboru"
              menuItems={fileTypeOpts}
              validate={[Validation.required]}
              onChange={(e, value) =>
                addDialogData("ScreenDocumentNew", { urlType: value })}
            />
          </div>}
        {documentType === documentOpts[2].value &&
          <div className="flex-col">
            <Field
              component={TextField}
              componentId="screen-document-new-textfield-name"
              name="name"
              label="Soubor"
              validate={[Validation.required]}
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
    </Dialog>
  );
};

export default compose(
  connect(
    ({ dialog: { data }, file: { file } }) => ({
      initialValues: {
        name: !!file ? file.name : "",
        fileName: data && data.fileName ? data.fileName : "",
        url: data && data.url ? data.url : "",
        urlType: data && data.urlType ? data.urlType : ""
      },
      file
    }),
    { tabFolder }
  ),
  withState("documentType", "changeDocumentType", "NONE"),
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      const { file, tabFolder, documentType } = props;

      if (
        await dispatch(
          addScreenDocument(
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
                : { fileName: formData.fileName }
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
    form: "screenDocumentNew",
    enableReinitialize: true
  })
)(ScreenDocumentNew);
