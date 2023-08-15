import { connect } from "react-redux";
import { compose } from "recompose";
import { withRouter, Route } from "react-router-dom";

import TabMenu from "../../../components/tab-menu";
import Description from "./description";
import Footer from "../../../components/editors/footer";

import { updateScreenData } from "../../../actions/expoActions";

const ScreenFinish = (props) => {
  const { match, activeScreen, history, url } = props;

  return (
    <div>
      <TabMenu
        tabs={[
          {
            label: "Nastavení",
            link: `${match.url}/description`,
          },
        ]}
      />
      <Route
        path={`${match.url}/description`}
        render={() => <Description {...props} />}
      />
      <Footer
        activeExpo={props.activeExpo}
        activeScreen={activeScreen}
        history={history}
        url={url}
        type="finish"
      />
    </div>
  );
};

export default compose(
  connect(({ expo: { activeScreen } }) => ({ activeScreen }), {
    updateScreenData,
  }),
  withRouter
)(ScreenFinish);
