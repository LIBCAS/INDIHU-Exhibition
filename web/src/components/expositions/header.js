import { connect } from "react-redux";
import { Button, FontIcon } from "react-md";
import { Tooltip as ReactTooltip } from "react-tooltip";

import Filter from "./filter";

import {
  changeExpositionsViewType,
  getExpositions,
} from "../../actions/expoActions";
import { showLoader } from "../../actions/app-actions";

const Header = ({
  cardsList,
  changeExpositionsViewType,
  getExpositions,
  setDialog,
  showLoader,
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
            onClick: () => setDialog("ExpoNew"),
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
          //ReactTooltip.hide();
          changeExpositionsViewType(!cardsList);
          showLoader(true);
          await getExpositions();
          showLoader(false);
        }}
        data-tooltip-content={cardsList ? "Seznam" : "Mřížka"}
        data-tooltip-id="expositions-filter-react-tooltip-order"
      >
        {cardsList ? "view_list" : "view_module"}
      </Button>
      <ReactTooltip
        id="expositions-filter-react-tooltip-order"
        className="infopoint-tooltip"
        variant="dark"
        float={false}
        place="bottom"
      />
    </div>
  </div>
);

export default connect(null, {
  showLoader,
  changeExpositionsViewType,
  getExpositions,
})(Header);
