import React from "react";
import { connect } from "react-redux";
import SelectField from "react-md/lib/SelectFields";
import FontIcon from "react-md/lib/FontIcons";
import TextField from "react-md/lib/TextFields";
import ListItem from "react-md/lib/Lists/ListItem";
import MenuButton from "react-md/lib/Menus/MenuButton";

import { getUsers } from "../../actions/adminActions";

const options = [
  { label: "Tabulka všech uživatelů", value: "ALL" },
  { label: "Tabulka uživatelů ke schválení", value: "FOR_ACCEPT" }
];

const options2 = [
  { label: "Všichni uživatelé", value: "ALL" },
  { label: "Akceptován", value: "ACCEPTED" },
  { label: "Neověřen", value: "NOT_VERIFIED" },
  { label: "Ke schválení", value: "TO_ACCEPT" },
  { label: "Smazán", value: "DELETED" }
];

const Filter = ({ users, getUsers }) =>
  <div className="flex-header-actions">
    <div className="flex-header-row">
      <SelectField
        id="users-selectfield-filter"
        menuItems={options}
        itemLabel="label"
        itemValue="value"
        defaultValue={users.table}
        position="below"
        onChange={value =>
          getUsers(
            0,
            users.pageSize,
            users.filter,
            users.sort,
            users.search,
            value
          )}
      />
      {users.table === "ALL" &&
        <SelectField
          id="users-selectfield-filter2"
          menuItems={options2}
          itemLabel="label"
          itemValue="value"
          defaultValue={users.filter}
          position="below"
          onChange={value =>
            getUsers(
              users.page,
              users.pageSize,
              value,
              users.sort,
              users.search,
              users.table
            )}
        />}
      {users.table === "ALL" &&
        <MenuButton
          id="users-filter-sort-menu"
          icon
          buttonChildren="sort_by_alpha"
          position="tl"
        >
          <ListItem
            primaryText="Datum poslední aktualizace"
            onClick={() =>
              getUsers(
                users.page,
                users.pageSize,
                users.filter,
                "updated",
                users.search,
                users.table
              )}
          />
          <ListItem
            primaryText="Datum vytvoření"
            onClick={() =>
              getUsers(
                users.page,
                users.pageSize,
                users.filter,
                "created",
                users.search,
                users.table
              )}
          />
          <ListItem
            primaryText="Uživatelské jméno"
            onClick={() =>
              getUsers(
                users.page,
                users.pageSize,
                users.filter,
                "userName",
                users.search,
                users.table
              )}
          />
          <ListItem
            primaryText="Jméno"
            onClick={() =>
              getUsers(
                users.page,
                users.pageSize,
                users.filter,
                "firstName",
                users.search,
                users.table
              )}
          />
          <ListItem
            primaryText="Příjmení"
            onClick={() =>
              getUsers(
                users.page,
                users.pageSize,
                users.filter,
                "surname",
                users.search,
                users.table
              )}
          />
          <ListItem
            primaryText="Email"
            onClick={() =>
              getUsers(
                users.page,
                users.pageSize,
                users.filter,
                "email",
                users.search,
                users.table
              )}
          />
          <ListItem
            primaryText="Instituce"
            onClick={() =>
              getUsers(
                users.page,
                users.pageSize,
                users.filter,
                "institution",
                users.search,
                users.table
              )}
          />
        </MenuButton>}
    </div>
    {users.table === "ALL" &&
      <div className="flex-header-row">
        <div className="search">
          <TextField
            id="user-filter-textfield-search"
            placeholder="Hledat"
            className="search-input"
            onChange={value =>
              getUsers(
                0,
                users.pageSize,
                users.filter,
                users.sort,
                value,
                users.table
              )}
            defaultValue={users.search}
          />
          <FontIcon className="search-icon">search</FontIcon>
        </div>
      </div>}
  </div>;

export default connect(({ user: { users: { all } } }) => ({ users: all }), {
  getUsers
})(Filter);
