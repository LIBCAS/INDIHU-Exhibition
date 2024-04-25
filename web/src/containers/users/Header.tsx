import { useTranslation } from "react-i18next";

// Components
import SelectField from "react-md/lib/SelectFields";
import TextField from "react-md/lib/TextFields";
import FontIcon from "react-md/lib/FontIcons";
import MenuButton from "react-md/lib/Menus/MenuButton";
import ListItem from "react-md/lib/Lists/ListItem";
import Checkbox from "@mui/material/Checkbox";

// Models
import { UserTableSetter, UserTableStateObj } from "./Users";
import { useState } from "react";
import { FormControlLabel } from "@mui/material";

// - -

type HeaderProps = {
  tableState: UserTableStateObj;
  setTableState: UserTableSetter;
};

const Header = ({ tableState, setTableState }: HeaderProps) => {
  const { t } = useTranslation("users");
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex-header !pt-0">
      <h2 className="flex-header-title">{t("title")}</h2>

      {/* FILTER */}
      <div className="flex-header-actions">
        <div className="flex-header-row">
          <FormControlLabel
            label={t("viewDeleted")}
            control={
              <Checkbox
                checked={checked}
                disabled={tableState.filter === "DELETED"}
                onChange={() => {
                  const newCheckedValue = !checked;
                  setChecked(newCheckedValue);
                  setTableState("viewDeleted", newCheckedValue);
                }}
              />
            }
          />
          <SelectField
            id="users-selectfield-filter2"
            menuItems={[
              { label: t("allUsersLabel"), value: "ALL" },
              { label: t("usersState.accepted"), value: "ACCEPTED" },
              { label: t("usersState.not_verified"), value: "NOT_VERIFIED" },
              { label: t("usersState.to_accept"), value: "TO_ACCEPT" },
              { label: t("usersState.rejected"), value: "REJECTED" },
              { label: t("usersState.deleted"), value: "DELETED" },
            ]}
            itemLabel="label"
            itemValue="value"
            position="below"
            value={tableState.filter}
            onChange={(newTableFilter: UserTableStateObj["filter"]) => {
              if (newTableFilter === "DELETED") {
                setTableState("viewDeleted", true);
                setChecked(true);
              }
              setTableState("filter", newTableFilter);
            }}
          />

          <MenuButton
            id="users-filter-sort-menu"
            icon
            buttonChildren="sort_by_alpha"
            position="tl"
          >
            <ListItem
              primaryText={t("usersSort.updated")}
              onClick={() => {
                setTableState("sort", "updated");
              }}
            />
            <ListItem
              primaryText={t("usersSort.created")}
              onClick={() => {
                setTableState("sort", "created");
              }}
            />
            <ListItem
              primaryText={t("usersSort.userName")}
              onClick={() => {
                setTableState("sort", "userName");
              }}
            />
            <ListItem
              primaryText={t("usersSort.firstName")}
              onClick={() => {
                setTableState("sort", "firstName");
              }}
            />
            <ListItem
              primaryText={t("usersSort.surname")}
              onClick={() => {
                setTableState("sort", "surname");
              }}
            />
            <ListItem
              primaryText={t("usersSort.email")}
              onClick={() => {
                setTableState("sort", "email");
              }}
            />
            <ListItem
              primaryText={t("usersSort.institution")}
              onClick={() => {
                setTableState("sort", "institution");
              }}
            />
          </MenuButton>
        </div>

        <div className="flex-header-row">
          <div className="search">
            <TextField
              id="user-filter-textfield-search"
              placeholder={t("searchLabel")}
              className="search-input"
              value={tableState.search}
              onChange={(newSearchValue: string) => {
                setTableState("search", newSearchValue);
              }}
            />
            <FontIcon className="search-icon">search</FontIcon>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
