import { reduxForm } from "redux-form";
import { compose, withHandlers } from "recompose";
import { FontIcon } from "react-md/lib";

import Dialog from "./dialog-wrap";
import { removeScreen } from "../../actions/expoActions";
import { useTranslation, Trans } from "react-i18next";

// dialogData.name --> Screen Name
// dialogData.type --> Screen type
// dialogData.rowNum, dialogData.colNum
const ScreenDelete = ({ handleSubmit, dialogData }) => {
  const { t } = useTranslation("expo", { keyPrefix: "screenDeleteDialog" });

  if (!dialogData) {
    return null;
  }

  return (
    <Dialog
      title={<FontIcon className="color-black">delete</FontIcon>}
      name="ScreenDelete"
      submitLabel={t("submitLabel")}
      handleSubmit={handleSubmit}
    >
      {dialogData.type === "INTRO" && (
        <div className="flex flex-col gap-3">
          <p className='font-["Work_Sans"] !text-[16px]'>
            <Trans
              t={t}
              i18nKey="introChapterScreenDeletion"
              components={{ strong: <strong /> }}
            />
          </p>
          <div className="flex gap-3">
            <FontIcon style={{ fontSize: "48px" }} className="color-red">
              priority_high
            </FontIcon>
            <p className='font-["Work_Sans"] !text-[16px]'>
              {t("introChapterWholeChapterDeletionWarning")}
            </p>
          </div>
          <p className="mt-2 font-light">{t("introChapterDocumentsStay")}</p>
        </div>
      )}

      {dialogData.type !== "INTRO" && (
        <div>
          <p>
            <Trans
              t={t}
              i18nKey="otherScreenDeletion"
              values={{ screenName: dialogData?.name ?? "" }}
            />
          </p>
          <p />
          <div className="flex-row-nowrap flex-center">
            <FontIcon className="color-red">priority_high</FontIcon>
            <p>
              <strong style={{ fontSize: "0.9em" }}>
                {t("otherScreenDocumentsStay")}
              </strong>
            </p>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default compose(
  withHandlers({
    onSubmit: (dialog) => async (formData, dispatch, props) => {
      dispatch(removeScreen(props.dialogData.rowNum, props.dialogData.colNum));
      dialog.closeDialog();
    },
  }),
  reduxForm({
    form: "screenDelete",
  })
)(ScreenDelete);
