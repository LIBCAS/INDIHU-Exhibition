import { useRef, RefObject } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useSpring, animated } from "react-spring";
import { useTranslation } from "react-i18next";

import { useExpoScreenProgress } from "../hooks/expo-screen-progress-hook";
import { useOnClickOutside } from "hooks/use-on-click-outside";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import { ProgressBar } from "components/progress-bar/progress-bar";

import { tickTime } from "constants/view-screen-progress";

import { AppState } from "store/store";
import { Screen } from "models";
import { Document } from "models";

type Props = {
  isDrawerOpen: boolean;
  onClose: () => void;
  forwardButtonRef: RefObject<HTMLDivElement>;
};

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as Screen | undefined,
  (viewScreen) => ({
    viewScreen,
  })
);

export const ViewScreenOverlayDrawer = ({
  isDrawerOpen,
  onClose,
  forwardButtonRef,
}: Props) => {
  const { viewScreen } = useSelector(stateSelector);

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

  const screenText =
    (viewScreen
      ? viewScreen.type === "INTRO"
        ? viewScreen.subTitle
        : "text" in viewScreen
        ? viewScreen.text
        : undefined
      : undefined) ?? t("no-text");

  return (
    <animated.div
      ref={panelRef}
      className="fixed bg-primary z-50 w-full md:w-[450px] lg:w-[550px] top-0 h-[calc(100vh-15px)] text-white"
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
          <div className="overflow-y-auto">{screenText ?? t("no-text")}</div>
        </div>

        {/* Fourth flexbox with current screen documents */}
        <div className="flex flex-col px-8 py-4 md:px-16 md:py-8 h-1/3">
          <div style={{ height: "95%" }} className="overflow-y-auto">
            {viewScreen && "documents" in viewScreen && viewScreen.documents ? (
              <>
                <div className="text-2xl my-2 font-bold">
                  Souvisejíci dokumenty:{" "}
                </div>
                {viewScreen.documents.map(
                  (document: Document, index: number) => (
                    <div
                      key={`document-${index}${
                        document.fileName ? `-${document.fileName}` : ""
                      }`}
                      className="py-1 px-2.5"
                    >
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
                          <span className="ml-3">
                            {(document as Document).fileName ??
                              "Unspecified name"}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                )}
              </>
            ) : (
              <div className="text-xl my-2 font-bold">
                Tato obrazovka neobsahuje žádné soubory
              </div>
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
