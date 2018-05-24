import React from "react";
import { connect } from "react-redux";
import { map } from "lodash";
import classNames from "classnames";
import { reduxForm, Field } from "redux-form";
import { compose, withHandlers } from "recompose";
import Button from "react-md/lib/Buttons/Button";
import FontIcon from "react-md/lib/FontIcons";
import SelectField from "react-md/lib/SelectFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";

import TextField from "../form/TextField";

import { setDialog } from "../../actions/dialogActions";
import { getFileById } from "../../actions/fileActions";
import { updateScreenData } from "../../actions/expoActions";

const options = [
  { label: "2x", value: 2 },
  { label: "3x", value: 3 },
  { label: "4x", value: 4 }
];

const InfopointsSequencesTable = ({
  infopoints,
  onSubmit,
  onClear,
  onEdit,
  onDelete,
  onAdd,
  onSelect,
  onCheckbox,
  onRowClick,
  activePoint,
  setDialog,
  getFileById,
  updateScreenData,
  handleSubmit,
  label,
  imgIdx,
  onArrowUp,
  onArrowDown
}) => {
  return (
    <div {...{ label, className: "table-infopoints half-width-min" }}>
      <div className="table margin-bottom-small">
        <div className="table-row header">
          {onArrowUp && onArrowDown && <div className="table-col">Pořadí</div>}
          <div className="table-col">Popis</div>
          {onSelect && <div className="table-col">Přiblížení</div>}
          {onCheckbox && <div className="table-col">Stále zobrazen</div>}
          <div className="table-col" />
        </div>
        {map(infopoints, (item, i) =>
          <div
            key={i}
            className={classNames("table-row", { active: activePoint === i })}
            onClick={() => onRowClick && onRowClick(i)}
          >
            {onArrowUp && onArrowDown && <div className="table-row-order">
              {i + 1}.
              </div>}
            {onArrowUp && onArrowDown && <div className="table-col">
              {i > 0
                ? <FontIcon className="icon" onClick={() => onArrowUp(i)}>
                  keyboard_arrow_up
                    </FontIcon>
                : <div className="icon icon-placeholder" />}
              {i < infopoints.length - 1
                ? <FontIcon className="icon" onClick={() => onArrowDown(i)}>
                  keyboard_arrow_down
                    </FontIcon>
                : <div className="icon icon-placeholder" />}
            </div>}
            {item.edit ? <form onSubmit={handleSubmit} className="table-col">
              <Field
                component={TextField}
                componentId="screen-infopoints-table-textfield-text"
                name="text"
              />
              <Button icon type="submit">
                done
                    </Button>
              <Button icon onClick={() => onClear()}>
                clear
                    </Button>
            </form>
              : <div className="table-col" onClick={() => onEdit(i)}>
                {item.text}
              </div>}
            {onSelect && <div className="table-col select">
              <SelectField
                id="screen-infopoints-table-selectfield-zoom"
                className="select-field"
                menuItems={options}
                itemLabel={"label"}
                itemValue={"value"}
                defaultValue={item.zoom}
                onChange={value => onSelect(i, value)}
              />
            </div>}
            {onCheckbox && <div className="table-col">
              <Checkbox
                id={`chbx-${imgIdx}-${i}`}
                name="simple-checkbox"
                checked={item.alwaysVisible}
                value={item.alwaysVisible}
                onChange={value => onCheckbox(i, value)}
              />
            </div>}
            <div className="table-col flex-right">
              <FontIcon className="icon" onClick={() => onDelete(i)}>
                delete
              </FontIcon>
            </div>
          </div>
        )}
      </div>
      <Button icon onClick={() => onAdd()}>
        add
      </Button>
    </div>
  );
};

export default compose(
  connect(null, { setDialog, getFileById, updateScreenData }),
  withHandlers({
    onSubmit: ({
      initialValues,
      updateScreenData,
      activeScreen,
      onSubmit
    }) => async ({ text }) => {
      onSubmit(text);
    }
  }),
  reduxForm({
    form: "screen-infopoints-table-edit",
    enableReinitialize: true
  })
)(InfopointsSequencesTable);
