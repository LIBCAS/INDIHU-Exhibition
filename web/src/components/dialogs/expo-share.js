import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm, Field } from "redux-form";

import Dialog from "./dialog-wrap";
import TextField from "../form/text-field";
import SelectField from "../form/select-field";
import CheckBox from "../form/check-box";
import * as Validation from "../form/validation";

import { addCollaborators } from "../../actions/expoActions";

const options = [
  { label: "Jen pro čtení", value: "READ_ONLY" },
  { label: "Pro čtení a zápis", value: "EDIT" },
];

const ExpoShare = ({ handleSubmit, change }) => (
  <Dialog
    title="Sdílet s"
    name="ExpoShare"
    handleSubmit={handleSubmit}
    submitLabel="Sdílet"
  >
    <Field
      name="option"
      component={SelectField}
      componentId="expo-share-selectfield-choose-type"
      menuItems={options}
      placeholder="Vyberte typ"
      validate={[Validation.required]}
    />
    <Field
      component={TextField}
      componentId="expo-share-textfield-name"
      label="E-mail uživatele"
      name="name"
      validate={[Validation.required, Validation.email]}
    />
    <Field
      component={CheckBox}
      componentId="expo-share-checkbox-invite"
      name="invite"
      label="Pokud uživatel neexistuje, odeslat e-mailovou pozvánku"
      change={change}
    />
  </Dialog>
);

export default compose(
  connect(({ dialog: { data } }) => ({ data }), null),
  withHandlers({
    onSubmit:
      (dialog) =>
      async (formData, dispatch, { data }) => {
        const response = await dispatch(
          addCollaborators(
            formData.name,
            formData.option,
            !!formData.invite,
            data.id
          )
        );
        if (response === 200) {
          dialog.closeDialog();
          dialog.setDialog("Info", {
            title: "Uživatel přidaný",
            text: `Výstava byla sdílena uživateli ${formData.name}.`,
          });
        } else if (response === 201) {
          dialog.closeDialog();
          dialog.setDialog("Info", {
            title: "Uživatel pozvaný",
            text: `Uživateli ${formData.name} byla zaslána pozvánka na e-mail.`,
          });
        } else if (response === 406) {
          dialog.setDialog("Info", {
            title: "Pozvat uživatele",
            text: `${formData.name} není uživatel Indihu. Prosím vyberte možnost "odeslat e-mailovou pozvánku"`,
          });
        } else if (response === 409) {
          dialog.closeDialog();
          dialog.setDialog("Info", {
            title: "Užívatel již spolupracuje",
            text: `Výstava je již sdílena s užívatelem ${formData.name}.`,
          });
        }
      },
  }),
  reduxForm({
    form: "expoShare",
  })
)(ExpoShare);
