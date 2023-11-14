import { connect } from "react-redux";
import { compose } from "recompose";
import Button from "react-md/lib/Buttons/Button";
import FontIcon from "react-md/lib/FontIcons";

import { changeAdminSettings } from "../../actions/admin-actions";
import { useTranslation } from "react-i18next";

const Settings = ({ settings, setActiveForm }) => {
  const { t } = useTranslation("admin-settings");

  return (
    <div className="flex-form">
      <div className="flex-form editable">
        <p>
          <span>{`${t("registrationAllowed")}:`}</span>
          {settings.allowedRegistration ? t("yes") : t("no")}
        </p>
        <p>
          <span>{`${t("automaticRegistration")}:`}</span>
          {settings.automaticRegistration ? t("yes") : t("no")}
        </p>
        <p>
          <span>{`${t("lockExhibition")}:`}</span>
          {settings.lockDuration} {t("seconds")}
        </p>
        <div className="flex-row flex-centered">
          <Button
            className="flex-form-edit"
            flat
            label={t("editActionLabel")}
            onClick={() => setActiveForm("adminSettingsForm")}
          >
            <FontIcon>edit</FontIcon>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default compose(
  connect(null, {
    changeAdminSettings,
  })
)(Settings);
