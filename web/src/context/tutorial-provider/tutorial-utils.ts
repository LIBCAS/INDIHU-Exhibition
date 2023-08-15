import { TutorialStep } from "./tutorial-provider";

export const generateTutorialStep = (
  stepKey: string,
  label: string,
  text: string
) => ({
  stepKey: stepKey,
  label: label,
  text: text,
});

export const generateTutorialSteps = (...tutorialSteps: TutorialStep[]) =>
  tutorialSteps;
