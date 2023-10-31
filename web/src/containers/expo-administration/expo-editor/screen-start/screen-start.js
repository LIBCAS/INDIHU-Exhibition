import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "recompose";
import { withRouter, Route } from "react-router-dom";

import TabMenu from "components/tab-menu";
import Description from "./description";
import Authors from "./authors";
import Documents from "components/editors/documents";
import Footer from "components/editors/footer";

import { updateScreenData } from "actions/expoActions";

const Screenstart = (props) => {
  const { t } = useTranslation("expo-editor");
  const { match, activeScreen, history, url } = props;

  return (
    <div>
      <TabMenu
        tabs={[
          {
            label: t("tabs.descTab"),
            link: `${match.url}/description`,
          },
          {
            label: t("tabs.imprintTab"),
            link: `${match.url}/authors`,
          },
          {
            label: t("tabs.startScreenDocumentsTab"),
            link: `${match.url}/documents`,
          },
        ]}
      />
      <Route
        path={`${match.url}/description`}
        render={() => <Description {...props} />}
      />
      <Route
        path={`${match.url}/authors`}
        render={() => <Authors {...props} />}
      />
      <Route
        path={`${match.url}/documents`}
        render={() => <Documents activeScreen={activeScreen} />}
      />
      <Footer
        activeExpo={props.activeExpo}
        activeScreen={activeScreen}
        history={history}
        url={url}
        type="start"
        noActions={
          isNaN(Number(activeScreen.expoTime)) ||
          Number(activeScreen.expoTime) > 1000000 * 60
        }
        noActionTitle="Zadána neplatná hodnota"
        noActionText="U pole s délkou trvání výstavy byla zadána neplatná hodnota."
      />
    </div>
  );
};

export default compose(
  connect(({ expo: { activeScreen } }) => ({ activeScreen }), {
    updateScreenData,
  }),
  withRouter
)(Screenstart);
