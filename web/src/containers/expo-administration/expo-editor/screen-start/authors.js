import { useTranslation } from "react-i18next";

import { connect } from "react-redux";
import { compose } from "recompose";
import { get, map } from "lodash";

import { FontIcon, Button } from "react-md";
import HelpIcon from "components/help-icon";

import { setDialog } from "actions/dialog-actions";
import {
  removeScreenCollaborators,
  updateStartAuthorsFilter,
  swapScreenCollaborators,
} from "actions/expoActions";

const Authors = ({
  activeScreen,
  setDialog,
  removeScreenCollaborators,
  swapScreenCollaborators,
}) => {
  const { t } = useTranslation("expo-editor");

  const collaborators = get(activeScreen, "collaborators", []);

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="flex-row-nowrap">
          <div className="table-with-help">
            <div className="table margin-bottom">
              <div className="table-row cursor header">
                {get(collaborators, "length", 0) > 1 && (
                  <div className="table-col cursor" />
                )}
                <div className="table-col cursor">{t("imprintTable.role")}</div>
                <div className="table-col cursor">
                  {t("imprintTable.personsText")}
                </div>
                <div className="table-col cursor" />
              </div>
              {map(collaborators, (item, i) => (
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
                            i < collaborators.length - 1 ? "visible" : "hidden",
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
                          onSubmit: () => removeScreenCollaborators(item),
                        })
                      }
                      className="cursor-pointer color-black"
                    >
                      delete
                    </FontIcon>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <HelpIcon label={t("imprintTable.imprintTooltip")} />
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
          startAuthorsFilter: { sort, order, search },
        },
      },
    }) => ({
      sort,
      order,
      search,
    }),
    {
      setDialog,
      removeScreenCollaborators,
      updateStartAuthorsFilter,
      swapScreenCollaborators,
    }
  )
)(Authors);
