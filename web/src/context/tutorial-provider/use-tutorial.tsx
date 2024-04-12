import { useState, useMemo, useCallback, useEffect } from "react";

import { useIsAnyTutorialOpened, useTutorialStore } from "./tutorial-provider";

import { useSectionScreenParams } from "hooks/view-hooks/section-screen-hook";

// Components
import { Popper } from "components/popper/popper";
import TutorialContentBody from "./TutorialContentBody";

// Types
import { TutorialKey, TutorialStep } from "./tutorial-provider";

// - - - - - - - -

export type RefCallback = (ref: HTMLElement | null) => void;

// - - - - - - - -

export const useTutorial = (tutorialKey: TutorialKey, shouldOpen = true) => {
  // Whole object will all tutorials and their info + helper functions to manipulate with them
  const {
    store,
    markSingleTutorialOpenStatus,
    markSingleTutorialCompletionStatus,
  } = useTutorialStore();

  // From all tutorials, pick the one corresponding to the provided tutorialKey
  const singleTutorialObj = useMemo(() => {
    return store[tutorialKey];
  }, [store, tutorialKey]);

  // From active tutorial, based on provided tutorialKey, pick all of its steps
  const steps = useMemo(() => {
    return singleTutorialObj.steps;
  }, [singleTutorialObj.steps]);

  // - - -

  // Index of currently displaying step of tutorial based on provided tutorialKey
  const [currStepIndex, setCurrStepIndex] = useState<number>(0);

  // Anchors is record, where keys are step keys and values are HTMLElements as refs
  // Every single tutorial step from all tutorial steps will have one assigned HTMLElement as ref in this record
  // {[step.stepKey]: div.className}
  const [anchors, setAnchors] = useState<
    Partial<Record<string, HTMLElement | null>>
  >({});

  //  Record containing one callback for each single tutorial step from all tutorial steps
  // {[step.stepKey]: (ref: HTMLElement | null) => setAnchors(.....) }
  const refCallbacks = useMemo(
    () =>
      steps.reduce<Record<string, RefCallback>>(
        (acc, step) => ({
          ...acc,
          [step.stepKey]: (ref: HTMLElement | null) =>
            setAnchors((prev) => ({ ...prev, [step.stepKey]: ref })),
        }),
        {} as Record<string, RefCallback>
      ),
    [steps]
  );

  // Function which will pick one corresponding ref callback for one tutorial step, based on provided stepKey
  // This picked callback will setAnchor for this tutorial step with element on which bind is called upon
  // <div {...bind("chapters")}></div>
  // <div ref={refCallbacks["chapters"]}></div?
  // <div ref={(ref: HTMLDivElement | null) => setAnchors((prev) => ({ ...prev, ["chapters"]: ref }) )}></div>
  const bind = useCallback(
    (stepKey: string) => ({ ref: refCallbacks[stepKey] }),
    [refCallbacks]
  );

  //
  const { section, screen } = useSectionScreenParams();

  // Information about current step object, its anchor, etc ..
  // currStepObj is one step from array of steps, but if index is equal to length or bigger, then it will be undefined
  const isTutorialCompleted = store[tutorialKey].isCompleted;

  const isTutorialOpenAllowed =
    !isTutorialCompleted && shouldOpen && currStepIndex < steps.length;

  const currStepObj: TutorialStep | null = isTutorialOpenAllowed
    ? steps[currStepIndex] ?? null
    : null;

  const currAnchor: HTMLElement | null = currStepObj
    ? anchors[currStepObj?.stepKey] ?? null
    : null;

  const isTutorialOpen = isTutorialOpenAllowed && !!currStepObj && !!currAnchor;

  // Write current tutorial open status to the tutorial store, global information
  useEffect(() => {
    if (isTutorialOpen) {
      markSingleTutorialOpenStatus(tutorialKey, true);
    }

    return () => {
      markSingleTutorialOpenStatus(tutorialKey, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTutorialOpen]);

  //
  useEffect(() => {
    if (currAnchor && isTutorialOpen) {
      currAnchor.classList.add("border-solid", "border-4", "border-primary");
    }

    return () => {
      currAnchor?.classList.remove(
        "border-solid",
        "border-4",
        "border-primary"
      );
    };
  }, [currAnchor, isTutorialOpen]);

  // Reset back to first step if tutorial key changes (e.g mobile to mobile landscape)
  useEffect(() => {
    setCurrStepIndex(0);
  }, [tutorialKey]);

  // 1.
  const nextTutorialStep = useCallback(() => {
    if (currStepIndex + 1 === steps.length) {
      markSingleTutorialCompletionStatus(tutorialKey, true);
      setCurrStepIndex(steps.length);
      return;
    }
    // Can cause currStepObj to be undefined -> null
    setCurrStepIndex((prev) => prev + 1);
  }, [
    currStepIndex,
    markSingleTutorialCompletionStatus,
    steps.length,
    tutorialKey,
  ]);

  // 2.
  const skipTutorial = useCallback(() => {
    setCurrStepIndex(steps.length);
    markSingleTutorialCompletionStatus(tutorialKey, true);
  }, [markSingleTutorialCompletionStatus, steps.length, tutorialKey]);

  // 3.
  const escapeTutorial = useCallback(() => {
    setCurrStepIndex(steps.length);
    markSingleTutorialCompletionStatus(tutorialKey, false);
  }, [markSingleTutorialCompletionStatus, steps.length, tutorialKey]);

  // 4.
  const reactivateTutorial = useCallback(() => {
    setCurrStepIndex(0);
    markSingleTutorialCompletionStatus(tutorialKey, false);
  }, [markSingleTutorialCompletionStatus, tutorialKey]);

  // Tooltip component which will display information (label, text) of current tutorial step
  const TutorialTooltip = useMemo(
    () =>
      isTutorialOpen && (
        <Popper
          open={isTutorialOpen}
          anchor={currAnchor}
          arrow
          placement="auto"
          rebuildListener={screen}
          rebuildListener2={section}
        >
          <TutorialContentBody
            currStepObj={currStepObj}
            currStepIndex={currStepIndex}
            numberOfSteps={steps.length}
            nextTutorialStep={nextTutorialStep}
            skipTutorial={skipTutorial}
          />
        </Popper>
      ),
    [
      currAnchor,
      currStepIndex,
      currStepObj,
      isTutorialOpen,
      nextTutorialStep,
      screen,
      section,
      skipTutorial,
      steps.length,
    ]
  );

  // - -

  // true if this or any other tutorial is opened
  const isAnyTutorialOpened = useIsAnyTutorialOpened();

  const getTutorialEclipseClassnameByStepkeys = useCallback(
    (stepKeys: string[]): string => {
      const className = "bg-black opacity-40";
      if (!isAnyTutorialOpened) {
        return "";
      }
      if (isAnyTutorialOpened && !isTutorialOpen) {
        return className;
      }
      if (isTutorialOpen && !stepKeys.includes(currStepObj.stepKey)) {
        return className;
      }
      return "";
    },
    [currStepObj?.stepKey, isAnyTutorialOpened, isTutorialOpen]
  );

  const getTutorialEnhanceClassnameByStepkeys = useCallback(
    (stepKeys: string[]) => {
      if (isTutorialOpen && stepKeys.includes(currStepObj.stepKey)) {
        return "border-solid border-4 border-primary";
      }
      return "";
    },
    [currStepObj?.stepKey, isTutorialOpen]
  );

  // - -

  // Returned object
  const tutorial = useMemo(
    () => ({
      bind,
      step: currStepObj,
      TutorialTooltip,
      escapeTutorial,
      isTutorialOpen,
      getTutorialEclipseClassnameByStepkeys,
      getTutorialEnhanceClassnameByStepkeys,
      reactivateTutorial,
      isTutorialCompleted,
    }),
    [
      TutorialTooltip,
      bind,
      currStepObj,
      escapeTutorial,
      isTutorialOpen,
      getTutorialEclipseClassnameByStepkeys,
      getTutorialEnhanceClassnameByStepkeys,
      reactivateTutorial,
      isTutorialCompleted,
    ]
  );

  return tutorial;
};
