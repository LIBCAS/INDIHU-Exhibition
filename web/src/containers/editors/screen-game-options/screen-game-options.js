import { connect } from "react-redux";
import { compose } from "recompose";
import { withRouter, Route } from "react-router-dom";

import TabMenu from "../../../components/tab-menu";
import Description from "./description";
import Answers from "./answers";
import Footer from "../../../components/editors/footer";

import { updateScreenData } from "../../../actions/expoActions";

const ScreenGameOptions = (props) => {
  const { match, activeScreen, history, url } = props;
  const { position } = match.params;
  const resultTime = activeScreen.resultTime;
  return (
    <div>
      <TabMenu
        tabs={[
          {
            label: "Název, úkol",
            link: `${match.url}/description`,
          },
          {
            label: "Odpovědi",
            link: `${match.url}/answers`,
          },
        ]}
      />
      <Route
        path={`${match.url}/description`}
        render={() => <Description {...props} />}
      />
      <Route
        path={`${match.url}/answers`}
        render={() => <Answers {...props} />}
      />
      <Footer
        activeExpo={props.activeExpo}
        activeScreen={activeScreen}
        rowNum={position.match(/^(\d*)/)[0]}
        colNum={position.match(/(\d*)$/)[0]}
        noActions={
          resultTime === 0 ||
          (resultTime && (resultTime < 1 || resultTime > 1000000))
        }
        noActionTitle="Špatně zadaná doba zobrazení výsledku"
        noActionText="Před uložením opravte dobu zobrazení výsledku!"
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
)(ScreenGameOptions);
