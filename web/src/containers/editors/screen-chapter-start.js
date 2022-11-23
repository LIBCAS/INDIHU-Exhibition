import { connect } from "react-redux";
import { compose } from "recompose";
import { withRouter, Route } from "react-router-dom";

import TabMenu from "../../components/tab-menu";
import Description from "../../components/editors/chapter-start/description";
import Image from "../../components/editors/chapter-start/image";
import Documents from "../../components/editors/documents";
import Footer from "../../components/editors/footer";

import { updateScreenData } from "../../actions/expoActions";

const ScreenChapterStart = (props) => {
  const { match, activeScreen, history, url } = props;
  const { position } = match.params;
  return (
    <div>
      <TabMenu
        tabs={[
          {
            label: "Název, audio",
            link: `${match.url}/description`,
          },
          {
            label: "Obrázek na pozadí",
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
        history={history}
        url={url}
        noActions={
          isNaN(Number(activeScreen.time)) ||
          Number(activeScreen.time) > 1000000
        }
        noActionTitle="Zadána neplatná hodnota"
        noActionText="U pole s celkovou dobou zobrazení obrazovky byla zadána neplatná hodnota."
      />
    </div>
  );
};

export default compose(
  connect(({ expo: { activeScreen } }) => ({ activeScreen }), {
    updateScreenData,
  }),
  withRouter
)(ScreenChapterStart);
