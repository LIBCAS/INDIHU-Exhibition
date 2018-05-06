import FontIcon from "react-md/lib/FontIcons";
import SelectField from "react-md/lib/SelectFields";

import { CollaboratorObj, AuthorObj } from "models";

import { changeCollaboratorType } from "actions/expoActions";
import { setDialog } from "actions/dialog-actions";
import { dispatch } from "index";
import { DialogType } from "components/dialogs/dialog-types";

// - -

const collaboratorPrivilegeOptions = [
  { label: "Čtení", value: "READ_ONLY" },
  { label: "Čtení a zápis", value: "EDIT" },
];

// - -

type TableProps = {
  collaborators: CollaboratorObj[];
  author: AuthorObj;
  isCurrentUserAuthor: boolean;
};

const Table = ({ collaborators, author, isCurrentUserAuthor }: TableProps) => {
  return (
    <div className="table">
      {/* One header row */}
      <div className="table-row header">
        <div className="table-col">Jméno</div>
        <div className="table-col">E-mail</div>
        <div className="table-col">Práva</div>
        {isCurrentUserAuthor && <div className="table-col actions">Akce</div>}
      </div>

      {/* First author row + then other collaborators */}
      {author && (
        <div className="table-row">
          <div className="table-col">
            {`${author?.firstName ?? ""} ${author?.surname ?? ""}`}
          </div>
          <div className="table-col">{author?.email ?? ""}</div>
          <div className="table-col">Vlastník</div>
          {isCurrentUserAuthor && (
            <div className="table-col actions">
              <FontIcon
                onClick={() =>
                  dispatch(setDialog(DialogType.ExpoShareChangeOwner, {}))
                }
              >
                edit
              </FontIcon>
            </div>
          )}
        </div>
      )}

      {/* Other collaborators */}
      {collaborators?.map((currCollaborator, currCollaboratorIndex) => (
        <div key={currCollaboratorIndex} className="table-row">
          <div className="table-col">
            {`${currCollaborator?.collaborator?.firstName ?? ""} ${
              currCollaborator?.collaborator?.surname ?? ""
            }`}
          </div>

          <div className="table-col">
            {currCollaborator?.collaborator?.email ||
              currCollaborator?.userEmail ||
              ""}
          </div>

          <div className="table-col select">
            {isCurrentUserAuthor && (
              <SelectField
                id="expo-sharing-selectfield-type"
                className="table-select"
                menuItems={collaboratorPrivilegeOptions}
                itemLabel="label"
                itemValue="value"
                defaultValue={currCollaborator.collaborationType}
                position="below"
                onChange={(newPrivilege: string) =>
                  dispatch(
                    changeCollaboratorType(currCollaborator.id, newPrivilege)
                  )
                }
              />
            )}
            {!isCurrentUserAuthor && (
              <>
                {currCollaborator.collaborationType === "READ_ONLY"
                  ? "Čtení"
                  : "Čtení a zápis"}
              </>
            )}
          </div>

          {isCurrentUserAuthor && (
            <div className="table-col actions">
              <FontIcon
                onClick={() =>
                  dispatch(
                    setDialog(DialogType.ExpoShareRemoveCollaborator, {
                      id: currCollaborator.id,
                      name: currCollaborator.collaborator?.username ?? null,
                    })
                  )
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
};

export default Table;
