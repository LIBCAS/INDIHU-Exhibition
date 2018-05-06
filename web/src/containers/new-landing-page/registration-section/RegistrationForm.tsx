import "./registration-form.scss";

import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";

import { useDialogRef } from "context/dialog-ref-provider/dialog-ref-provider";

// Components
import OAuthButton from "../oauth-button/OAuthButton";
import TextField from "./TextField";

// Models
import { OAuthConfigObj } from "../LandingPage";
import { AppDispatch } from "store/store";

// Utils and actions
import cx from "classnames";
import * as Yup from "yup";
import { registration } from "actions/user-actions";
import { setDialog } from "actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";
import { DialogRefType } from "context/dialog-ref-provider/dialog-ref-types";

// - -

type RegisterFormData = {
  firstName: string;
  surname: string;
  institution: string;
  email: string;
  password: string;
  // accepted: boolean;
  // captcha: string;
};

type RegistrationFormProps = {
  isInDialog: boolean;
  oauthConfigs: OAuthConfigObj[] | null;
};

const RegistrationForm = ({
  isInDialog,
  oauthConfigs,
}: RegistrationFormProps) => {
  const { t } = useTranslation("new-landing-screen", {
    keyPrefix: "registrationSection",
  });
  const dispatch = useDispatch<AppDispatch>();

  const { openNewTopDialog } = useDialogRef();

  return (
    <div
      className={cx(
        "registration-form rounded-xl bg-white flex flex-col items-center gap-5",
        {
          "px-[16px] py-[36px]": !isInDialog,
          "md:max-w-[520px] md:ml-auto": !isInDialog,
          "px-3 py-6": isInDialog,
        }
      )}
    >
      {!isInDialog && (
        <h3 className="reg-form__header">{t("registerForm.formTitle")}</h3>
      )}
      <p className="reg-form__p">{t("registerForm.formSubtitle")}</p>
      {/* OAuth buttons */}
      <div className="w-full flex flex-wrap justify-center items-center gap-3">
        {/* <OAuthButton
          provider="Facebook"
          backgroundColor="#405d9d"
          oauthConfig={oauthConfigs?.find(
            (config) => config.providerName === "Facebook"
          )}
        /> */}
        <OAuthButton
          provider="Github"
          backgroundColor="#0366d6"
          oauthConfig={oauthConfigs?.find(
            (config) => config.providerName === "Github"
          )}
        />
        {/* <OAuthButton
          provider="Google"
          backgroundColor="#EA4335"
          oauthConfig={oauthConfigs?.find(
            (config) => config.providerName === "Google"
          )}
        /> */}
      </div>
      <p className="reg-form__p">{t("registerForm.or")}</p>

      {/* FORM */}
      <div className="w-full px-4 mb-2 md:max-w-[520px]">
        <Formik<RegisterFormData>
          initialValues={{
            firstName: "",
            surname: "",
            institution: "",
            email: "",
            password: "",
            // accepted: false,
            // captcha: "",
          }}
          onSubmit={async (formData: RegisterFormData, formik) => {
            // TODO.. registration action also requires accepted checkbox and captcha!
            const respStatus = await dispatch(registration(formData));
            if (respStatus === 201) {
              formik.resetForm();
              //setCaptcha
              dispatch(
                setDialog(DialogType.InfoDialog, {
                  title: "Potvrzení registrace",
                  text: `Potvrďte svou registraci linkem zaslaným na adresu ${formData.email}`,
                })
              );
            } else if (respStatus === 412) {
              formik.resetForm();
              //setCaptcha
              dispatch(
                setDialog(DialogType.InfoDialog, {
                  title: "E-mailová adresa nalezena",
                  text: "Účet s Vaší e-mailovou adresou byl již nalezen. Zkuste se přihlásit svými korporátními přihlašovacími údaji.",
                })
              );
            } else if (respStatus === 409) {
              formik.setFieldError(
                "email",
                "*Účet s danou emailovou adresou již existuje"
              );
            } else {
              formik.setFieldError("password", "*Registrace neúspešná");
            }
          }}
          validationSchema={Yup.object({
            firstName: Yup.string().required("*Povinné"),
            surname: Yup.string().required("*Povinné"),
            institution: Yup.string().required("*Povinné"),
            email: Yup.string()
              .email("*Neplatný formát e-mail adresy")
              .required("*Povinné"),
            password: Yup.string().min(5, "*Min 5 znaků").required("*Povinné"),
            // accepted: Yup.boolean().required("*Povinné"),
            // captcha: Yup.string().required("*Povinné"),
          })}
        >
          <Form className="flex flex-col gap-2">
            <TextField
              name="firstName"
              label={t("registerForm.nameFieldLabel")}
              fullWidth
              id="register-form-firstname-textfield"
            />
            <TextField
              name="surname"
              label={t("registerForm.surnameFieldLabel")}
              fullWidth
              id="register-form-surname-textfield"
            />
            <TextField
              name="institution"
              label={t("registerForm.institutionFieldLabel")}
              fullWidth
              id="register-form-institution-textfield"
            />
            <TextField
              name="email"
              type="email"
              label={t("registerForm.emailFieldLabel")}
              id="register-form-email-textfield"
              fullWidth
            />
            <TextField
              name="password"
              type="password"
              label={t("registerForm.passwordFieldLabel")}
              id="register-form-password-textfield"
              fullWidth
            />

            <div className="mt-4 self-center">
              <button className="create-account-button" type="submit">
                {t("registerForm.createAccountButton")}
              </button>
            </div>
          </Form>
        </Formik>
      </div>

      <div className="flex flex-col justify-center items-center gap-5">
        <p className="reg-form__p">
          {t("registerForm.alreadyHaveAccount")}{" "}
          <span
            className="underline cursor-pointer"
            onClick={() => {
              openNewTopDialog(DialogRefType.LoginDialog);
            }}
          >
            {t("registerForm.login")}
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;
