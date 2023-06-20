import { compose, withHandlers, withState, lifecycle } from "recompose";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";

import Dialog from "./dialog-wrap";
import TextField from "../form/text-field";
import SelectField from "../form/select-field";
import CheckBox from "../form/check-box";
import * as Validation from "../form/validation";

import Button from "react-md/lib/Buttons/Button";
import Radio from "react-md/lib/SelectionControls/Radio";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";

import { updateScreenData } from "actions/expoActions";
import { tabFolder } from "actions/file-actions";

import { fileTypeOpts } from "enums/file-type";

// document file (pdf) = { name, type, size, created, id, fileId }
// .mp4, ,mp3 file = { name, type, size, created, id, fileId, duration }
// image file = { name, type, size, created, id, fileId, thumbnailId }

/* ScreenInfopointDialog */
/* properties setDialog, closeDialog, addDialogData, dialogData, history are passed from parent Dialogs.index.js  */
/* New or Edited Infopoint - optional header, mandatory Text or Image or Video, optional URL link */
const ScreenInfopoint = ({ dialogData, setDialog, ...otherProps }) => {
  const {
    infopointContentType, // props by recompose withState
    setInfopointContentType,
    infopointIsUrlIncluded,
    setInfopointIsUrlIncluded,
    setImageFile,
    setVideoFile,
    setDocumentFile,
    handleSubmit, // props by recompose withHandlers
    customResetForm, // prop by withHandlers
    dispatch, // props by redux-form HOC
    reset,
    change,
  } = otherProps;

  if (dialogData === null || dialogData === undefined) {
    return null;
  }

  return (
    <Dialog
      title={
        dialogData.dialogType === "add" ? "Nový infopoint" : "Updavit infopoint"
      }
      name="ScreenInfopoint"
      submitLabel={dialogData.dialogType === "add" ? "Vytvořit" : "Upravit"}
      handleSubmit={handleSubmit}
      onClose={() => customResetForm(dispatch, reset)}
    >
      <form onSubmit={handleSubmit}>
        {/* A) Infopoint Header */}
        <Field
          component={TextField}
          componentId="form-header"
          name="header"
          label="Nadpis infopointu"
          //onChange={(e, value) => console.log("value: ", value)}
        />

        {/* B) Infopoint Body Radio Selection */}
        <div style={{ marginTop: "16px" }}>
          <Radio
            id="radio-text"
            name="radioInfopointContentType"
            className="radio-option"
            label={"Text"}
            value={"TEXT"}
            checked={infopointContentType === "TEXT"}
            onClick={() => setInfopointContentType("TEXT")}
          />
          <Radio
            id="radio-image"
            name="radioInfopointContentType"
            className="radio-option"
            label={"Obrázok"}
            value={"IMAGE"}
            checked={infopointContentType === "IMAGE"}
            onClick={() => setInfopointContentType("IMAGE")}
          />
          <Radio
            id="radio-video"
            name="radioInfopointContentType"
            className="radio-option"
            label="Video"
            value="VIDEO"
            checked={infopointContentType === "VIDEO"}
            onClick={() => setInfopointContentType("VIDEO")}
          />
          <Radio
            id="radio-document"
            name="radioInfopointContentType"
            className="radio-option"
            label="Dokument"
            value="DOCUMENT"
            checked={infopointContentType === "DOCUMENT"}
            onClick={() => setInfopointContentType("DOCUMENT")}
          />
        </div>

        {/* B1) Infopoint Text Body */}
        {infopointContentType === "TEXT" && (
          <Field
            component={TextField}
            componentId="form-text"
            name="text"
            warn={(value) => {
              if (value?.length && value.length >= 150) {
                return "Text je příliš dlouhý";
              }
              return undefined;
            }}
            label="Textový popis infopointu"
            //onChange={(e, value) => console.log("value: ", value)}
            multiLine
          />
        )}

        {/* B2) Infopoint Image Body */}
        {infopointContentType === "IMAGE" && (
          <div className="flex-col">
            <Field
              component={TextField}
              componentId="form-image"
              disabled
              name="imageName"
              label="Soubor obrázku"
              //validate
            />
            <Button
              flat
              label="Vybrat"
              onClick={() => {
                setDialog("ScreenFileChoose", {
                  onChoose: (file) => {
                    change("imageName", file.name);
                    setImageFile(file);
                  },
                  typeMatch: new RegExp(/^image\/.*$/),
                  accept: "image/*",
                });
              }}
            />
          </div>
        )}

        {/* B3) Infopoint Video Body */}
        {infopointContentType === "VIDEO" && (
          <div className="flex-col">
            <Field
              component={TextField}
              componentId="form-video"
              disabled
              name="videoName"
              label="Soubor videa"
              //validate
            />
            <Button
              flat
              label="Vybrat"
              onClick={() => {
                setDialog("ScreenFileChoose", {
                  onChoose: (file) => {
                    change("videoName", file.name);
                    setVideoFile(file);
                  },
                  typeMatch: new RegExp(/^video\/.*$/),
                  accept: "video/*",
                });
              }}
            />
          </div>
        )}

        {/* B4) Infopoint Document Body */}
        {infopointContentType === "DOCUMENT" && (
          <div className="flex-col">
            <Field
              component={TextField}
              componentId="form-document"
              disabled
              name="documentName"
              label="Soubor dokumentu"
              //validate
            />
            <Button
              flat
              label="Vybrat"
              onClick={() => {
                setDialog("ScreenFileChoose", {
                  onChoose: (file) => {
                    change("documentName", file.name);
                    setDocumentFile(file);
                  },
                  typeMatch: new RegExp(/^application\/.*$/),
                  accept: "application/*",
                });
              }}
            />
          </div>
        )}

        {/* C) Always Visible checkbox option */}
        <Field
          component={CheckBox}
          componentId="form-infopointAlwaysVisible"
          name="alwaysVisible"
          customLabel="Stále zobrazen"
          //onChange={(e, value) => console.log("value: ", value)}
        />

        {/* D) Url checkbox option */}
        <Checkbox
          id="checkbox-isURLincluded"
          name="checkboxInfopointIsURLIncluded"
          label="Pridať odkaz"
          checked={infopointIsUrlIncluded}
          onChange={(value) => setInfopointIsUrlIncluded(value)}
          //className
        />

        {/* D) Infopoint URL */}
        {infopointIsUrlIncluded && (
          <div>
            <Field
              component={TextField}
              componentId="form-url"
              name="url"
              label="URL adresa"
              validate={[Validation.required]}
              //onChange={(e, value) => console.log("value: ", value)}
            />
            <Field
              component={SelectField}
              componentId="form-urlType"
              name="urlType"
              label="Typ odkazovaného souboru"
              menuItems={fileTypeOpts}
              validate={[Validation.required]}
              //onChange={(e, value) => console.log("value: ", value)}
            />
          </div>
        )}
      </form>
    </Dialog>
  );
};

