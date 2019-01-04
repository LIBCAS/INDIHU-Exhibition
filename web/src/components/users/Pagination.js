import React from "react";
import { connect } from "react-redux";
import SelectField from "react-md/lib/SelectFields";
import Button from "react-md/lib/Buttons/Button";
import FontIcon from "react-md/lib/FontIcons";

import { getUsers } from "../../actions/adminActions";

const options = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
  { label: "1000", value: 1000 }
];

const Pagination = ({ users, getUsers }) => {
  const pgFrom = users.page * users.pageSize + 1;
  const tmp = pgFrom + users.pageSize - 1;
  const pgTo = users.count < tmp ? users.count : tmp;

  return (
    <div className="flex-header">
      <div />
      <div className="flex-header-actions">
        <div className="flex-header-row">
          <p> Záznamů na stránku: </p>
          <SelectField
            id="users-selectfield-pagination-number"
            menuItems={options}
            itemLabel="label"
            itemValue="value"
            defaultValue={"" + users.pageSize}
            position="below"
            onChange={value =>
              getUsers(
                0,
                value,
                users.filter,
                users.sort,
                users.search,
                users.table
              )}
          />
        </div>
        <div className="flex-header-row">
          <p>
            {users.count === 0 ? "0" : `${pgFrom}-${pgTo}`} z {users.count}
          </p>
          <Button
            icon
            onClick={() =>
              users.page > 0 &&
              getUsers(
                users.page - 1,
                users.pageSize,
                users.filter,
                users.sort,
                users.search,
                users.table
              )}
            disabled={users.page <= 0}
          >
            <FontIcon>keyboard_arrow_left</FontIcon>
          </Button>
          <Button
            icon
            onClick={() =>
              getUsers(
                users.page + 1,
                users.pageSize,
                users.filter,
                users.sort,
                users.search,
                users.table
              )}
            disabled={(users.page + 1) * users.pageSize >= users.count}
          >
            <FontIcon>keyboard_arrow_right</FontIcon>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default connect(({ user: { users: { all } } }) => ({ users: all }), {
  getUsers
})(Pagination);
