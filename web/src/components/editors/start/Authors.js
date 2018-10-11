import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { get, map, reverse, sortBy, filter } from "lodash";
import { SelectField, TextField, FontIcon, Button } from "react-md";
import ReactTooltip from "react-tooltip";

import HelpIcon from "../../HelpIcon";

import { setDialog } from "../../../actions/dialogActions";
import {
  removeScreenCollaborators,
  updateStartAuthorsFilter
} from "../../../actions/expoActions";

import { helpIconText } from "../../../enums/text";
import { expoEditorStartSort } from "../../../enums/expoEditor";

const Authors = ({
  activeScreen,
  setDialog,
  removeScreenCollaborators,
  updateStartAuthorsFilter,
  sort,
  order,
  search
}) => {
  const collaborators = sortBy(
    filter(
      get(activeScreen, "collaborators", []),
      collaborator =>
        get(collaborator, "role", "").includes(search) ||
        get(collaborator, "text", "").includes(search)
    ),
    collaborator =>
      sort === "TITLE" ? get(collaborator, "role") : get(collaborator, "text")
  );

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="flex-row flex-space-between flex-center">
          <div className="flex-row-normal flex-centered">
            <p className="flex-header-text">Filtr:</p>
            <SelectField
              id="expo-editor-start-selectfield-filter"
              className="flex-header-select"
              menuItems={expoEditorStartSort}
              itemLabel="label"
              itemValue="value"
              value={sort}
              position="below"
              onChange={async value =>
                updateStartAuthorsFilter({ sort: value })}
            />
            <Button
              icon
              onClick={async () => {
                ReactTooltip.hide();
                updateStartAuthorsFilter({
                  order: order === "ASC" ? "DESC" : "ASC"
                });
              }}
              data-tip={order === "ASC" ? "Sestupně" : "Vzestupně"}
              data-for="expo-editor-start-react-tooltip-order"
              className="margin-right-very-small"
            >
              {order === "ASC" ? "arrow_downward" : "arrow_upward"}
            </Button>
            <ReactTooltip
              id="expo-editor-start-react-tooltip-order"
              className="infopoint-tooltip"
              type="dark"
              effect="solid"
              place="bottom"
            />
          </div>
          <div className="search">
            <TextField
              id="expo-editor-start-filter-textfield-search"
              placeholder="Hledat"
              className="search-input"
              onChange={async value =>
                updateStartAuthorsFilter({ search: value })}
            />
            <FontIcon className="search-icon">search</FontIcon>
          </div>
        </div>
        <div className="flex-row-nowrap">
          <div className="table margin-bottom">
            <div className="table-row header">
              <div className="table-col">Nadpis</div>
              <div className="table-col">Osoby nebo text</div>
              <div className="table-col" />
            </div>
            {map(
              order === "ASC" ? collaborators : reverse(collaborators),
              (item, i) =>
                <div className="table-row" key={i}>
                  <div className="table-col">
                    {item.role}
                  </div>
                  <div className="table-col">
                    {item.text}
                  </div>
                  <div className="table-col flex-right">
                    <FontIcon
                      onClick={() => setDialog("ScreenAuthorsChange", item)}
                    >
                      mode_edit
                    </FontIcon>
                    <FontIcon onClick={() => removeScreenCollaborators(item)}>
                      delete
                    </FontIcon>
                  </div>
                </div>
            )}
          </div>
          <HelpIcon {...{ label: helpIconText.EDITOR_START_AUTHORS }} />
        </div>
        <Button icon onClick={() => setDialog("ScreenAuthorsAdd")}>
          add
        </Button>
      </div>
    </div>
  );
};

export default compose(
  connect(
    ({
      expo: { expoEditor: { startAuthorsFilter: { sort, order, search } } }
    }) => ({
      sort,
      order,
      search
    }),
    { setDialog, removeScreenCollaborators, updateStartAuthorsFilter }
  ),
  lifecycle({
    componentDidMount() {
      const { updateStartAuthorsFilter } = this.props;

      updateStartAuthorsFilter({ sort: "TITLE", order: "ASC", search: "" });
    }
  })
)(Authors);
