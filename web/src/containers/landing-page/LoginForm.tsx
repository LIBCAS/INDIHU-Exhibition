import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { Formik, Form } from "formik";
import * as Yup from "yup";

// Components
import ButtonMd from "react-md/lib/Buttons/Button";
import { ReactMdTextField } from "components/form/formik/react-md";
import { Button } from "components/button/button";

// Models
import { AppDispatch } from "store/store";
import { OAuthConfigObj } from "./Authentication";

// Actions and utils
import { signIn } from "actions/user-actions";
import { setDialog } from "actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";
import { getOAuthProviderIcon } from "./getOAuthProviderIcon";

// - -

type LoginFormData = {
  name: string;
  password: string;
};

type LoginFormProps = {
  oauthConfigs: OAuthConfigObj[] | null;
};

// - -

const LoginForm = ({ oauthConfigs }: LoginFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("landing-screen");
  const history = useHistory();

  return (
    <Formik<LoginFormData>
      initialValues={{ name: "", password: "" }}
      onSubmit={async (formData, formik) => {
        const isSignSucc = await dispatch(
          signIn(formData.name, formData.password)
        );
        if (isSignSucc) {
          history.push("/exhibitions");
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
        <div>
          <ReactMdTextField
            name="name"
            label={t("formular.userNameLabel")}
            id="login-form-name-textfield"
          />
        </div>
        <div>
          <ReactMdTextField
            name="password"
            type="password"
            label={t("formular.passwordLabel")}
            id="login-form-password-textfield"
          />
        </div>

        <div className="authentication-buttons">
          <ButtonMd
            raised
            primary
            label={t("formular.loginButton")}
            type="submit"
            className="authentication-button"
          />
          <ButtonMd
            flat
            label={t("formular.resetPasswordButton")}
            onClick={() => {
              dispatch(setDialog(DialogType.PasswordReset, {}));
            }}
            className="authentication-button margin-left-small"
          />
        </div>

        {/* OAUTH BUTTONS */}
        <div className="mt-4 flex flex-col justify-center items-center gap-1">
          {oauthConfigs !== null &&
            oauthConfigs.map((authConfig, idx) => {
              const providerName = authConfig.providerName;
              const path = `${authConfig.loginPath}&redirect_uri=${authConfig.redirectUrl}&client_id=${authConfig.clientId}`;

              return (
                <a key={idx} href={path} rel="noopener noreferrer">
                  <Button
                    className="text-xl"
                    iconBefore={
                      <img
                        src={getOAuthProviderIcon(providerName)}
                        className="w-5 h-5"
                      />
                    }
                  >
                    {providerName}
                  </Button>
                </a>
              );
            })}
        </div>
      </Form>
    </Formik>
  );
};

export default LoginForm;
