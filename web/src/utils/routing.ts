import { ExpoSection, ExpoScreen } from "hooks/view-hooks/section-screen-hook";
import { ViewExpo, Screen } from "models";

// - -

const handleNextScreen = (
  name: string,
  screens: Screen[][],
  section: ExpoSection,
  screen: ExpoScreen
) => {
  if (section === undefined) {
    return undefined;
  }

  if (section === "start") {
    const hasFirstScreenOfFirstChapter =
      screens.length !== 0 && screens[0].length !== 0;
    if (hasFirstScreenOfFirstChapter) {
      return `/view/${name}/0/0`;
    }
    return `/view/${name}/finish`;
  }

  if (section === "finish") {
    return `/view/${name}/finish`;
  }

  // Number section
  if (screen === undefined) {
    return undefined;
  }
  const numberOfChapters = screens.length;
  const currChapter = screens[section];
  const currChapterLength = currChapter.length;
  if (section === numberOfChapters - 1 && screen === currChapterLength - 1) {
    return `/view/${name}/finish`;
  }
  if (screen === currChapterLength - 1) {
    return `/view/${name}/${section + 1}/0`;
  }
  return `/view/${name}/${section}/${screen + 1}`;
};

// - -

const handlePreviousScreen = (
  name: string,
  screens: Screen[][],
  section: ExpoSection,
  screen: ExpoScreen
) => {
  if (section === undefined) {
    return undefined;
  }

  if (section === "start") {
    return `/view/${name}/start`;
  }

  if (section === "finish") {
    const numberOfChapters = screens.length;
    if (numberOfChapters === 0) {
      return `/view/${name}/start`;
    }
    const lastChapter = screens[numberOfChapters - 1];
    const lastChapterLength = lastChapter.length;
    return `/view/${name}/${numberOfChapters - 1}/${lastChapterLength - 1}`;
  }

  // Number section
  if (screen === undefined) {
    return undefined;
  }
  if (section === 0 && screen === 0) {
    return `/view/${name}/start`;
  }
  if (screen === 0) {
    const previousChapter = screens[section - 1];
    const previousChapterLength = previousChapter.length;
    return `/view/${name}/${section - 1}/${previousChapterLength - 1}`;
  }

  return `/view/${name}/${section}/${screen - 1}`;
};

export const viewerRouter = (
  name: string,
  viewExpo: ViewExpo | null,
  section: ExpoSection,
  screen: ExpoScreen,
  isNext: boolean
) => {
  if (!viewExpo) {
    return undefined;
  }

  const screens = viewExpo.structure.screens;

  if (isNext) {
    return handleNextScreen(name, screens, section, screen);
  }

  return handlePreviousScreen(name, screens, section, screen);
};
