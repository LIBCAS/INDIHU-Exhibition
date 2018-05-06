import "./registration-form.scss";

import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";

// Components
import OAuthButton from "../oauth-button/OAuthButton";
import TextField from "./TextField";

// Models
import { AppDispatch } from "store/store";
import { OAuthConfigObj } from "../LandingPage";

// Utils and actions
import * as Yup from "yup";
import { signIn } from "actions/user-actions";

import { setDialog } from "actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";

// - -

type LoginFormData = {
  name: string;
  password: string;
};

type LoginFormProps = {
  oauthConfigs: OAuthConfigObj[] | null;
  closeLoginDialog: () => void;
};

const LoginForm = ({ oauthConfigs, closeLoginDialog }: LoginFormProps) => {
  const { t } = useTranslation("new-landing-screen", {
    keyPrefix: "registrationSection",
  });
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();

  return (
    <div id="login-form" className="registration-form">
      <div className="px-3 pt-6 pb-4 flex flex-col items-center gap-5">
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
          <Formik<LoginFormData>
            initialValues={{ name: "", password: "" }}
            onSubmit={async (formData, formik) => {
              const isSignSucc = await dispatch(
                signIn(formData.name, formData.password)
              );

              if (isSignSucc) {
                history.push("/exhibitions");
                closeLoginDialog();
              } else {
                formik.setFieldError("password", "*Chybné přihlašovací údaje");
              }
            }}
            validationSchema={Yup.object({
              name: Yup.string().required("*Povinné"),
              password: Yup.string().required("*Povinné"),
            })}
          >
            <Form className="flex flex-col gap-2">
              <TextField
                name="name"
                label={t("loginForm.usernameFieldLabel")}
                id="login-form-name-textfield"
              />

              <TextField
                name="password"
                type="password"
                label={t("loginForm.passwordFieldLabel")}
                id="login-form-password-textfield"
              />

              <div className="mt-4 self-center">
                <button className="login-button" type="submit">
                  {t("loginForm.login")}
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>

      {/* Footer */}
      <div className="dialog__footer">
        <div className="p-[12px] flex justify-center items-center gap-2">
          <span>{t("loginForm.forgetPassword")}</span>
          <span
            className="cursor-pointer underline"
            onClick={() => dispatch(setDialog(DialogType.PasswordReset, {}))}
          >
            {t("loginForm.remindPassword")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
