import React from "react";
import { connect } from "react-redux";
import { Button, FontIcon } from "react-md";
import ReactTooltip from "react-tooltip";

import Filter from "./Filter";

import {
  changeExpositionsViewType,
  getExpositions
} from "../../actions/expoActions";

const Header = ({
  cardsList,
  changeExpositionsViewType,
  getExpositions,
  setDialog
}) => (
  <div className="flex-header">
    <h2 className="flex-header-title">Výstavy</h2>
    <Filter />
    <div className="flex-row flex-space-between flex-center">
      {!cardsList ? (
        <Button
          {...{
            raised: true,
            label: "Vytvořit novou výstavu",
            onClick: () => setDialog("ExpoNew")
          }}
        >
          <FontIcon>add</FontIcon>
        </Button>
      ) : (
        <div />
      )}
      <Button
        icon
        onClick={() => {
          ReactTooltip.hide();
          changeExpositionsViewType(!cardsList);
          getExpositions(true);
          getExpositions(true);
        }}
        data-tip={cardsList ? "Seznam" : "Mřížka"}
        data-for="expositions-filter-react-tooltip-order"
      >
        {cardsList ? "view_list" : "view_module"}
      </Button>
      <ReactTooltip
        id="expositions-filter-react-tooltip-order"
        className="infopoint-tooltip"
        type="dark"
        effect="solid"
        place="bottom"
      />
    </div>
  </div>
);

export default connect(
  null,
  {
    changeExpositionsViewType,
    getExpositions
  }
)(Header);
