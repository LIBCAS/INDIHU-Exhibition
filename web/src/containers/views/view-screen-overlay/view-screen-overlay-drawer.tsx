import { useRef, RefObject, useMemo } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useSpring, animated } from "react-spring";
import { useTranslation } from "react-i18next";

import { useExpoScreenProgress } from "hooks/view-hooks/expo-screen-progress-hook";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";
import { useOnClickOutside } from "hooks/use-on-click-outside";

// Components
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import { ProgressBar } from "components/progress-bar/progress-bar";
import WysiwygPreview from "components/editors/WysiwygEditor/WysiwygPreview";

// Models
import { AppState } from "store/store";
import { Screen, Document } from "models";

// Actions
import { tickTime } from "constants/view-screen-progress";

import cx from "classnames";

// - - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as Screen | undefined,
  (viewScreen) => ({
    viewScreen,
  })
);

type Props = {
  isDrawerOpen: boolean;
  onClose: () => void;
  forwardButtonRef: RefObject<HTMLDivElement>;
};

// - - - - - - -

export const ViewScreenOverlayDrawer = ({
  isDrawerOpen,
  onClose,
  forwardButtonRef,
}: Props) => {
  const { viewScreen } = useSelector(stateSelector);

  const { isLightMode } = useExpoDesignData();

  const panelRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation("view-screen", { keyPrefix: "overlayDrawer" });

  const drawerStyle = useSpring({
    transform: `translate(${isDrawerOpen ? "0%" : "-100%"}, 0)`,
  });

  const contentStyle = useSpring({
    y: isDrawerOpen ? 0 : 20,
    opacity: isDrawerOpen ? 1 : -1,
  });

  useOnClickOutside(panelRef, onClose, "mousedown", forwardButtonRef);

  // Screen text displayed under title and progressbar
  const screenText = useMemo(() => {
    if (!viewScreen) {
      return undefined;
    }
    if (viewScreen.type === "INTRO") {
      return viewScreen.subTitle;
    }
    if ("text" in viewScreen) {
      return viewScreen.text;
    }
    // desktop game screens use its own panel, mobile game screens use thid drawer as well
    if ("task" in viewScreen) {
      return viewScreen.task;
    }
    return undefined;
  }, [viewScreen]);

  return (
    <animated.div
      ref={panelRef}
      className={cx(
        "fixed top-0 w-full md:w-[450px] lg:w-[550px] h-full sm:h-[calc(100vh-15px)] bg-primary text-white z-50",
        {
          "bg-primary": isLightMode,
          "bg-dark-mode-b": !isLightMode,
        }
      )}
      style={drawerStyle}
    >
      <animated.div className={cx("h-full flex flex-col")} style={contentStyle}>
        <div className="flex flex-none justify-end items-center p-4">
          <Button
            iconBefore={<Icon name="close" color="white" />}
            onClick={onClose}
          />
        </div>

        <div className="flex-grow flex flex-col gap-6 px-8 pt-0 pb-8 md:px-12 overflow-y-auto">
          <div>
            <ExpoTimeProgress key={viewScreen?.id} />
          </div>
          <div>
            <span className="text-3xl font-bold">
              {viewScreen?.title ?? t("no-title")}
            </span>
          </div>

          {/*  */}
          <div className="flex-grow flex flex-col justify-between gap-8 overflow-y-auto">
            <div className="flex-grow overflow-y-auto pr-2 expo-scrollbar">
              {screenText ? (
                <div>
                  <WysiwygPreview htmlMarkup={screenText} />
                </div>
              ) : (
                <div className="italic">{t("no-text")}</div>
              )}
            </div>

            <div className="max-h-[35%] overflow-y-auto pr-2 expo-scrollbar">
              {viewScreen &&
                "documents" in viewScreen &&
                viewScreen.documents &&
                viewScreen.documents.length !== 0 && (
                  <>
                    <div className="text-2xl my-2 font-bold">
                      {t("relatedDocuments")}
                    </div>
                    {viewScreen.documents.map(
                      (document: Document, index: number) => (
                        <div
                          key={`document-${index}-${
                            "name" in document
                              ? document.name
                              : document.fileName
                          }`}
                          className="py-1 px-2.5"
                        >
                          {"fileId" in document ? (
                            <div className="flex justify-start items-start">
                              <Icon name="file_download" />
                              <div className="ml-3 underline">
                                <a
                                  href={`/api/files/${document.fileId}`}
                                  download={document.fileName ?? document.name}
                                >
                                  {document.fileName ?? document.name}
                                </a>
                              </div>
                            </div>
                          ) : "url" in document ? (
                            <div className="flex justify-start items-start">
                              <Icon name="language" />
                              <div className="ml-3 underline">
                                <a
                                  href={document.url}
                                  rel="noreferrer"
                                  target="_blank"
                                >
                                  {document.fileName}
                                </a>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-start items-start">
                              <Icon name="filter_none" />
                              <span className="ml-3">{document.fileName}</span>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </>
                )}
            </div>
          </div>
        </div>
      </animated.div>
    </animated.div>
  );
};

const ExpoTimeProgress = () => {
  const { isLightMode } = useExpoDesignData();
  const { percentage } = useExpoScreenProgress({ offsetTotalTime: -tickTime });
  return (
    <ProgressBar
      height={10}
      percentage={percentage}
      color={isLightMode ? "white" : undefined}
    />
  );
};
