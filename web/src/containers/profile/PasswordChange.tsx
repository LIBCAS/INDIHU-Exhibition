import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import { useTranslation } from "react-i18next";

import Button from "react-md/lib/Buttons/Button";
import { ReactMdTextField } from "components/form/formik/react-md";

import { UserInfoObj } from "reducers/user-reducer";
import { AppDispatch } from "store/store";

import * as Yup from "yup";
import { updateCurrentUser } from "actions/user-actions";
import { setDialog } from "actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";

// - -

type PasswordChangeFormData = {
  password: string;
  passwordSecond: string;
};

type PasswordChangeProps = {
  userInfo: UserInfoObj;
};

// - -

const PasswordChange = ({ userInfo }: PasswordChangeProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("profile");

  return (
    <Formik<PasswordChangeFormData>
      initialValues={{
        password: "",
        passwordSecond: "",
      }}
      onSubmit={async (formData) => {
        const isSucc = await dispatch(
          updateCurrentUser({
            ...userInfo,
            password: formData.password,
          })
        );

        if (isSucc) {
          dispatch(
            setDialog(DialogType.InfoDialog, {
              title: t("passwordChangeDialog.title") as string,
              text: t("passwordChangeDialog.textSuccess"),
            })
          );
        } else {
          dispatch(
            setDialog(DialogType.InfoDialog, {
              title: t("passwordChangeDialog.title") as string,
              text: t("passwordChangeDialog.textFailure"),
            })
          );
        }
      }}
      validationSchema={Yup.object({
        password: Yup.string().required("*Povinné"),
        passwordSecond: Yup.string()
          .required("*Povinné")
          .oneOf([Yup.ref("password")], "*Hesla nejsou totožná!"),
      })}
    >
      <Form className="flex flex-col justify-center items-center">
        <ReactMdTextField
          name="password"
          type="password"
          label={t("newPasswordLabel")}
          id="password-change-form-password"
          className="max-w-[600px]"
        />
        <ReactMdTextField
          name="passwordSecond"
          type="password"
          label={t("confirmPasswordLabel")}
          id="password-change-form-passwordSecond"
          className="max-w-[600px]"
        />

        <div className="flex-row flex-centered">
          <Button
            className="flex-form-submit edit-profile-button"
            flat
            primary
            label={t("changePasswordActionButtonLabel")}
            type="submit"
          />
        </div>
      </Form>
    </Formik>
  );
};

export default PasswordChange;
