import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm, Field } from "redux-form";

import Dialog from "./dialog-wrap";

import TextField from "../form/redux-form/text-field";
import SelectField from "../form/redux-form/select-field";
import CheckBox from "../form/redux-form/check-box";
import * as Validation from "../form/redux-form/validation";

import { addCollaborators } from "../../actions/expoActions";
import { useTranslation, withTranslation } from "react-i18next";

const ExpoShare = ({ handleSubmit, change }) => {
  const { t } = useTranslation("expo", { keyPrefix: "expoShareDialog" });

  return (
    <Dialog
      title={t("title")}
      name="ExpoShare"
      handleSubmit={handleSubmit}
      submitLabel={t("submitLabel")}
    >
      <Field
        name="option"
        component={SelectField}
        componentId="expo-share-selectfield-choose-type"
        menuItems={[
          { label: t("readOnlyOption"), value: "READ_ONLY" },
          { label: t("editOption"), value: "EDIT" },
        ]}
        placeholder={t("selectTypeFieldLabel")}
        validate={[Validation.required]}
      />
      <Field
        component={TextField}
        componentId="expo-share-textfield-name"
        label={t("userEmailField")}
        name="name"
        validate={[Validation.required, Validation.email]}
      />
      <Field
        component={CheckBox}
        componentId="expo-share-checkbox-invite"
        name="invite"
        customLabel={t("ifUserDoesNotExistSendEmailInvite")}
        change={change}
      />
    </Dialog>
  );
};

export default compose(
  connect(({ dialog: { data } }) => ({ data }), null),
  withTranslation("expo"),
  withHandlers({
    onSubmit:
      (dialog) =>
      async (formData, dispatch, { data }) => {
        // formData is object as { option, name, invite } clicked by user from the form
        // data (dialogData) is object send within setDialog as { activeExpo.id, activeExpo.author }

        const response = await dispatch(
          addCollaborators(
            formData.name,
            formData.option,
            !!formData.invite,
            data.expoId
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
