import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { get } from "lodash";
import SelectField from "react-md/lib/SelectFields";
import TextField from "react-md/lib/TextFields";
import FontIcon from "react-md/lib/FontIcons";
import Button from "react-md/lib/Buttons/Button";
import ReactTooltip from "react-tooltip";

import {
  setExpoFilter,
  setExpoPager,
  getExpositions
} from "../../actions/expoActions";

const options = [
  { label: "Všechny", value: "ALL" },
  { label: "Jen pro čtení", value: "READ_ONLY" },
  { label: "Pro čtení a zápis", value: "READ_WRITE" }
];

const options2 = [
  { label: "Název", value: "title" },
  { label: "Stav", value: "state" },
  { label: "Datum vytvoření", value: "created" },
  { label: "Datum poslední aktualizace", value: "updated" },
  { label: "Pravě upravováno", value: "isEditing" }
];

const Filter = ({
  filter,
  pager,
  setExpoFilter,
  setExpoPager,
  getExpositions
}) => (
  <div className="flex-header-actions">
    <div className="flex-header-row">
      <p className="flex-header-text"> Filtr projektů: </p>
      <SelectField
        id="expositions-selectfield-filter"
        className="flex-header-select"
        menuItems={options}
        itemLabel="label"
        itemValue="value"
        value={filter.filter}
        position="below"
        onChange={async value => {
          setExpoFilter(value, filter.sort, filter.search, filter.order);
          setExpoPager(0, pager.pageSize);
          const expositions = await getExpositions(true);
          getExpositions(true, get(expositions, "count"));
        }}
      />
    </div>
    <div className="flex-header-row">
      <SelectField
        id="expositions-selectfield-filter2"
        className="flex-header-select"
        menuItems={options2}
        itemLabel="label"
        itemValue="value"
        value={filter.sort}
        position="below"
        onChange={async value => {
          setExpoFilter(filter.filter, value, filter.search, filter.order);
          const expositions = await getExpositions(true);
          getExpositions(true, get(expositions, "count"));
        }}
      />
    </div>
    <div className="flex-header-row with-search">
      <div className="button-with-tooltip">
        <Button
          icon
          onClick={async () => {
            ReactTooltip.hide();
            setExpoFilter(
              filter.filter,
              filter.sort,
              filter.search,
              filter.order === "ASC" ? "DESC" : "ASC"
            );
            const expositions = await getExpositions(true);
            getExpositions(true, get(expositions, "count"));
          }}
          data-tip={filter.order === "ASC" ? "Sestupně" : "Vzestupně"}
        >
          {filter.order === "ASC" ? "arrow_downward" : "arrow_upward"}
        </Button>
        <ReactTooltip
          className="infopoint-tooltip"
          type="dark"
          effect="solid"
          place="bottom"
        />
      </div>
      <div className="search">
        <TextField
          id="expositions-filter-textfield-search"
          placeholder="Hledat"
          className="search-input"
          onChange={async value => {
            setExpoFilter(filter.filter, filter.sort, value, filter.order);
            setExpoPager(0, pager.pageSize);
            const expositions = await getExpositions(true);
            getExpositions(true, get(expositions, "count"));
          }}
          defaultValue={filter.search}
        />
        <FontIcon className="search-icon">search</FontIcon>
      </div>
    </div>
  </div>
);

export default compose(
  connect(
    ({ expo: { filter, pager } }) => ({ filter, pager }),
    {
      setExpoFilter,
      setExpoPager,
      getExpositions
    }
  )
)(Filter);
