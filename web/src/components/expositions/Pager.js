import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { SelectField, Button, FontIcon } from "react-md";

import { setExpoPager, getExpositions } from "../../actions/expoActions";

const pageSizeOptions = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
  { label: "1000", value: 1000 }
];

const Pager = ({ pager, setExpoPager, getExpositions, count }) => {
  const pgFrom = pager.page * pager.pageSize + 1;
  const tmp = pgFrom + pager.pageSize - 1;
  const pgTo = count < tmp ? count : tmp;

  return (
    <div className="flex-header">
      <div />
      <div className="flex-header-actions">
        <div className="flex-header-row">
          <p> Záznamů na stránku: </p>
          <SelectField
            id="expositions-pager-pageSize"
            menuItems={pageSizeOptions}
            itemLabel="label"
            itemValue="value"
            defaultValue={pager.pageSize}
            position="below"
            onChange={value => {
              setExpoPager(0, value);
              getExpositions(true);
            }}
          />
        </div>
        <div className="flex-header-row">
          <p>
            {count === 0 ? "0" : `${pgFrom}-${pgTo}`} z {count}
          </p>
          <Button
            icon
            onClick={() => {
              if (pager.page > 0) {
                setExpoPager(pager.page - 1, pager.pageSize);
                getExpositions(true);
              }
            }}
            disabled={pager.page <= 0}
          >
            <FontIcon>keyboard_arrow_left</FontIcon>
          </Button>
          <Button
            icon
            onClick={() => {
              setExpoPager(pager.page + 1, pager.pageSize);
              getExpositions(true);
            }}
            disabled={(pager.page + 1) * pager.pageSize >= count}
          >
            <FontIcon>keyboard_arrow_right</FontIcon>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default compose(
  connect(
    ({ expo: { pager } }) => ({ pager }),
    {
      setExpoPager,
      getExpositions
    }
  )
)(Pager);
