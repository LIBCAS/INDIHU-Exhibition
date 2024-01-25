import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm, Field } from "redux-form";

import Dialog from "./dialog-wrap";

import TextField from "../form/redux-form/text-field";
import SelectField from "../form/redux-form/select-field";
import CheckBox from "../form/redux-form/check-box";
import * as Validation from "../form/redux-form/validation";

import { addCollaborators } from "../../actions/expoActions";
import { useTranslation, withTranslation, Trans } from "react-i18next";

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
  withTranslation("expo", { keyPrefix: "expoShareDialog" }),
  withHandlers({
    onSubmit:
      (dialog) =>
      async (formData, dispatch, { data, t }) => {
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
            title: t("responseUserAdded.title"),
            content: (
              <Trans
                t={t}
                i18nKey={"responseUserAdded.text"}
                values={{ userName: formData.name }}
              />
            ),
          });
        } else if (response === 201) {
          dialog.closeDialog();
          dialog.setDialog("Info", {
            title: t("responseIndihuUserInvitedByEmail.title"),
            content: (
              <Trans
                t={t}
                i18nKey={"responseIndihuUserInvitedByEmail.text"}
                values={{ userName: formData.name }}
              />
            ),
          });
        } else if (response === 406) {
          dialog.setDialog("Info", {
            title: t("responseNotIndihuUser.title"),
            content: (
              <Trans
                t={t}
                i18nKey={"responseNotIndihuUser.text"}
                values={{ userName: formData.name }}
              />
            ),
          });
        } else if (response === 409) {
          dialog.closeDialog();
          dialog.setDialog("Info", {
            title: t("responseUserIsAlreadyShared.title"),
            content: (
              <Trans
                t={t}
                i18nKey={"responseUserIsAlreadyShared.text"}
                values={{ userName: formData.name }}
              />
            ),
          });
        }
      },
  }),
  reduxForm({
    form: "expoShare",
  })
)(ExpoShare);
