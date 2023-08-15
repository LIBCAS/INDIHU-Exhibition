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
  const { t } = useTranslation("screen");

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
    return undefined;
  }, [viewScreen]);

  return (
    <animated.div
      ref={panelRef}
      className={cx(
        "fixed bg-primary z-50 w-full md:w-[450px] lg:w-[550px] top-0 h-[calc(100vh-15px)] text-white",
        {
          "bg-primary": isLightMode,
          "bg-dark-mode-b": !isLightMode,
        }
      )}
      style={drawerStyle}
    >
      {/* First column flexbox */}
      <animated.div className="h-full flex flex-col" style={contentStyle}>
        {/* Second flexbox row -- only button */}
        <div className="flex flex-none justify-end items-center p-4">
          <Button
            iconBefore={<Icon name="close" color="white" />}
            onClick={onClose}
          />
        </div>

        {/* Third flexbox*/}
        <div className="flex flex-col px-8 py-4 overflow-y-auto md:px-16 md:py-8 h-2/3">
          <ExpoTimeProgress key={viewScreen?.id} />
          <span className="text-4xl font-bold py-4">
            {viewScreen?.title ?? t("no-title")}
          </span>
          {screenText && <div className="overflow-y-auto">{screenText}</div>}
        </div>

        {/* Fourth flexbox with current screen documents */}
        <div className="flex flex-col px-8 py-4 md:px-16 md:py-8 h-1/3">
          <div className="h-[95%] overflow-y-auto">
            {viewScreen &&
              "documents" in viewScreen &&
              viewScreen.documents &&
              viewScreen.documents.length !== 0 && (
                <>
                  <div className="text-2xl my-2 font-bold">
                    Souvisejíci dokumenty:{" "}
                  </div>
                  {viewScreen.documents.map(
                    (document: Document, index: number) => (
                      <div
                        key={`document-${index}-${
                          "name" in document ? document.name : document.fileName
                        }`}
                        className="py-1 px-2.5"
                      >
                        {/* Three types of document, first file document, then url document, and last empty link document */}
                        {"fileId" in document ? (
                          <a
                            href={`/api/files/${document.fileId}`}
                            download={document.fileName ?? document.name}
                            className="flex justify-start"
                          >
                            <Icon name="file_download" />
                            <span className="ml-3 underline">
                              {document.fileName ?? document.name}
                            </span>
                          </a>
                        ) : "url" in document ? (
                          <a
                            className="flex justify-start"
                            href={document.url}
                            rel="noreferrer"
                            target="_blank"
                          >
                            <Icon name="language" />
                            <span className="ml-3 underline">
                              {document.fileName}
                            </span>
                          </a>
                        ) : (
                          <div className="flex justify-start">
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
      </animated.div>
    </animated.div>
  );
};

const ExpoTimeProgress = () => {
  const { percentage } = useExpoScreenProgress({ offsetTotalTime: -tickTime });
  return <ProgressBar height={10} color="white" percentage={percentage} />;
};
