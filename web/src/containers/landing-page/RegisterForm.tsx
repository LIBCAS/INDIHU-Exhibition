import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { Formik, Form } from "formik";
import * as Yup from "yup";

// Components
import Button from "react-md/lib/Buttons/Button";
import {
  ReactMdTextField,
  ReactMdCheckbox,
} from "components/form/formik/react-md";
import ReCAPTCHA from "react-google-recaptcha";

// Models
import { AppDispatch } from "store/store";

// Actions and utils
import { registration } from "actions/user-actions";
import { setDialog } from "actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";

// - -

type RegisterFormData = {
  firstName: string;
  surname: string;
  institution: string;
  email: string;
  password: string;
  accepted: boolean;
  captcha: string;
};

type RegisterFormProps = {
  handleInfo: () => void;
};

// - -

const RegisterForm = ({ handleInfo }: RegisterFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("landing-screen");

  // TODO
  // const [isCaptchaKey, setIsCaptchaKey] = useState<boolean>(false);

  return (
    <Formik<RegisterFormData>
      initialValues={{
        firstName: "",
        surname: "",
        institution: "",
        email: "",
        password: "",
        accepted: false,
        captcha: "",
      }}
      onSubmit={async (formData, formik) => {
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
          formik.setFieldError("captcha", "*Registrace neúspešná");
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
        accepted: Yup.boolean().required("*Povinné"),
        captcha: Yup.string().required("*Povinné"),
      })}
    >
      {(formik) => (
        <Form>
          <div>
            <ReactMdTextField
              name="firstName"
              label={t("formular.firstNameLabel")}
              id="register-form-firstname-textfield"
            />
          </div>

          <div>
            <ReactMdTextField
              name="surname"
              label={t("formular.surnameLabel")}
              id="register-form-surname-textfield"
            />
          </div>

          <div>
            <ReactMdTextField
              name="institution"
              label={t("formular.institutionLabel")}
              id="register-form-institution-textfield"
            />
          </div>

          <div>
            <ReactMdTextField
              name="email"
              type="email"
              label={t("formular.emailLabel")}
              id="register-form-email-textfield"
            />
          </div>

          <div>
            <ReactMdTextField
              name="password"
              type="password"
              label={t("formular.newPasswordLabel")}
              id="register-form-password-textfield"
            />
          </div>

          <div className="flex-row flex-center">
            <ReactMdCheckbox
              name="accepted"
              label=""
              id="register-form-accepted-checkbox"
            />
            <div>
              {t("formular.acceptTermsOfUsePart1")}{" "}
              <span className="cursor-pointer underline" onClick={handleInfo}>
                {t("formular.acceptTermsOfUsePart2")}
              </span>
            </div>
          </div>

          {/* Captcha */}
          <div className="flex-row flex-centered margin-top-very-small margin-bottom-small">
            <div>
              <ReCAPTCHA
                className="g-recaptcha"
                sitekey="6Lf-G7cUAAAAANWwqBEgZD3VEX6MsR8yrWXihaGr"
                onChange={(newValue: string) => {
                  formik.setFieldValue("captcha", newValue);
                }}
              />
              {formik.touched.captcha && formik.errors.captcha && (
                <span className="invalid">{formik.errors.captcha}</span>
              )}
            </div>
          </div>

          {/* Submit button */}
          <div className="authentication-buttons">
            <Button
              raised
              primary
              label={t("formular.registerButton")}
              type="submit"
              className="authentication-button"
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
