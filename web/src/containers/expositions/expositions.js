import { compose, lifecycle, withState, withHandlers } from "recompose";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { map, get, debounce } from "lodash";

import AppHeader from "../../components/app-header";
import Header from "./header";
import ExpoCard from "./expo-card";
import ExpoNewCard from "./expo-new-card";
import Table from "./table";
import Pager from "./pager";

import { getExpositions, setExpoFilter } from "../../actions/expoActions";
import { setDialog } from "../../actions/dialog-actions";
import { showLoader, setExpositionsScrollTop } from "../../actions/app-actions";
import { getCurrentUser } from "../../actions/user-actions";
import Footer from "../footer";

const CONTAINER_ID = "expositions-scroll-container";

const Expositions = ({
  expositions,
  cardsList,
  history,
  setDialog,
  filter,
  setExpoFilter,
  getExpositions,
  handleScroll,
}) => (
  <div className="expositions-container-outter">
    <AppHeader expositionsStyle />
    <div
      id={CONTAINER_ID}
      className="expositions-container"
      onScroll={handleScroll}
    >
      <div className="expositions-container-inner">
        <Header {...{ cardsList, setExpoFilter, setDialog }} />
        {cardsList ? (
          <div className="expo">
            <ExpoNewCard />
            {map(expositions.items, (expo) => (
              <ExpoCard key={expo.id} {...expo} history={history} />
            ))}
          </div>
        ) : (
          <div>
            <Table
              {...{
                expositions: expositions.items,
                history,
                filter,
                getExpositions,
                setExpoFilter,
              }}
            />
            <Pager {...{ count: expositions.count }} />
          </div>
        )}
      </div>
    </div>
    <Footer />
  </div>
);

export default compose(
  withRouter,
  connect(
    ({
      app: { expositionsScrollTop },
      expo: { expositions, cardsList, filter },
    }) => ({
      expositionsScrollTop,
      expositions,
      cardsList,
      filter,
    }),
    {
      getCurrentUser,
      showLoader,
      getExpositions,
      setDialog,
      setExpoFilter,
      setExpositionsScrollTop,
    }
  ),
  withState("intervalId", "setIntervalId", null),
  withHandlers({
    handleScroll: ({ setExpositionsScrollTop }) =>
      debounce(() => {
        const container = document.getElementById(CONTAINER_ID);
        if (container) {
          setExpositionsScrollTop(container.scrollTop);
        }
      }, 200),
  }),
  lifecycle({
    async componentDidMount() {
      const {
        showLoader,
        setIntervalId,
        getCurrentUser,
        getExpositions,
        expositionsScrollTop,
      } = this.props;
      showLoader(true);
      await getCurrentUser(true);
      const expositions = await getExpositions();
      await getExpositions(get(expositions, "count"));
      showLoader(false);

      const intervalId = setInterval(async () => {
        await getCurrentUser(true);
        const expositions = await getExpositions();
        getExpositions(get(expositions, "count"));
      }, 1000 * 60);
      setIntervalId(intervalId);

      if (expositionsScrollTop) {
        const container = document.getElementById(CONTAINER_ID);
        if (container) {
          container.scrollTop = expositionsScrollTop;
        }
      }
    },
    componentWillUnmount() {
      clearInterval(this.props.intervalId);
    },
  })
)(Expositions);
