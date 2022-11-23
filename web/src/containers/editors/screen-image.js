import { connect } from "react-redux";
import { compose } from "recompose";
import { withRouter, Route } from "react-router-dom";
import { find } from "lodash";

import TabMenu from "../../components/tab-menu";
import Description from "../../components/editors/screen-description";
import Image from "../../components/editors/image/image";
import Documents from "../../components/editors/documents";
import Footer from "../../components/editors/footer";

import { updateScreenData } from "../../actions/expoActions";

const ScreenImage = (props) => {
  const { match, activeScreen, history, url } = props;
  const { position } = match.params;
  return (
    <div>
      <TabMenu
        tabs={[
          {
            label: "Název, text, audio",
            link: `${match.url}/description`,
          },
          {
            label: "Obrázek",
            link: `${match.url}/image`,
          },
          {
            label: "Dokumenty",
            link: `${match.url}/documents`,
          },
        ]}
      />
      <Route
        path={`${match.url}/description`}
        render={() => <Description {...props} />}
      />
      <Route path={`${match.url}/image`} render={() => <Image {...props} />} />
      <Route
        path={`${match.url}/documents`}
        render={() => <Documents {...props} />}
      />
      <Footer
        activeExpo={props.activeExpo}
        activeScreen={activeScreen}
        rowNum={position.match(/^(\d*)/)[0]}
        colNum={position.match(/(\d*)$/)[0]}
        noActions={!!find(activeScreen.infopoints, (item) => item.edit)}
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
)(ScreenImage);