// - - - -

const mapStateToProps = (store, props) => {
  const { dialogData } = props;

  return {
    dialog: store.dialog,
    // Add mode has undefined, edit mode has these initialValues
    initialValues:
      dialogData && dialogData.infopoint && dialogData.dialogType === "edit"
        ? {
            header: dialogData.infopoint.header,
            text: dialogData.infopoint.text,
            imageName:
              props.imageFile?.name ?? dialogData.infopoint.imageFile?.name,
            videoName:
              props.videoFile?.name ?? dialogData.infopoint.videoFile?.name,
            documentName:
              props.documentFile?.name ??
              dialogData.infopoint.documentFile?.name,
            alwaysVisible: dialogData.infopoint.alwaysVisible,
            url: dialogData.infopoint.url,
            urlType: dialogData.infopoint.urlType,
            // Needs to also set: infopointContentType, infopointIsUrlIncluded
          }
        : undefined,
  };
};

// const mapDispatchToProps = (dispatch) => ({
//   updateScreenData: (data) => dispatch(updateScreenData(data)),
//   tabFolder: (value) => dispatch(tabFolder(value)),
//   changeFieldValue: (fieldName, fieldValue) =>
//     dispatch(changeFieldValue("screenInfopointForm", fieldName, fieldValue)),
// });

