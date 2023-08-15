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
  overlay: SingleTutorialObj;
  screenChange: SingleTutorialObj;
};

export type TutorialKey = keyof AllTutorialObjs;

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
  });

  useEffect(() => {
    const storageObject = Object.entries(store).reduce<LocalStorageTutorial>(
      (acc, [key, tutorialObj]) => ({ ...acc, [key]: tutorialObj.isCompleted }),
      {} as LocalStorageTutorial
    );
    localStorage.setItem("tutorial", JSON.stringify(storageObject));
  }, [store]);

  const markSingleTutorialOpenStatus = (
    tutorialKey: TutorialKey,
    status: boolean
  ) => {
    setStore((prev) => ({
      ...prev,
      [tutorialKey]: { ...prev[tutorialKey], isCurrentlyOpen: status },
    }));
  };

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
