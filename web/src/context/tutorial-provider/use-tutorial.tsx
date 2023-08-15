import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useTutorialStore } from "./tutorial-provider";

import { useSectionScreen } from "hooks/view-hooks/section-screen-hook";

// Components
import { Popper } from "components/popper/popper";
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

// Types
import { TutorialKey, TutorialStep } from "./tutorial-provider";

// - - - - - - - -

export type RefCallback = (ref: HTMLElement | null) => void;

// - - - - - - - -

export const useTutorial = (tutorialKey: TutorialKey, shouldOpen = true) => {
  const { t } = useTranslation("tutorial");

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
  const { section, screen } = useSectionScreen();

  // Information about current step object, its anchor, etc ..
  // currStepObj is one step from array of steps, but if index is equal to length or bigger, then it will be undefined
  const isTutorialCompleted = store[tutorialKey].isCompleted;

  const currStepObj: TutorialStep | undefined | null =
    shouldOpen && !isTutorialCompleted ? steps[currStepIndex] : null;

  const currAnchor: HTMLElement | undefined | null = currStepObj
    ? anchors[currStepObj?.stepKey]
    : null;

  const isTutorialOpen =
    shouldOpen && !isTutorialCompleted && currStepObj && currAnchor
      ? true
      : false;

  // When opened status for some of the tutorials change, mark it into the store object stored in local storage
  useEffect(() => {
    if (isTutorialOpen) {
      markSingleTutorialOpenStatus(tutorialKey, true);
    }

    return () => {
      markSingleTutorialOpenStatus(tutorialKey, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTutorialOpen]);

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

  // 1.
  const nextTutorialStep = useCallback(() => {
    if (currStepIndex + 1 === steps.length) {
      markSingleTutorialOpenStatus(tutorialKey, false);
      markSingleTutorialCompletionStatus(tutorialKey, true);
    }
    // Can cause currStepObj to be undefined
    setCurrStepIndex((prev) => prev + 1);
  }, [
    currStepIndex,
    markSingleTutorialCompletionStatus,
    markSingleTutorialOpenStatus,
    steps.length,
    tutorialKey,
  ]);

  // 2.
  const skipTutorial = useCallback(() => {
    setCurrStepIndex(steps.length);
    markSingleTutorialCompletionStatus(tutorialKey, true);
    markSingleTutorialOpenStatus(tutorialKey, false);
  }, [
    markSingleTutorialCompletionStatus,
    markSingleTutorialOpenStatus,
    steps.length,
    tutorialKey,
  ]);

  // 3.
  const escapeTutorial = useCallback(() => {
    setCurrStepIndex(steps.length);
    markSingleTutorialCompletionStatus(tutorialKey, false);
    markSingleTutorialOpenStatus(tutorialKey, false);
  }, [
    markSingleTutorialCompletionStatus,
    markSingleTutorialOpenStatus,
    steps.length,
    tutorialKey,
  ]);

  // Tooltip component which will display information (label, text) of current tutorial step
  const TutorialTooltip = useMemo(
    () =>
      currStepObj && (
        <Popper
          open={isTutorialOpen}
          anchor={currAnchor ?? null}
          arrow
          placement="auto"
          rebuildListener={screen}
          rebuildListener2={section}
        >
          <div className="p-2">
            <div className="flex justify-between">
              <span className="text-2xl font-semibold inline-block mb-2">
                {currStepObj.label}
              </span>
              <span className="text-muted">
                {currStepIndex + 1} z {steps.length}
              </span>
            </div>
            <p>{currStepObj.text}</p>
            <div className="flex items-center justify-between gap-2">
              <Button
                color="white"
                iconBefore={<Icon color="primary" name="skip_next" />}
                onClick={skipTutorial}
              >
                {t("skip", { ns: "tutorial" })}
              </Button>
              <Button color="primary" onClick={nextTutorialStep}>
                {currStepIndex + 1 === steps.length
                  ? t("finish", { ns: "tutorial" })
                  : t("next", { ns: "tutorial" })}
              </Button>
            </div>
          </div>
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
      t,
    ]
  );

  // Returned object
  const tutorial = useMemo(
    () => ({
      bind,
      step: currStepObj,
      TutorialTooltip,
      escapeTutorial,
      isTutorialOpen,
    }),
    [TutorialTooltip, bind, currStepObj, escapeTutorial, isTutorialOpen]
  );

  return tutorial;
};
