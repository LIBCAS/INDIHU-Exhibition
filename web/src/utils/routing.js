import { screenType, interactiveScreenTypes } from "../enums/screenType";

export const nextViewType = (viewExpo, section, screen) => {
  const screens = viewExpo.structure.screens;
  if (section === "start")
    return screens.length && screens[0].length ? screens[0][0].type : screenType.FINISH;
  else if (section === "finish") return screenType.FINISH;
  else
    // ak existuje dalsia screen
    return screens[parseInt(section, 10)].length - 1 > screen
      // vrat dalsiu
      ? screens[section][parseInt(screen, 10) + 1].type
      // inak ak existuje dalsia chapter && chapter ma screeny
      : screens.length - 1 > section && screens[parseInt(section, 10) + 1].length
        // vrat prvy screen dalsej chapter
        ? screens[parseInt(section, 10) + 1][0].type
        // inak finish
        : screenType.FINISH;
};

export const prevViewType = (viewExpo, section, screen) => {
  const screens = viewExpo.structure.screens;
  // ak existuje predchadzajuca screen
  return screen > 0
    // vrat predchadzjucu
    ? screens[section][parseInt(screen, 10) - 1].type
    // inak ak existuje predchadajuca chapter && chapter ma screeny
    : section > 0 && screens[parseInt(section, 10) - 1].length
      // vrat posledny screen predchadzajucej chapter
      ? screens[parseInt(section, 10) - 1][screens[parseInt(section, 10) - 1].length - 1].type
      // inak start
      : screenType.START;
};

export const viewerRouter = (name, viewExpo, section, screen, next) => {
  const screens = viewExpo.structure.screens;
  if (next) {
    if (section === "start")
      return screens.length && screens[0].length ? `/view/${name}/0/0` : `/view/${name}/finish`;
    else if (section === "finish") return `/view/${name}/finish`;
    else
      return screens[parseInt(section, 10)].length - 1 > screen
        ? `/view/${name}/${section}/${parseInt(screen, 10) + 1}`
        : screens.length - 1 > section && screens[parseInt(section, 10) + 1].length
          ? `/view/${name}/${parseInt(section, 10) + 1}/0`
          : `/view/${name}/finish`;
  } else {
    return screen > 0
      ? `/view/${name}/${section}/${parseInt(screen, 10) - 1}`
      : section > 0 && screens[parseInt(section, 10) - 1].length
        ? `/view/${name}/${parseInt(section, 10) - 1}/${screens[parseInt(section, 10) - 1].length - 1}`
        : `/view/${name}/start`;
  }
};

export const interactiveRouter = (viewExpo, section, screen, next) => {
  const screens = viewExpo.structure.screens;
  if (next) {
    // hladaj dalsiu screen v aktualnej section ktora je typu interactive
    for (let i = parseInt(screen, 10) + 1; i < screens[parseInt(section, 10)].length; i++) {
      if (interactiveScreenTypes[screens[parseInt(section, 10)][i].type])
        return { section, screen: i };
    }

    // pre kazdu dalsiu section
    for (let i = parseInt(section, 10) + 1; i < screens.length; i++) {
      // hladaj v section screen typu interactive
      for (let j = 0; j < screens[i].length; j++) {
        if (interactiveScreenTypes[screens[i][j].type])
          return { section: i, screen: j };
      }
    }

    // hladaj od zaciatku expozicie
    return interactiveRouter(viewExpo, 0, -1, true);
  } else {
    for (let i = parseInt(screen, 10) - 1; i >= 0; i--) {
      if (interactiveScreenTypes[screens[parseInt(section, 10)][i].type])
        return { section, screen: i };
    }

    for (let i = parseInt(section, 10) - 1; i >= 0; i--) {
      for (let j = screens[i].length - 1; j >= 0; j--) {
        if (interactiveScreenTypes[screens[i][j].type])
          return { section: i, screen: j };
      }
    }

    return interactiveRouter(viewExpo, screens.length - 1, screens[screens.length - 1].length, false);
  }
};
