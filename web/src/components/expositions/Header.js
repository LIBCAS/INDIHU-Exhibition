import React from "react";
import { connect } from "react-redux";
import { Button, FontIcon } from "react-md";
import ReactTooltip from "react-tooltip";

import Filter from "./Filter";

import {
  changeExpositionsViewType,
  getExpositions
} from "../../actions/expoActions";
import { showLoader } from "../../actions/appActions";

const Header = ({
  cardsList,
  changeExpositionsViewType,
  getExpositions,
  setDialog,
  showLoader
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
        onClick={async () => {
          ReactTooltip.hide();
          changeExpositionsViewType(!cardsList);
          showLoader(true);
          await getExpositions();
          showLoader(false);
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
    showLoader,
    changeExpositionsViewType,
    getExpositions
  }
)(Header);
