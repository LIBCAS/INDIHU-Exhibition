import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "recompose";
import { withRouter, Route } from "react-router-dom";

import TabMenu from "components/tab-menu";
import ScreenDescription from "components/editors/screen-description";
import ExternalData from "./external-data";
import Documents from "components/editors/documents";
import Footer from "components/editors/footer";

import { updateScreenData } from "actions/expoActions";

const ScreenExternal = (props) => {
  const { t } = useTranslation("expo-editor");
  const { match, activeScreen, history, url } = props;
  const { position } = match.params;

  return (
    <div>
      <TabMenu
        tabs={[
          {
            label: t("tabs.descTab"),
            link: `${match.url}/description`,
          },
          {
            label: t("tabs.externalTab"),
            link: `${match.url}/externalData`,
          },
          {
            label: t("tabs.documentsTab"),
            link: `${match.url}/documents`,
          },
        ]}
      />
      <Route
        path={`${match.url}/description`}
        render={() => <ScreenDescription {...props} />}
      />
      <Route
        path={`${match.url}/externalData`}
        render={() => <ExternalData {...props} />}
      />
      <Route
        path={`${match.url}/documents`}
        render={() => <Documents activeScreen={activeScreen} />}
      />
      <Footer
        activeExpo={props.activeExpo}
        activeScreen={activeScreen}
        rowNum={position.match(/^(\d*)/)[0]}
        colNum={position.match(/(\d*)$/)[0]}
        history={history}
        url={url}
      />
    </div>
  );
};

export default compose(
  connect(({ expo: { activeScreen } }) => ({ activeScreen }), {
    updateScreenData,
  }),
  withRouter
)(ScreenExternal);
