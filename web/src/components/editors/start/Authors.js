import React from "react";
import { connect } from "react-redux";
import {
  compose
  // lifecycle
} from "recompose";
import {
  get,
  map
  // reverse,
  // sortBy,
  // filter
} from "lodash";
import {
  // SelectField,
  // TextField,
  FontIcon,
  Button
} from "react-md";
// import ReactTooltip from "react-tooltip";

import HelpIcon from "../../HelpIcon";

import { setDialog } from "../../../actions/dialogActions";
import {
  removeScreenCollaborators,
  updateStartAuthorsFilter,
  swapScreenCollaborators
} from "../../../actions/expoActions";

import { helpIconText } from "../../../enums/text";
// import { expoEditorStartSort } from "../../../enums/expoEditor";

const Authors = ({
  activeScreen,
  setDialog,
  removeScreenCollaborators,
  // updateStartAuthorsFilter,
  sort,
  // order,
  search,
  swapScreenCollaborators
}) => {
  const collaborators = get(activeScreen, "collaborators", []);

  // const collaborators = sortBy(
  //   filter(
  //     get(activeScreen, "collaborators", []),
  //     collaborator =>
  //       get(collaborator, "role", "").includes(search) ||
  //       get(collaborator, "text", "").includes(search)
  //   ),
  //   collaborator =>
  //     sort === "TITLE" ? get(collaborator, "role") : get(collaborator, "text")
  // );

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        {/* <div className="start-authors-filter">
          <div className="left-filter">
            <p className="margin-bottom-small margin-top-small margin-left-very-small margin-right-very-small">
              Filtr:
            </p>
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
              className="margin-right-very-small margin-top-very-small margin-bottom-very-small"
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
        </div> */}
        <div className="flex-row-nowrap">
          <div className="table margin-bottom">
            <div className="table-row cursor header">
              {get(collaborators, "length", 0) > 1 && (
                <div className="table-col cursor" />
              )}
              <div className="table-col cursor">Role</div>
              <div className="table-col cursor">Osoby nebo text</div>
              <div className="table-col cursor" />
            </div>
            {map(
              // order === "ASC" ? collaborators : reverse(collaborators),
              collaborators,
              (item, i) => (
                <div className="table-row cursor" key={i}>
                  {get(collaborators, "length", 0) > 1 && (
                    <div className="table-col cursor">
                      <FontIcon
                        onClick={() =>
                          swapScreenCollaborators(
                            collaborators[i - 1],
                            collaborators[i]
                          )
                        }
                        style={{ visibility: i > 0 ? "visible" : "hidden" }}
                        className="cursor-pointer color-black"
                      >
                        keyboard_arrow_up
                      </FontIcon>
                      <FontIcon
                        onClick={() =>
                          swapScreenCollaborators(
                            collaborators[i],
                            collaborators[i + 1]
                          )
                        }
                        style={{
                          visibility:
                            i < collaborators.length - 1 ? "visible" : "hidden"
                        }}
                        className="cursor-pointer color-black"
                      >
                        keyboard_arrow_down
                      </FontIcon>
                    </div>
                  )}
                  <div className="table-col cursor">{item.role}</div>
                  <div className="table-col cursor">{item.text}</div>
                  <div className="table-col cursor flex-right">
                    <FontIcon
                      onClick={() => setDialog("ScreenAuthorsChange", item)}
                      className="cursor-pointer color-black"
                    >
                      mode_edit
                    </FontIcon>
                    <FontIcon
                      onClick={() =>
                        setDialog("ConfirmDialog", {
                          title: (
                            <FontIcon className="color-black">delete</FontIcon>
                          ),
                          text: "Opravdu chcete odstranit zvolenou položku?",
                          onSubmit: () => removeScreenCollaborators(item)
                        })
                      }
                      className="cursor-pointer color-black"
                    >
                      delete
                    </FontIcon>
                  </div>
                </div>
              )
            )}
          </div>
          <HelpIcon {...{ label: helpIconText.EDITOR_START_AUTHORS }} />
        </div>
        <Button
          icon
          onClick={() => setDialog("ScreenAuthorsAdd")}
          className="color-black"
        >
          add
        </Button>
      </div>
    </div>
  );
};

export default compose(
  connect(
    ({
      expo: {
        expoEditor: {
          startAuthorsFilter: { sort, order, search }
        }
      }
    }) => ({
      sort,
      order,
      search
    }),
    {
      setDialog,
      removeScreenCollaborators,
      updateStartAuthorsFilter,
      swapScreenCollaborators
    }
  )
  // lifecycle({
  //   componentDidMount() {
  //     const { updateStartAuthorsFilter } = this.props;

  //     updateStartAuthorsFilter({ sort: "TITLE", order: "ASC", search: "" });
  //   }
  // })
)(Authors);
