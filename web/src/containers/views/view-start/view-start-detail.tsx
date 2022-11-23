import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { animated, useSpring, useTransition } from "react-spring";

import { Button } from "components/button/button";
import { Divider } from "components/divider/divider";
import { LabeledItem } from "components/labeled-item/labeled-item";
import { DialogType } from "components/dialogs/dialog-types";
import { AppDispatch, AppState } from "store/store";
import { setDialog } from "actions/dialog-actions";
import { Icon } from "components/icon/icon";
import { StartScreen } from "models";

import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("exposition");

  const { rotateX } = useSpring({
    rotateX: isOpen ? "180deg" : "0deg",
  });

  const collaborators = viewScreen.collaborators ?? [];

  const openFilesDialog = useCallback(
    () =>
      dispatch(
        setDialog(DialogType.FilesDialog, {
          files: viewScreen.documents,
        })
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
        <Button
          iconBefore={<Icon name="description" color="primary" />}
          onClick={() => {
            /* TODO */
          }}
        >
          {t("worksheet")}
        </Button>
        <Button
          iconBefore={<Icon name="folder" color="primary" />}
          onClick={openFilesDialog}
        >
          {t("files")}
        </Button>
      </div>
    </div>
  );
};
