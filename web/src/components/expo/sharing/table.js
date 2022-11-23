import { get, find } from "lodash";
import { connect } from "react-redux";
import FontIcon from "react-md/lib/FontIcons";
import SelectField from "react-md/lib/SelectFields";

import { changeCollaboratorType } from "../../../actions/expoActions";
import { setDialog } from "../../../actions/dialog-actions";

const options = [
  { label: "Čtení", value: "READ_ONLY" },
  { label: "Čtení a zápis", value: "EDIT" },
];

const Table = ({
  author,
  collaborators,
  changeCollaboratorType,
  setDialog,
  isAuthor,
}) => (
  <div className="table">
    <div className="table-row header">
      <div className="table-col">Jméno</div>
      <div className="table-col">E-mail</div>
      <div className="table-col">Práva</div>
      {isAuthor && <div className="table-col actions">Akce</div>}
    </div>
    {author && (
      <div className="table-row">
        <div className="table-col">
          {`${get(author, "firstName", "")} ${get(author, "surname", "")}`}
        </div>
        <div className="table-col">{get(author, "email", "")}</div>
        <div className="table-col">Vlastník</div>
        {isAuthor && (
          <div className="table-col actions">
            <FontIcon onClick={() => setDialog("ExpoShareChangeOwner")}>
              edit
            </FontIcon>
          </div>
        )}
      </div>
    )}
    {collaborators &&
      collaborators.map((item, i) => (
        <div className="table-row" key={i}>
          <div className="table-col">
            {`${get(item, "collaborator.firstName", "")} ${get(
              item,
              "collaborator.surname",
              ""
            )}`}
          </div>
          <div className="table-col">
            {get(item, "collaborator.email") || get(item, "userEmail", "")}
          </div>
          <div className="table-col select">
            {isAuthor ? (
              <SelectField
                id="expo-sharing-selectfield-type"
                className="table-select"
                menuItems={options}
                itemLabel="label"
                itemValue="value"
                defaultValue={item.collaborationType}
                position="below"
                onChange={(value) => changeCollaboratorType(item.id, value)}
              />
            ) : (
              get(
                find(
                  options,
                  (option) => option.value === item.collaborationType
                ),
                "label",
                ""
              )
            )}
          </div>
          {isAuthor && (
            <div className="table-col actions">
              <FontIcon
                onClick={() =>
                  setDialog("ExpoShareRemoveCollaborator", {
                    id: item.id,
                    name: get(item, "collaborator.username"),
                  })
                }
              >
                delete
              </FontIcon>
            </div>
          )}
        </div>
      ))}
  </div>
);

export default connect(null, { changeCollaboratorType, setDialog })(Table);
