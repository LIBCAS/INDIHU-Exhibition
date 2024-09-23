import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import { useTranslation } from "react-i18next";

import Button from "react-md/lib/Buttons/Button";
import {
  ReactMdTextField,
  ReactMdCheckbox,
} from "components/form/formik/react-md";

import { AppDispatch } from "store/store";
import { UserInfoObj } from "reducers/user-reducer";

import * as Yup from "yup";
import { updateCurrentUser } from "actions/user-actions";
import { setDialog } from "actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";

// - -

type UserInfoChangeProps = {
  userInfo: UserInfoObj;
  isAdmin: boolean;
};

type UserInfoFormData = {
  userName: string;
  firstName: string;
  surname: string;
  institution: string;
  email: string;
  registrationNotifications: boolean;
};

const UserInfoChange = ({ userInfo, isAdmin }: UserInfoChangeProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("profile");

  return (
    <Formik<UserInfoFormData>
      initialValues={{
        userName: userInfo.userName,
        firstName: userInfo.firstName,
        surname: userInfo.surname,
        institution: userInfo.institution,
        email: userInfo.email,
        registrationNotifications: userInfo.registrationNotifications,
      }}
      onSubmit={async (formData) => {
        const isSucc = await dispatch(
          updateCurrentUser({
            ...userInfo,
            userName: formData.userName,
            firstName: formData.firstName,
            surname: formData.surname,
            institution: formData.institution,
            email: formData.email,
            registrationNotifications: formData.registrationNotifications,
          })
        );

        if (isSucc) {
          dispatch(
            setDialog(DialogType.InfoDialog, {
              title: t("editProfileDialog.title") as string,
              text: t("editProfileDialog.textSuccess"),
            })
          );
        } else {
          dispatch(
            setDialog(DialogType.InfoDialog, {
              title: t("editProfileDialog.title") as string,
              text: t("editProfileDialog.textFailure"),
            })
          );
        }
      }}
      validationSchema={Yup.object({
        userName: Yup.string().required("*Povinné"),
        firstName: Yup.string().required("*Povinné"),
        surname: Yup.string().required("*Povinné"),
        institution: Yup.string().required("*Povinné"),
        email: Yup.string().required("*Povinné"),
      })}
    >
      <Form className="max-w-[600px] m-auto flex flex-col justify-center items-center">
        <ReactMdTextField
          name="userName"
          label={t("usernameLabel")}
          id="user-change-form-userName"
        />

        <ReactMdTextField
          name="firstName"
          label={t("firstnameLabel")}
          id="user-change-form-firstName"
        />

        <ReactMdTextField
          name="surname"
          label={t("lastnameLabel")}
          id="user-change-form-surname"
        />

        <ReactMdTextField
          name="institution"
          label={t("institutionLabel")}
          id="user-change-form-institution"
        />

        <ReactMdTextField
          name="email"
          label={t("emailLabel")}
          id="user-change-form-email"
        />

        {isAdmin && (
          <ReactMdCheckbox
            name="registrationNotifications"
            label={t("emailNotificationsLabel")}
            className="self-start"
          />
        )}

        <div className="flex-row flex-centered">
          <Button
            className="flex-form-submit edit-profile-button"
            flat
            primary
            label={t("editProfileActionButtonLabel")}
            type="submit"
          />
        </div>
      </Form>
    </Formik>
  );
};

export default UserInfoChange;
