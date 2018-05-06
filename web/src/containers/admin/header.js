import { useTranslation } from "react-i18next";

const Header = () => {
  const { t } = useTranslation("admin-settings");

  return (
    <div className="flex-row flex-centered">
      <h2>{t("title")}</h2>
      <div />
    </div>
  );
};

export default Header;
