import { find, findIndex, forEach, get } from "lodash";
import {
  screenType,
  mobileDeviceRouting,
  mapScreenTypeValuesToKeys,
} from "../enums/screen-type";
import { isMobileDevice } from "../utils";

/**
 * Checks if screen can be shown on mobile device
 */
const screenForMobileDeviceCheck = (
  next,
  sectionIndex,
  screenIndex,
  currentSectionIndex,
  currentScreenIndex,
  currentScreen
) =>
  ((next &&
    (currentSectionIndex > sectionIndex ||
      (currentSectionIndex === sectionIndex &&
        currentScreenIndex > screenIndex))) ||
    (!next &&
      (currentSectionIndex < sectionIndex ||
        (currentSectionIndex === sectionIndex &&
          currentScreenIndex < screenIndex)))) &&
  mobileDeviceRouting[mapScreenTypeValuesToKeys[currentScreen.type]];

// přeskočit hry pro mobilní zařízení
const getScreenTypeForMobileDevice = (
  screens,
  section,
  screen,
  next = true
) => {
  let screenTypeForMobileDevice = next ? screenType.FINISH : screenType.START;

  forEach(next ? screens : screens.reverse(), (s, i) => {
    if (s.length && ((next && i >= section) || (!next && i <= section))) {
      const screenForMobileDevice = find(next ? s : s.reverse(), (ss, j) =>
        screenForMobileDeviceCheck(next, section, screen, i, j, ss)
      );
      if (get(screenForMobileDevice, "type")) {
        screenTypeForMobileDevice = screenForMobileDevice.type;
        return false;
      }
    }
  });

  return screenTypeForMobileDevice;
};

// přeskočit hry pro mobilní zařízení
const getScreenUrlForMobileDevice = (
  screens,
  name,
  section,
  screen,
  next = true
) => {
  let screenUrlForMobileDevice = next
    ? `/view/${name}/finish`
    : `/view/${name}/start`;

  forEach(next ? screens : screens.reverse(), (s, i) => {
    if (s.length && ((next && i >= section) || (!next && i <= section))) {
      const index = findIndex(next ? s : s.reverse(), (ss, j) =>
        screenForMobileDeviceCheck(next, section, screen, i, j, ss)
      );
      if (index > -1) {
        screenUrlForMobileDevice = `/view/${name}/${i}/${index}`;
        return false;
      }
    }
  });

  return screenUrlForMobileDevice;
};

export const nextViewType = (viewExpo, section, screen) => {
  const screens = viewExpo.structure.screens;
  if (section === "finish") return screenType.FINISH;
  else if (section === "start") {
    return screens.length && screens[0].length
      ? isMobileDevice()
        ? getScreenTypeForMobileDevice(screens, 0, -1) // -1 pro začátek hledání od první obrazovky
        : screens[0][0].type
      : screenType.FINISH;
  }
  // ak existuje dalsia screen
  else {
    return isMobileDevice()
      ? getScreenTypeForMobileDevice(
          screens,
          parseInt(section, 10),
          parseInt(screen, 10)
        )
      : screens[parseInt(section, 10)].length - 1 > screen
      ? // vrat dalsiu
        screens[section][parseInt(screen, 10) + 1].type
      : // inak ak existuje dalsia chapter && chapter ma screeny
      screens.length - 1 > section && screens[parseInt(section, 10) + 1].length
      ? // vrat prvy screen dalsej chapter
        screens[parseInt(section, 10) + 1][0].type
      : // inak finish
        screenType.FINISH;
  }
};

export const prevViewType = (viewExpo, section, screen) => {
  const screens = viewExpo.structure.screens;
  // ak existuje predchadzajuca screen
  return isMobileDevice()
    ? getScreenTypeForMobileDevice(
        screens,
        parseInt(section, 10),
        parseInt(screen, 10),
        false
      )
    : screen > 0
    ? // vrat predchadzjucu
      screens[section][parseInt(screen, 10) - 1].type
    : // inak ak existuje predchadajuca chapter && chapter ma screeny
    section > 0 && screens[parseInt(section, 10) - 1].length
    ? // vrat posledny screen predchadzajucej chapter
      screens[parseInt(section, 10) - 1][
        screens[parseInt(section, 10) - 1].length - 1
      ].type
    : // inak start
      screenType.START;
};

export const viewerRouter = (name, viewExpo, section, screen, next) => {
  const screens = viewExpo.structure.screens;
  if (next) {
    if (section === "start")
      return screens.length && screens[0].length
        ? isMobileDevice()
          ? getScreenUrlForMobileDevice(screens, name, 0, -1) // -1 pro začátek hledání od první obrazovky
          : `/view/${name}/0/0`
        : `/view/${name}/finish`;
    else if (section === "finish") return `/view/${name}/finish`;
    else
      return isMobileDevice()
        ? getScreenUrlForMobileDevice(
            screens,
            name,
            parseInt(section, 10),
            parseInt(screen, 10)
          )
        : screens[parseInt(section, 10)].length - 1 > screen
        ? `/view/${name}/${section}/${parseInt(screen, 10) + 1}`
        : screens.length - 1 > section &&
          screens[parseInt(section, 10) + 1].length
        ? `/view/${name}/${parseInt(section, 10) + 1}/0`
        : `/view/${name}/finish`;
  } else {
    return isMobileDevice()
      ? getScreenUrlForMobileDevice(
          screens,
          name,
          parseInt(section, 10),
          parseInt(screen, 10),
          false
        )
      : screen > 0
      ? `/view/${name}/${section}/${parseInt(screen, 10) - 1}`
      : section > 0 && screens[parseInt(section, 10) - 1].length
      ? `/view/${name}/${parseInt(section, 10) - 1}/${
          screens[parseInt(section, 10) - 1].length - 1
        }`
      : `/view/${name}/start`;
  }
};
