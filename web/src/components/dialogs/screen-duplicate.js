import Dialog from "./dialog-wrap";
import { connect } from "react-redux";
import { reduxForm, Field, formValueSelector } from "redux-form";
import { compose, withHandlers } from "recompose";
import { forEach, get } from "lodash";

import SelectField from "../form/redux-form/select-field";

import { duplicateScreen, duplicateChapter } from "../../actions/expoActions";
import { useTranslation } from "react-i18next";

const selector = formValueSelector("ScreenDuplicate");

const ScreenDuplicate = ({
  handleSubmit,
  activeExpo,
  dialogData,
  rowNum,
  change,
}) => {
  const { t } = useTranslation("expo", { keyPrefix: "screenDuplicateDialog" });

  const options = [];
  const options2 = [];
  let lastCol = 0;

  if (dialogData && get(activeExpo, "structure.screens")) {
    if (dialogData.colNum) {
      forEach(activeExpo.structure.screens, (chapter, row) => {
        if (chapter[0] && chapter[0].type === "INTRO") {
          options.push({
            label: `${row + 1}${
              chapter[0].title ? ` ${chapter[0].title}` : ""
            }`,
            value: row,
          });
        }
      });

      forEach(activeExpo.structure.screens[rowNum], (_, col) => {
        if (col)
          options2.push({
            label: `${rowNum + 1}.${col}`,
            value: col,
          });
        lastCol = col + 1;
      });

      options2.push({
        label: `${rowNum + 1}.${lastCol}`,
        value: lastCol,
      });
    } else {
      forEach(activeExpo.structure.screens, (_, row) =>
        options.push({
          label: row + 1,
          value: row,
        })
      );

      options.push({
        label: activeExpo.structure.screens.length + 1,
        value: activeExpo.structure.screens.length,
      });
    }
  }

  return (
    <Dialog
      title={
        dialogData && dialogData.colNum ? t("titleScreen") : t("titleChapter")
      }
      name="ScreenDuplicate"
      submitLabel={t("submitLabel")}
      handleSubmit={handleSubmit}
      big={true}
    >
      {dialogData && get(activeExpo, "structure.screens") ? (
        dialogData.colNum ? (
          <div>
            <Field
              component={SelectField}
              componentId="screen-duplicate-selectfield-chapter"
              label={t("chapterLabel")}
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
              componentId="screen-duplicate-selectfield-screen"
              label={t("screenLabel")}
              name="colNum"
              menuItems={options2}
            />
          </div>
        ) : (
          <Field
            component={SelectField}
            componentId="screen-duplicate-selectfield-position"
            label={t("positionLabel")}
            name="rowNum"
            menuItems={options}
          />
        )
      ) : (
        <div />
      )}
    </Dialog>
  );
};

export default compose(
  connect(
    (state) => ({
      rowNum: selector(state, "rowNum"),
    }),
    null
  ),
  connect(
    ({ expo: { activeExpo }, dialog: { data } }) => ({
      activeExpo,
      initialValues: data,
    }),
    { duplicateScreen, duplicateChapter }
  ),
  withHandlers({
    onSubmit:
      (dialog) =>
      async (
        { rowNum, colNum },
        _,
        { duplicateScreen, duplicateChapter, dialogData }
      ) => {
        if (dialogData.colNum)
          duplicateScreen(dialogData.rowNum, dialogData.colNum, rowNum, colNum);
        else duplicateChapter(dialogData.rowNum, rowNum);
        dialog.closeDialog();
      },
  }),
  reduxForm({
    form: "ScreenDuplicate",
    enableReinitialize: true,
  })
)(ScreenDuplicate);
