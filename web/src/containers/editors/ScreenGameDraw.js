import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { withRouter, Route } from "react-router-dom";

import TabMenu from "../../components/TabMenu";
import Description from "../../components/editors/GameDescription";
import Images from "../../components/editors/gameDraw/Images";
import Footer from "../../components/editors/Footer";

import { updateScreenData } from "../../actions/expoActions";
import { helpIconText } from "../../enums/text";

const ScreenGameDraw = (props) => {
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
            label: "Obrázky",
            link: `${match.url}/images`,
          },
        ]}
      />
      <Route
        path={`${match.url}/description`}
        render={() => (
          <Description
            {...props}
            taskHelpIconLabel={helpIconText.EDITOR_GAME_DRAW_TASK}
          />
        )}
      />
      <Route
        path={`${match.url}/images`}
        render={() => <Images {...props} />}
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
  connect(
    ({ expo: { activeScreen } }) => ({ activeScreen }),
    {
      updateScreenData,
    }
  ),
  withRouter
)(ScreenGameDraw);