// NOTE: Order of HOCs matter
export default compose(
  withState("infopointContentType", "setInfopointContentType", "TEXT"),
  withState("infopointIsUrlIncluded", "setInfopointIsUrlIncluded", false),
  withState("imageFile", "setImageFile", null),
  withState("videoFile", "setVideoFile", null),
  withState("documentFile", "setDocumentFile", null),
  connect(mapStateToProps, { updateScreenData, tabFolder }),
  withHandlers({
    onSubmit: (dialog) => async (formData, dispatch, props) => {
      // formData: { header, text, imageName, videoName, documentName, alwaysVisible, url, urlType }
      // image, video, document holds the file.name, BUT the file.id should be saved into store
      // store.file is auto tabbed by ScreenFileChoose dialog

      const {
        infopointContentType,
        infopointIsUrlIncluded,
        imageFile,
        videoFile,
        documentFile,
      } = props;

      if (!dialog?.dialogData?.dialogType) {
        return;
      }

      const formDataProcessed = {
        header: formData.header ?? undefined,
        bodyContentType: infopointContentType,
        text: infopointContentType === "TEXT" ? formData.text : undefined,
        imageFile: infopointContentType === "IMAGE" ? imageFile : undefined,
        videoFile: infopointContentType === "VIDEO" ? videoFile : undefined,
        documentFile:
          infopointContentType === "DOCUMENT" ? documentFile : undefined,
        alwaysVisible: formData.alwaysVisible ?? false, // can be undefined
        isUrlIncluded: infopointIsUrlIncluded,
        url: infopointIsUrlIncluded ? formData.url : undefined,
        urlType: infopointIsUrlIncluded ? formData.urlType : undefined,
      };

      const dialogType = dialog.dialogData.dialogType;
      const onDialogSubmit = props.dialogData.onDialogSubmit;
      if (dialogType === "add") {
        // Calling onInfoPointAdd
        await onDialogSubmit(formDataProcessed);
      } else {
        // Calling onInfopointEdit
        await onDialogSubmit(
          dialog.dialogData.infopointIndex,
          formDataProcessed
        );
      }
      dialog.closeDialog(); // closing the dialog will not call onClose and reset function
      props.customResetForm(dispatch, props.reset);
    },
    // props injected by withHandlers, dispatch and reset are supplied when calling this function
    customResetForm: (props) => (dispatch, reset) => {
      dispatch(reset("screenInfopointForm"));
      props.setInfopointContentType("TEXT");
      props.setInfopointIsUrlIncluded(false);
      props.setImageFile(null);
      props.setVideoFile(null);
      props.setDocumentFile(null);
      props.tabFolder(null);
    },
  }),
  reduxForm({
    form: "screenInfopointForm",
    enableReinitialize: true, // true in new infopoint, should be false in edit
  }),
  lifecycle({
    componentDidUpdate(prevProps, _prevState) {
      const prevDialog = prevProps.dialog; // dialog prop from redux store, connect
      const thisDialog = this.props.dialog;

      const {
        setInfopointContentType,
        setInfopointIsUrlIncluded,
        setImageFile,
        setVideoFile,
        setDocumentFile,
      } = this.props;

      // When opening dialog in edit mode
      // initialValues of redux-form fields are handled in mapStateToProps
      // other states (withState) which are not handled by redux-form are set here
      if (
        prevDialog &&
        prevDialog.name == null &&
        thisDialog &&
        thisDialog?.data?.dialogType === "edit"
      ) {
        setInfopointIsUrlIncluded(
          thisDialog?.data?.infopoint?.isUrlIncluded ?? false
        );
        setInfopointContentType(
          thisDialog?.data?.infopoint?.bodyContentType ?? "TEXT"
        );
        setImageFile(thisDialog?.data?.infopoint?.imageFile ?? undefined);
        setVideoFile(thisDialog?.data?.infopoint?.videoFile ?? undefined);
        setDocumentFile(thisDialog?.data?.infopoint?.documentFile ?? undefined);
      }
    },
  })
)(ScreenInfopoint);
