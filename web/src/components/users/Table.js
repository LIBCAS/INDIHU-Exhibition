import React from "react";
import { connect } from "react-redux";
import FontIcon from "react-md/lib/FontIcons";
import { get } from "lodash";

import { setDialog } from "../../actions/dialogActions";

import { userStatesTexts, userStates } from "../../enums/users";

const Table = ({ list, setDialog, tableType }) => (
  <table className="table-all">
    <tr className="table-all-row header">
      <td className="table-all-col">Uživatelské jméno</td>
      <td className="table-all-col">Jméno</td>
      <td className="table-all-col">Příjmení</td>
      <td className="table-all-col">E-mail</td>
      <td className="table-all-col">Instituce</td>
      <td className="table-all-col">Stav</td>
      <td className="table-all-col actions">Akce</td>
    </tr>
    {list.map((item, i) => (
      <tr className="table-all-row" key={item.id}>
        <td className="table-all-col">
          {tableType === "ALL" ? item.userName : item.toAccept.username}
        </td>
        <td className="table-all-col">
          {tableType === "ALL" ? item.firstName : item.toAccept.firstName}
        </td>
        <td className="table-all-col">
          {tableType === "ALL" ? item.surname : item.toAccept.surname}
        </td>
        <td className="table-all-col">
          {tableType === "ALL" ? item.email : item.toAccept.email}
        </td>
        <td className="table-all-col">
          {tableType === "ALL" ? item.institution : item.toAccept.institution}
        </td>
        <td className="table-all-col">
          {get(userStatesTexts, item.state, "")}
        </td>
        <td className="table-all-col actions">
          {item.id &&
            (tableType === "ALL" ? (
              userStates.DELETED === item.state ? (
                <FontIcon
                  onClick={() =>
                    setDialog("UserReactivate", {
                      id: item.id,
                      name: item.userName
                    })
                  }
                  title="Obnovit uživatele"
                >
                  refresh
                </FontIcon>
              ) : (
                <div>
                  <FontIcon
                    onClick={() =>
                      setDialog("UserDelete", {
                        id: item.id,
                        name: item.userName
                      })
                    }
                    title="Odstranit uživatele"
                    className="color-black"
                  >
                    delete
                  </FontIcon>
                </div>
              )
            ) : (
              <FontIcon
                onClick={() =>
                  setDialog("UserAccept", {
                    user: item
                  })
                }
                title="Schválit uživatele"
              >
                done
              </FontIcon>
            ))}
        </td>
      </tr>
    ))}
  </table>
);

export default connect(
  ({
    user: {
      users: {
        all: { list }
      }
    }
  }) => ({ list }),
  {
    setDialog
  }
)(Table);
