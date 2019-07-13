import React from "react";
import { compose, lifecycle, withState } from "recompose";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { map, get } from "lodash";

import AppHeader from "../components/AppHeader";
import Header from "../components/expositions/Header";
import ExpoCard from "../components/expositions/ExpoCard";
import ExpoNewCard from "../components/expositions/ExpoNewCard";
import Table from "../components/expositions/Table";
import Pager from "../components/expositions/Pager";

import { getExpositions, setExpoFilter } from "../actions/expoActions";
import { setDialog } from "../actions/dialogActions";

const Expositions = ({
  expositions,
  cardsList,
  history,
  setDialog,
  filter,
  setExpoFilter,
  getExpositions
}) => (
  <div>
    <AppHeader expositionsStyle />
    <div className="container padding-bottom-small">
      <Header {...{ cardsList, setExpoFilter, setDialog }} />
      {cardsList ? (
        <div className="expo">
          <ExpoNewCard />
          {map(expositions.items, expo => (
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
              setExpoFilter
            }}
          />
          <Pager {...{ count: expositions.count }} />
        </div>
      )}
    </div>
  </div>
);

export default compose(
  withRouter,
  connect(
    ({ expo: { expositions, cardsList, filter } }) => ({
      expositions,
      cardsList,
      filter
    }),
    { getExpositions, setDialog, setExpoFilter }
  ),
  withState("intervalId", "setIntervalId", null),
  lifecycle({
    async componentDidMount() {
      const { setIntervalId, getExpositions } = this.props;
      const intervalId = setInterval(async () => {
        const expositions = await getExpositions(true);
        getExpositions(true, get(expositions, "count"));
      }, 1000 * 60);
      setIntervalId(intervalId);
      const expositions = await getExpositions();
      getExpositions(false, get(expositions, "count"));
    },
    componentWillUnmount() {
      clearInterval(this.props.intervalId);
    }
  })
)(Expositions);
