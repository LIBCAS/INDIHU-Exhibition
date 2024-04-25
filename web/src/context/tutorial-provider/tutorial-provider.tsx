import {
  ReactNode,
  useState,
  createContext,
  useContext,
  useMemo,
  useEffect,
} from "react";
import { useTranslation } from "react-i18next";

import { generateTutorialStep, generateTutorialSteps } from "./tutorial-utils";

// - - - - - - - -

export type TutorialKey =
  | "overlay"
  | "mobile-overlay"
  | "screenChange"
  | "gameDraw"
  | "gameFind"
  | "gameMove"
  | "gameOptions"
  | "gameSizing"
  | "gameWipe";

export type TutorialStep = {
  stepKey: string;
  label: string;
  text: string;
};

type SingleTutorialObj = {
  steps: TutorialStep[];
  isCurrentlyOpen: boolean;
  isCompleted: boolean;
};

type AllTutorialObjs = {
  [key in TutorialKey]: SingleTutorialObj;
};

type LocalStorageTutorial = {
  [key in TutorialKey]: boolean;
};

type TutorialProviderContextType = {
  store: AllTutorialObjs;
  markSingleTutorialOpenStatus: (
    tutorialKey: TutorialKey,
    status: boolean
  ) => void;
  markSingleTutorialCompletionStatus: (
    tutorialKey: TutorialKey,
    status: boolean
  ) => void;
};

const TutorialContext = createContext<TutorialProviderContextType>(
  undefined as never
);

// - - - - - - - - -

type TutorialProviderProps = {
  children: ReactNode;
};

