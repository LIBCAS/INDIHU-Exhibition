import React from "react";
import { connect } from "react-redux";
import { map } from "lodash";
import classNames from "classnames";
import { reduxForm, Field, change } from "redux-form";
import { compose, withHandlers } from "recompose";
import { Button, FontIcon, SelectField, Checkbox } from "react-md";

import TextField from "../form/TextField";
import * as Validation from "../form/Validation";

import { getFileById } from "../../actions/fileActions";
import { updateScreenData } from "../../actions/expoActions";
import { setDialog } from "../../actions/dialogActions";

const options = [
  { label: "2x", value: 2 },
  { label: "3x", value: 3 },
  { label: "4x", value: 4 }
];

const InfopointsSequencesTable = ({
  infopoints,
  onClear,
  onEdit,
  onDelete,
  onAdd,
  onSelect,
  onCheckbox,
  onRowClick,
  activePoint,
  handleSubmit,
  label,
  imgIdx,
  onArrowUp,
  onArrowDown,
  change,
  setDialog
}) => (
  <div {...{ label, className: "table-infopoints half-width-min" }}>
    <div className="table margin-bottom-small">
      <div className="table-row header">
        {onArrowUp && onArrowDown && (
          <div className="table-col small">Pořadí</div>
        )}
        <div className="table-col">Popis</div>
        {onSelect && <div className="table-col small">Přiblížení</div>}
        {onCheckbox && <div className="table-col small">Stále zobrazen</div>}
        <div className="table-col very-small" />
      </div>
      {map(infopoints, (item, i) => (
        <div
          key={i}
          className={classNames("table-row", { active: activePoint === i })}
          onClick={() => {
            if (onRowClick) onRowClick(i);
          }}
        >
          {onArrowUp && onArrowDown && (
            <div className="table-row-order">{i + 1}.</div>
          )}
          {onArrowUp && onArrowDown && (
            <div className="table-col small">
              {i > 0 ? (
                <FontIcon className="icon" onClick={() => onArrowUp(i)}>
                  keyboard_arrow_up
                </FontIcon>
              ) : (
                <div className="icon icon-placeholder" />
              )}
              {i < infopoints.length - 1 ? (
                <FontIcon className="icon" onClick={() => onArrowDown(i)}>
                  keyboard_arrow_down
                </FontIcon>
              ) : (
                <div className="icon icon-placeholder" />
              )}
            </div>
          )}
          {item.edit ? (
            <form onSubmit={handleSubmit} className="table-col">
              <Field
                component={TextField}
                componentId="screen-infopoints-table-textfield-text"
                name="text"
                validate={[Validation.max100]}
              />
              <Button icon type="submit" onClick={e => e.stopPropagation()}>
                done
              </Button>
              <Button
                icon
                onClick={e => {
                  e.stopPropagation();
                  onClear();
                  change("text", "");
                }}
              >
                clear
              </Button>
            </form>
          ) : (
            <div className="table-col" onClick={() => onEdit(i)}>
              {item.text}
            </div>
          )}
          {onSelect && (
            <div className="table-col small select">
              <SelectField
                id="screen-infopoints-table-selectfield-zoom"
                className="select-field"
                menuItems={options}
                itemLabel={"label"}
                itemValue={"value"}
                defaultValue={item.zoom}
                onChange={value => onSelect(i, value)}
              />
            </div>
          )}
          {onCheckbox && (
            <div className="table-col small">
              <Checkbox
                id={`chbx-${imgIdx}-${i}`}
                name="simple-checkbox"
                checked={item.alwaysVisible}
                value={item.alwaysVisible}
                onChange={value => onCheckbox(i, value)}
              />
            </div>
          )}
          <div className="table-col very-small flex-right">
            <FontIcon
              className="icon"
              onClick={() =>
                setDialog("ConfirmDialog", {
                  title: <FontIcon className="color-black">delete</FontIcon>,
                  text: "Opravdu chcete odstranit zvolený infopoint?",
                  onSubmit: () => onDelete(i)
                })
              }
            >
              delete
            </FontIcon>
          </div>
        </div>
      ))}
    </div>
    <Button icon onClick={() => onAdd()} className="color-black">
      add
    </Button>
  </div>
);

export default compose(
  connect(
    null,
    { getFileById, updateScreenData, change, setDialog }
  ),
  withHandlers({
    onSubmit: ({ onSubmit, change }) => async ({ text }) => {
      await onSubmit(text);
      change("screen-infopoints-table-edit", "text", "");
    }
  }),
  reduxForm({
    form: "screen-infopoints-table-edit",
    enableReinitialize: true
  })
)(InfopointsSequencesTable);
