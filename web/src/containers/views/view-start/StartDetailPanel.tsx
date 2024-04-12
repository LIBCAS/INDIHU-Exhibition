import { Dispatch, SetStateAction } from "react";
import { useSpring, animated, useTransition } from "react-spring";
import { useTranslation } from "react-i18next";

import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import { Divider } from "components/divider/divider";
import { LabeledItem } from "components/labeled-item/labeled-item";
import Paper from "react-md/lib/Papers/Paper";

import { StartScreen } from "models";

import { isWorksheetFile } from "utils/view-utils";
import cx from "classnames";

// - -

type StartDetailPanelProps = {
  viewScreen: StartScreen;
  isDetailPanelOpen: boolean;
  setIsDetailPanelOpen: Dispatch<SetStateAction<boolean>>;
  openFilesDialog: () => void;
  openWorksheetsDialog: () => void;
};

const StartDetailPanel = ({
  viewScreen,
  isDetailPanelOpen,
  setIsDetailPanelOpen,
  openFilesDialog,
  openWorksheetsDialog,
}: StartDetailPanelProps) => {
  const { t } = useTranslation("view-exhibition");
  const { bgTheming, fgTheming } = useExpoDesignData();

  const collaborators = viewScreen.collaborators ?? [];

  const startDocuments = viewScreen.documents;

  const startExpoFiles = startDocuments?.filter(
    (currFile) => !isWorksheetFile(currFile)
  );
  const startWorksheetFiles = startDocuments?.filter((currFile) =>
    isWorksheetFile(currFile)
  );

  // Animations
  const { rotateX } = useSpring({
    rotateX: isDetailPanelOpen ? "180deg" : "0deg",
  });

  const transition = useTransition(isDetailPanelOpen, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <Paper
      zDepth={3}
      className={cx("h-full bg-white p-4 flex-1 cursor-pointer", {
        ...bgTheming,
      })}
      onClick={() => setIsDetailPanelOpen(!isDetailPanelOpen)}
    >
      <div className={cx("h-full flex flex-col", { ...fgTheming })}>
        <div className="flex justify-between items-center">
          <span className="text-2xl text-bold">
            {t("authors-and-documents")}
          </span>
          <Button
            iconAfter={
              <animated.div style={{ rotateX }}>
                <Icon name="expand_less" color="expoThemeIcons" />
              </animated.div>
            }
            onClick={(e) => {
              e.stopPropagation(); // this button is inside Paper which has the same onClick
              setIsDetailPanelOpen(!isDetailPanelOpen);
            }}
          >
            {isDetailPanelOpen ? t("less-info") : t("more-info")}
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
              iconBefore={<Icon name="description" color="expoThemeIcons" />}
              onClick={(e) => {
                e.stopPropagation();
                openWorksheetsDialog();
              }}
            >
              {t("worksheet")}
            </Button>
          )}

          {startExpoFiles && startExpoFiles.length !== 0 && (
            <Button
              iconBefore={<Icon name="folder" color="expoThemeIcons" />}
              onClick={(e) => {
                e.stopPropagation();
                openFilesDialog();
              }}
            >
              {t("files")}
            </Button>
          )}
        </div>
      </div>
    </Paper>
  );
};

export default StartDetailPanel;
