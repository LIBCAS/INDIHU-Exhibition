import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useTranslation } from "react-i18next";
import { animated, useSpring, useTransition } from "react-spring";

// Components
import { Button } from "components/button/button";
import { Divider } from "components/divider/divider";
import { LabeledItem } from "components/labeled-item/labeled-item";
import { Icon } from "components/icon/icon";

import { setDialog } from "actions/dialog-actions";
import { isWorksheetFile } from "../utils";

import { DialogType } from "components/dialogs/dialog-types";
import { AppDispatch, AppState } from "store/store";
import { StartScreen } from "models";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as StartScreen,
  (viewScreen) => ({ viewScreen })
);
export const ViewStartDetail = ({
  isOpen,
  toggle,
}: {
  isOpen: boolean;
  toggle: () => void;
}) => {
  const { viewScreen } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("exhibition");

  const { rotateX } = useSpring({
    rotateX: isOpen ? "180deg" : "0deg",
  });

  const collaborators = viewScreen.collaborators ?? [];

  const startDocuments = viewScreen.documents;

  const startExpoFiles = startDocuments?.filter(
    (currFile) => !isWorksheetFile(currFile)
  );
  const startWorksheetFiles = startDocuments?.filter((currFile) =>
    isWorksheetFile(currFile)
  );

  const openFilesDialog = useCallback(
    () =>
      dispatch(
        setDialog(DialogType.FilesDialog, {
          files: viewScreen.documents,
        })
      ),
    [dispatch, viewScreen.documents]
  );

  const openWorksheetsDialog = useCallback(
    () =>
      dispatch(
        setDialog(DialogType.WorksheetsDialog, { files: viewScreen.documents })
      ),
    [dispatch, viewScreen.documents]
  );

  const transition = useTransition(isOpen, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center">
        <span className="text-2xl text-bold">{t("authors-and-documents")}</span>
        <Button
          iconAfter={
            <animated.div style={{ rotateX }}>
              <Icon name="expand_less" color="primary" />
            </animated.div>
          }
          onClick={toggle}
        >
          {isOpen ? t("less-info") : t("more-info")}
        </Button>
      </div>
      {transition(
        ({ opacity }, isOpen) =>
          isOpen && (
            <animated.div
              style={{ opacity }}
              className="py-2 flex-1 flex flex-col"
            >
              <Divider />
              <div className="py-6 flex-grow basis-0 overflow-y-auto">
                {!collaborators.length && t("no-authors")}
                {collaborators.map(({ role, text }: any, i: number) => (
                  <LabeledItem key={i} label={role}>
                    {text}
                  </LabeledItem>
                ))}
              </div>
              <Divider />
            </animated.div>
          )
      )}
      <div className="flex justify-end items-center mt-auto gap-2">
        {startWorksheetFiles && startWorksheetFiles.length !== 0 && (
          <Button
            iconBefore={<Icon name="description" color="primary" />}
            onClick={openWorksheetsDialog}
          >
            {t("worksheet")}
          </Button>
        )}
        {startExpoFiles && startExpoFiles.length !== 0 && (
          <Button
            iconBefore={<Icon name="folder" color="primary" />}
            onClick={openFilesDialog}
          >
            {t("files")}
          </Button>
        )}
      </div>
    </div>
  );
};
