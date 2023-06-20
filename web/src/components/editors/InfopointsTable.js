import { compose } from "recompose";
import { connect } from "react-redux";

import { FontIcon, Checkbox, Button } from "react-md";

import { setDialog } from "actions/dialog-actions";

const InfopointsTable = ({
  infopoints,
  title,
  activeScreen,
  onInfopointAdd,
  onInfopointEdit,
  onInfopointDelete,
  ...otherProps
}) => {
  const { setDialog } = otherProps;

  return (
    <div className="table-infopoints half-width-min">
      <div>{title ?? "Infopointy"}</div>
      <div className="table margin-bottom-small">
        {/* Table header */}
        <div className="table-row header">
          <div className="table-col small">Popis</div>
          <div className="table-col small">Stále zobrazen</div>
        </div>

        {/* One table row for each infopoint */}
        {infopoints.map((infopoint, infopointIndex) => (
          <div key={infopointIndex} className="table-row">
            <div className="table-col">
              <div className="infopoint-edit-description">
                {infopoint.bodyContentType === "IMAGE"
                  ? infopoint.imageFile?.name ?? "Neuveden název obrázku"
                  : infopoint.bodyContentType === "VIDEO"
                  ? infopoint.videoFile?.name ?? "Neuveden název videa"
                  : infopoint.bodyContentType === "DOCUMENT"
                  ? infopoint.documentFile?.name ?? "Neuveden název dokumentu"
                  : infopoint.text ?? "Neuvedeno"}
              </div>
            </div>
            <div className="table-col small">
              <Checkbox
                id={`checkbox-infopoint-${infopointIndex}`}
                name="checkbox-infopoint"
                checked={infopoint.alwaysVisible}
                disabled
              />
            </div>
            <div className="table-col very-small flex-right">
              <FontIcon
                className="icon"
                onClick={() =>
                  setDialog("ScreenInfopoint", {
                    dialogType: "edit",
                    onDialogSubmit: onInfopointEdit,
                    infopoint: infopoint, // required for initialValues
                    infopointIndex: infopointIndex, // required to know which infopoint to edit
                  })
                }
              >
                edit
              </FontIcon>
              <FontIcon
                className="icon"
                onClick={() =>
                  setDialog("ConfirmDialog", {
                    title: <FontIcon className="color-black">delete</FontIcon>,
                    text: "Opravdu chcete odstranit zvolený infopoint?",
                    onSubmit: () => onInfopointDelete(infopointIndex),
                  })
                }
              >
                delete
              </FontIcon>
            </div>
          </div>
        ))}
      </div>

      {/* Add Button - for adding new infopoint */}
      <Button
        icon
        className="color-black"
        onClick={() =>
          setDialog("ScreenInfopoint", {
            dialogType: "add",
            onDialogSubmit: onInfopointAdd,
          })
        }
      >
        add
      </Button>
    </div>
  );
};

export default compose(
  connect(null, {
    setDialog,
  })
)(InfopointsTable);
