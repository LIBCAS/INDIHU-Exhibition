import { useCallback, useMemo, useState } from "react";
import { Popper } from "components/popper/popper";
import { TutorialStoreType, useTutorialStore } from "./tutorial-store";
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import { useTranslation } from "react-i18next";

export type TutorialStep<TKey extends string = string> = {
  key: TKey;
  label: string;
  text: string;
};

// helper to infer key types of steps for proper typings when creating tutorial steps
export const asTutorialSteps = <TKey extends string = string>(
  steps: TutorialStep<TKey>[]
) => steps;

type RefCallback = (ref: HTMLElement | null) => void;

export const useTutorial = <TKey extends string>(
  key: keyof TutorialStoreType,
  steps: TutorialStep<TKey>[]
) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [anchors, setAnchors] = useState<
    Partial<Record<TKey, HTMLElement | null>>
  >({});
  const { t } = useTranslation("tutorial");

  const [store, setStore] = useTutorialStore();

  const refCallbacks = useMemo(
    () =>
      steps.reduce<Record<TKey, RefCallback>>(
        (acc, step) => ({
          ...acc,
          [step.key]: (ref: HTMLElement | null) =>
            setAnchors((prev) => ({ ...prev, [step.key]: ref })),
        }),
        {} as Record<TKey, RefCallback>
      ),
    [steps]
  );

  const bind = useCallback(
    (key: TKey) => ({
      ref: refCallbacks[key],
    }),
    [refCallbacks]
  );

  const step = steps[stepIndex] as typeof steps[number] | undefined;
  const anchor = (step?.key ? anchors[step.key] : null) ?? null;
  const open = !!step && store[key];

  const next = useCallback(() => {
    if (stepIndex + 1 === steps.length)
      setStore((prev) => ({ ...prev, [key]: false }));

    setStepIndex((prev) => prev + 1);
  }, [key, setStore, stepIndex, steps.length]);

  const skipTutorial = useCallback(() => {
    setStepIndex(steps.length);
    setStore((prev) => ({ ...prev, [key]: false }));
  }, [key, setStore, steps.length]);

  const TutorialTooltip = useMemo(
    () =>
      step && (
        <Popper open={open} anchor={anchor} arrow placement="auto">
          <div className="p-2">
            <div className="flex justify-between">
              <span className="text-2xl font-semibold inline-block mb-2">
                {step.label}
              </span>
              <span className="text-muted">
                {stepIndex + 1} z {steps.length}
              </span>
            </div>
            <p>{step.text}</p>
            <div className="flex items-center justify-between gap-2">
              <Button
                color="white"
                iconBefore={<Icon color="primary" name="skip_next" />}
                onClick={skipTutorial}
              >
                {t("skip", { ns: "tutorial" })}
              </Button>
              <Button color="primary" onClick={next}>
                {stepIndex + 1 === steps.length
                  ? t("finish", { ns: "tutorial" })
                  : t("next", { ns: "tutorial" })}
              </Button>
            </div>
          </div>
        </Popper>
      ),
    [anchor, next, open, skipTutorial, step, stepIndex, steps.length, t]
  );

  return useMemo(
    () => ({
      bind,
      step,
      store,
      TutorialTooltip,
    }),
    [TutorialTooltip, bind, step, store]
  );
};