export const TutorialProvider = ({ children }: TutorialProviderProps) => {
  const { t } = useTranslation("tutorial");

  const storageTutorialString = localStorage.getItem("tutorial");
  const storageTutorial: LocalStorageTutorial | null = storageTutorialString
    ? JSON.parse(storageTutorialString)
    : null;

  const [store, setStore] = useState<AllTutorialObjs>({
    overlay: {
      steps: generateTutorialSteps(
        generateTutorialStep(
          "info",
          t("overlay.info.label"),
          t("overlay.info.text")
        ),
        generateTutorialStep(
          "navigation",
          t("overlay.navigation.label"),
          t("overlay.navigation.text")
        ),
        generateTutorialStep(
          "chapters",
          t("overlay.chapters.label"),
          t("overlay.chapters.text")
        ),
        generateTutorialStep(
          "audio",
          t("overlay.audio.label"),
          t("overlay.audio.text")
        ),
        generateTutorialStep(
          "play",
          t("overlay.play.label"),
          t("overlay.play.text")
        ),
        generateTutorialStep(
          "glass-magnifier",
          t("overlay.glass-magnifier.label"),
          t("overlay.glass-magnifier.text")
        ),
        generateTutorialStep(
          "reactivate-tutorial",
          t("mobile-overlay.reactivate-tutorial.label"),
          t("mobile-overlay.reactivate-tutorial.text")
        ),
        generateTutorialStep(
          "settings",
          t("overlay.settings.label"),
          t("overlay.settings.text")
        ),
        generateTutorialStep(
          "editor",
          t("overlay.editor.label"),
          t("overlay.editor.text")
        ),
        generateTutorialStep(
          "progressbar",
          t("overlay.progressbar.label"),
          t("overlay.progressbar.text")
        ),
        generateTutorialStep(
          "keyboard",
          t("overlay.keyboard.label"),
          t("overlay.keyboard.text")
        )
      ),
      isCurrentlyOpen: false,
      isCompleted: storageTutorial ? storageTutorial.overlay : false,
    },
    "mobile-overlay": {
      steps: generateTutorialSteps(
        generateTutorialStep(
          "play",
          t("mobile-overlay.play.label"),
          t("mobile-overlay.play.text")
        ),
        generateTutorialStep(
          "reactivate-tutorial",
          t("mobile-overlay.reactivate-tutorial.label"),
          t("mobile-overlay.reactivate-tutorial.text")
        ),
        generateTutorialStep(
          "screen-info",
          t("mobile-overlay.screen-info.label"),
          t("mobile-overlay.screen-info.text")
        ),
        generateTutorialStep(
          "help-tutorial-button",
          t("mobile-overlay.help-tutorial-button.label"),
          t("mobile-overlay.help-tutorial-button.text")
        ),
        generateTutorialStep(
          "overlay-button",
          t("mobile-overlay.overlay-button.label"),
          t("mobile-overlay.overlay-button.text")
        )
      ),
      isCurrentlyOpen: false,
      isCompleted: storageTutorial ? storageTutorial["mobile-overlay"] : false,
    },
    screenChange: {
      steps: generateTutorialSteps(
        generateTutorialStep(
          "dragThumb",
          t("screenChange.dragThumb.label"),
          t("screenChange.dragThumb.text")
        )
      ),
      isCurrentlyOpen: false,
      isCompleted: storageTutorial ? storageTutorial.screenChange : false,
    },
    gameDraw: {
      steps: generateTutorialSteps(
        generateTutorialStep(
          "drawing",
          t("gameDraw.help-tutorial.label"),
          t("gameDraw.help-tutorial.text")
        )
      ),
      isCurrentlyOpen: false,
      isCompleted: storageTutorial ? storageTutorial.gameDraw : false,
    },
    gameFind: {
      steps: generateTutorialSteps(
        generateTutorialStep(
          "finding",
          t("gameFind.help-tutorial.label"),
          t("gameFind.help-tutorial.text")
        )
      ),
      isCurrentlyOpen: false,
      isCompleted: storageTutorial ? storageTutorial.gameFind : false,
    },
    gameMove: {
      steps: generateTutorialSteps(
        generateTutorialStep(
          "moving",
          t("gameMove.help-tutorial.label"),
          t("gameMove.help-tutorial.text")
        )
      ),
      isCurrentlyOpen: false,
      isCompleted: storageTutorial ? storageTutorial.gameMove : false,
    },
    gameOptions: {
      steps: generateTutorialSteps(
        generateTutorialStep(
          "options",
          t("gameOptions.help-tutorial.label"),
          t("gameOptions.help-tutorial.text")
        )
      ),
      isCurrentlyOpen: false,
      isCompleted: storageTutorial ? storageTutorial.gameOptions : false,
    },
    gameSizing: {
      steps: generateTutorialSteps(
        generateTutorialStep(
          "sizing",
          t("gameSizing.help-tutorial.label"),
          t("gameSizing.help-tutorial.text")
        )
      ),
      isCurrentlyOpen: false,
      isCompleted: storageTutorial ? storageTutorial.gameSizing : false,
    },
    gameWipe: {
      steps: generateTutorialSteps(
        generateTutorialStep(
          "wiping",
          t("gameWipe.help-tutorial.label"),
          t("gameWipe.help-tutorial.text")
        )
      ),
      isCurrentlyOpen: false,
      isCompleted: storageTutorial ? storageTutorial.gameWipe : false,
    },
  });

  // When some changes occurs to store state, reflect it immediately into local storage
  useEffect(() => {
    const storageObject = Object.entries(store).reduce<LocalStorageTutorial>(
      (acc, [key, tutorialObj]) => ({ ...acc, [key]: tutorialObj.isCompleted }),
      {} as LocalStorageTutorial
    );
    localStorage.setItem("tutorial", JSON.stringify(storageObject));
  }, [store]);

  //
  const markSingleTutorialOpenStatus = (
    tutorialKey: TutorialKey,
    status: boolean
  ) => {
    setStore((prev) => ({
      ...prev,
      [tutorialKey]: { ...prev[tutorialKey], isCurrentlyOpen: status },
    }));
  };

  //
  const markSingleTutorialCompletionStatus = (
    tutorialKey: TutorialKey,
    status: boolean
  ) => {
    setStore((prev) => ({
      ...prev,
      [tutorialKey]: { ...prev[tutorialKey], isCompleted: status },
    }));
  };

  const contextValue: TutorialProviderContextType = {
    store,
    markSingleTutorialOpenStatus,
    markSingleTutorialCompletionStatus,
  };

  return (
    <TutorialContext.Provider value={contextValue}>
      {children}
    </TutorialContext.Provider>
  );
};

// - - - - - - - -

export const useTutorialStore = () => useContext(TutorialContext);

export const useIsAnyTutorialOpened = () => {
  const { store } = useTutorialStore();

  const isAnyTutorialOpened = useMemo(() => {
    let status = false;
    Object.entries(store).forEach(([_key, singleTutorialObj]) => {
      if (singleTutorialObj.isCurrentlyOpen) {
        status = true;
        return;
      }
    });

    return status;
  }, [store]);

  return isAnyTutorialOpened;
};
