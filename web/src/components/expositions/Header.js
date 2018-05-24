import React from "react";
import { connect } from "react-redux";
import { Button } from "react-md";

import Filter from "./Filter";

import {
  changeExpositionsViewType,
  getExpositions
} from "../../actions/expoActions";

const Header = ({ cardsList, changeExpositionsViewType, getExpositions }) =>
  <div className="flex-header">
    <h2 className="flex-header-title">Výstavy</h2>
    <Filter />
    <Button
      icon
      onClick={() => {
        changeExpositionsViewType(!cardsList);
        getExpositions(true);
        getExpositions(true);
      }}
      title={cardsList ? "Seznam" : "Mřížka"}
    >
      {cardsList ? "view_list" : "view_module"}
    </Button>
  </div>;

export default connect(({ expo: { cardsList } }) => ({ cardsList }), {
  changeExpositionsViewType,
  getExpositions
})(Header);
