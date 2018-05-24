import React from "react";
import Dialog from "./DialogWrap";
import { connect } from "react-redux";
import { reduxForm, Field, formValueSelector } from "redux-form";
import { compose, withHandlers } from "recompose";
import { forEach, get } from "lodash";

import SelectField from "../form/SelectField";

import { moveScreen, moveChapter } from "../../actions/expoActions";

const selector = formValueSelector("ScreenMove");

const ScreenMove = ({
  handleSubmit,
  activeExpo,
  dialogData,
  rowNum,
  change
}) => {
  const options = [];
  const options2 = [];
  let lastCol = 0;

  if (dialogData && get(activeExpo, "structure.screens")) {
    if (dialogData.colNum) {
      forEach(activeExpo.structure.screens, (chapter, row) => {
        if (chapter[0] && chapter[0].type === "INTRO") {
          options.push({
            label: `${row + 1}${chapter[0].title
              ? ` ${chapter[0].title}`
              : ""}`,
            value: row
          });
        }
      });

      forEach(activeExpo.structure.screens[rowNum], (screen, col) => {
        if (col)
          options2.push({
            label: `${rowNum + 1}.${col}`,
            value: col
          });
        lastCol = col + 1;
      });

      if (rowNum !== dialogData.rowNum)
        options2.push({
          label: `${rowNum + 1}.${lastCol}`,
          value: lastCol
        });
    } else {
      forEach(activeExpo.structure.screens, (chapter, row) =>
        options.push({
          label: row + 1,
          value: row
        })
      );
    }
  }

  return (
    <Dialog
      title={
        dialogData && dialogData.colNum
          ? "Nová pozice obrazovky"
          : "Nová pozice kapitoly"
      }
      name="ScreenMove"
      submitLabel="Přesunout"
      handleSubmit={handleSubmit}
    >
      {dialogData && get(activeExpo, "structure.screens")
        ? dialogData.colNum
          ? <div>
              <Field
                component={SelectField}
                componentId="screen-move-selectfield-chapter"
                label="Kapitola"
                name="rowNum"
                menuItems={options}
                onChange={(e, value) => {
                  change("rowNum", value);
                  change(
                    "colNum",
                    value === dialogData.rowNum
                      ? dialogData.colNum
                      : activeExpo.structure.screens[value].length
                  );
                }}
              />
              <Field
                component={SelectField}
                componentId="screen-move-selectfield-screen"
                label="Obrazovka"
                name="colNum"
                menuItems={options2}
              />
            </div>
          : <Field
              component={SelectField}
              componentId="screen-move-selectfield-position"
              label="Pozice"
              name="rowNum"
              menuItems={options}
            />
        : <div />}
    </Dialog>
  );
};

export default compose(
  connect(
    state => ({
      rowNum: selector(state, "rowNum")
    }),
    null
  ),
  connect(
    ({ expo: { activeExpo }, dialog: { data } }) => ({
      activeExpo,
      initialValues: data
    }),
    { moveScreen, moveChapter }
  ),
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      const { moveScreen, dialogData, moveChapter } = props;
      const { rowNum, colNum } = formData;

      if (dialogData.colNum)
        moveScreen(dialogData.rowNum, dialogData.colNum, rowNum, colNum);
      else moveChapter(dialogData.rowNum, rowNum);
      dialog.closeDialog();
    }
  }),
  reduxForm({
    form: "ScreenMove",
    enableReinitialize: true
  })
)(ScreenMove);
