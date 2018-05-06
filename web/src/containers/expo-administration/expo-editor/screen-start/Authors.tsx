import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import { FontIcon, Button } from "react-md";
import HelpIcon from "components/help-icon";

// Models
import { StartScreen } from "models";
import { AppDispatch } from "store/store";

// Actions and utils
import { setDialog } from "actions/dialog-actions";
import {
  removeScreenCollaborators,
  swapScreenCollaborators,
} from "actions/expoActions";
import { DialogType } from "components/dialogs/dialog-types";

// - -

type AuthorsProps = { activeScreen: StartScreen };

const Authors = ({ activeScreen }: AuthorsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor");

  const collaborators = activeScreen.collaborators ?? [];

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="flex-row-nowrap">
          <div className="table-with-help">
            <div className="table margin-bottom">
              <div className="table-row cursor header">
                {collaborators.length > 1 && (
                  <div className="table-col cursor" />
                )}
                <div className="table-col cursor">{t("imprintTable.role")}</div>
                <div className="table-col cursor">
                  {t("imprintTable.personsText")}
                </div>
                <div className="table-col cursor" />
              </div>

              {collaborators.map((collab, collabIndex) => (
                <div className="table-row cursor" key={collabIndex}>
                  {collaborators.length > 1 && (
                    <div className="table-col cursor">
                      <FontIcon
                        onClick={() =>
                          dispatch(
                            swapScreenCollaborators(
                              collaborators[collabIndex - 1],
                              collaborators[collabIndex]
                            )
                          )
                        }
                        style={{
                          visibility: collabIndex > 0 ? "visible" : "hidden",
                        }}
                        className="cursor-pointer color-black"
                      >
                        keyboard_arrow_up
                      </FontIcon>
                      <FontIcon
                        onClick={() =>
                          dispatch(
                            swapScreenCollaborators(
                              collaborators[collabIndex],
                              collaborators[collabIndex + 1]
                            )
                          )
                        }
                        style={{
                          visibility:
                            collabIndex < collaborators.length - 1
                              ? "visible"
                              : "hidden",
                        }}
                        className="cursor-pointer color-black"
                      >
                        keyboard_arrow_down
                      </FontIcon>
                    </div>
                  )}

                  <div className="table-col cursor">{collab.role}</div>
                  <div className="table-col cursor">{collab.text}</div>
                  <div className="table-col cursor flex-right">
                    <FontIcon
                      className="cursor-pointer color-black"
                      onClick={() => {
                        dispatch(
                          setDialog(DialogType.ScreenAuthorsChange, {
                            role: collab.role,
                            text: collab.text,
                          })
                        );
                      }}
                    >
                      mode_edit
                    </FontIcon>
                    <FontIcon
                      className="cursor-pointer color-black"
                      onClick={() =>
                        dispatch(
                          setDialog(DialogType.ConfirmDialog, {
                            title: (
                              <FontIcon className="color-black">
                                delete
                              </FontIcon>
                            ),
                            text: "Opravdu chcete odstranit zvolenou položku?",
                            onSubmit: () =>
                              dispatch(removeScreenCollaborators(collab)),
                          })
                        )
                      }
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
          className="color-black"
          onClick={() => dispatch(setDialog(DialogType.ScreenAuthorsAdd, {}))}
        >
          add
        </Button>
      </div>
    </div>
  );
};

export default Authors;
