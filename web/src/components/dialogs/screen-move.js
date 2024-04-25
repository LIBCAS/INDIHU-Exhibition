import Dialog from "./dialog-wrap";
import { connect } from "react-redux";
import { reduxForm, Field, formValueSelector } from "redux-form";
import { compose, withHandlers } from "recompose";
import { forEach, get, find, findIndex } from "lodash";

import SelectField from "../form/redux-form/select-field";
import CheckBox from "../form/redux-form/check-box";

import {
  moveScreen,
  moveChapter,
  moveAloneScreenToChapter,
  moveScreenFromChapter,
} from "../../actions/expoActions";
import { useTranslation } from "react-i18next";

const selector = formValueSelector("ScreenMove");

const ScreenMove = ({
  handleSubmit,
  activeExpo,
  dialogData,
  rowNum,
  change,
  aloneScreen,
}) => {
  const { t } = useTranslation("expo", { keyPrefix: "screenMoveDialog" });

  const options = [];
  const options2 = [];
  let lastCol = 0;

  if (dialogData && get(activeExpo, "structure.screens")) {
    if (dialogData.type !== "INTRO" && !aloneScreen) {
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

      if (rowNum !== dialogData.rowNum)
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

      if (
        dialogData.type !== "INTRO" &&
        !get(dialogData, "aloneScreen") &&
        aloneScreen
      ) {
        options.push({
          label: activeExpo.structure.screens.length + 1,
          value: activeExpo.structure.screens.length,
        });
      }
    }
  }

  return (
    <Dialog
      title={
        get(dialogData, "type") !== "INTRO"
          ? t("titleScreen")
          : t("titleChapter")
      }
      name="ScreenMove"
      submitLabel={t("submitLabel")}
      handleSubmit={handleSubmit}
      big={true}
    >
      {get(dialogData, "type") !== "INTRO" &&
        find(
          get(activeExpo, "structure.screens"),
          (screen) => get(screen, "[0].type") === "INTRO"
        ) && (
          <Field
            component={CheckBox}
            componentId="screen-move-checkbox-aloneScreen"
            label={t("separateScreenFieldLabel")}
            name="aloneScreen"
            change={change}
            onClick={(value) => {
              if (value === !!get(dialogData, "aloneScreen")) {
                change("rowNum", get(dialogData, "rowNum"));
                if (!value) {
                  change("colNum", get(dialogData, "colNum"));
                }
              } else {
                if (value) {
                  change(
                    "rowNum",
                    get(activeExpo, "structure.screens.length", 1)
                  );
                } else {
                  change(
                    "rowNum",
                    findIndex(
                      get(activeExpo, "structure.screens"),
                      (screen) => get(screen, "[0].type") === "INTRO"
                    )
                  );
                  change(
                    "colNum",
                    get(
                      activeExpo,
                      `structure.screens[${findIndex(
                        get(activeExpo, "structure.screens"),
                        (screen) => get(screen, "[0].type") === "INTRO"
                      )}].length`,
                      0
                    )
                  );
                }
              }
            }}
          />
        )}
      {dialogData && get(activeExpo, "structure.screens") ? (
        dialogData.type !== "INTRO" && !aloneScreen ? (
          <div>
            <Field
              component={SelectField}
              componentId="screen-move-selectfield-chapter"
              label={t("chapterFieldLabel")}
              name="rowNum"
              menuItems={options}
              onChange={(_, value) => {
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
              label={t("screenFieldLabel")}
              name="colNum"
              menuItems={options2}
            />
          </div>
        ) : (
          <Field
            component={SelectField}
            componentId="screen-move-selectfield-position"
            label={t("positionFieldLabel")}
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
      aloneScreen: selector(state, "aloneScreen"),
    }),
    null
  ),
  connect(
    ({ expo: { activeExpo }, dialog: { data } }) => ({
      activeExpo,
      initialValues: data,
    }),
    { moveScreen, moveChapter, moveAloneScreenToChapter, moveScreenFromChapter }
  ),
  withHandlers({
    onSubmit:
      (dialog) =>
      async (
        { rowNum, colNum, aloneScreen },
        _,
        {
          moveScreen,
          dialogData,
          moveChapter,
          moveAloneScreenToChapter,
          moveScreenFromChapter,
        }
      ) => {
        if (
          dialogData.type !== "INTRO" &&
          !get(dialogData, "aloneScreen") &&
          !aloneScreen
        ) {
          moveScreen(dialogData.rowNum, dialogData.colNum, rowNum, colNum);
        } else if (
          (dialogData.type !== "INTRO" &&
            get(dialogData, "aloneScreen") &&
            aloneScreen) ||
          dialogData.type === "INTRO"
        ) {
          moveChapter(dialogData.rowNum, rowNum);
        } else if (
          dialogData.type !== "INTRO" &&
          get(dialogData, "aloneScreen")
        ) {
          moveAloneScreenToChapter(dialogData.rowNum, rowNum, colNum);
        } else if (dialogData.type !== "INTRO" && aloneScreen) {
          moveScreenFromChapter(dialogData.rowNum, dialogData.colNum, rowNum);
        }

        dialog.closeDialog();
      },
  }),
  reduxForm({
    form: "ScreenMove",
    enableReinitialize: true,
  })
)(ScreenMove);
