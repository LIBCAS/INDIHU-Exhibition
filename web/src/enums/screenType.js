export const screenType = {
  START: "START",
  FINISH: "FINISH",
  INTRO: "INTRO",
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
  TEXT: "TEXT",
  PARALLAX: "PARALLAX",
  IMAGE_ZOOM: "IMAGE_ZOOM",
  PHOTOGALERY: "PHOTOGALERY",
  IMAGE_CHANGE: "IMAGE_CHANGE",
  EXTERNAL: "EXTERNAL",
  GAME_FIND: "GAME_FIND",
  GAME_DRAW: "GAME_DRAW",
  GAME_WIPE: "GAME_WIPE",
  GAME_SIZING: "GAME_SIZING",
  GAME_MOVE: "GAME_MOVE",
  GAME_OPTIONS: "GAME_OPTIONS"
};

/** stránky s interaktivním módem */
export const interactiveScreenTypes = {
  INTRO: true,
  IMAGE: true,
  VIDEO: true,
  TEXT: true,
  PARALLAX: true,
  IMAGE_ZOOM: true,
  PHOTOGALERY: true,
  IMAGE_CHANGE: true,
  EXTERNAL: true,
  GAME_FIND: false,
  GAME_DRAW: false,
  GAME_WIPE: false,
  GAME_SIZING: false,
  GAME_MOVE: false,
  GAME_OPTIONS: false
};

/** vyhladavanie v nazvoch obrazoviek */
export const screenTypeText = {
  START: "Úvod výstavy",
  FINISH: "Závěr výstavy",
  INTRO: "Úvod do kapitoly",
  IMAGE: "Obrazovka s obrázkem", // animacia/infopointy
  VIDEO: "Obrazovka s videem",
  TEXT: "Obrazovka s textem",
  PARALLAX: "Parallax",
  IMAGE_ZOOM: "Zoom in",
  PHOTOGALERY: "Fotogalerie",
  IMAGE_CHANGE: "Foto před a po",
  EXTERNAL: "Obrazovka s externím objektem",
  GAME_FIND: "Najdi na obrázku",
  GAME_DRAW: "Dokresli",
  GAME_WIPE: "Stírací los",
  GAME_SIZING: "Hádej velikost",
  GAME_MOVE: "Posuň na správne místo",
  GAME_OPTIONS: "Výběr z možností"
};

export const screenTypeIcon = {
  START: "fa-star",
  FINISH: "fa-star",
  INTRO: "fa-bookmark",
  IMAGE: "fa-picture-o",
  VIDEO: "fa-video-camera",
  TEXT: "fa-align-right",
  PARALLAX: "fa-picture-o",
  IMAGE_ZOOM: "fa-picture-o",
  PHOTOGALERY: "fa-picture-o",
  IMAGE_CHANGE: "fa-picture-o",
  EXTERNAL: "fa-external-link",
  GAME_FIND: "fa-trophy",
  GAME_DRAW: "fa-trophy",
  GAME_WIPE: "fa-trophy",
  GAME_SIZING: "fa-trophy",
  GAME_MOVE: "fa-trophy",
  GAME_OPTIONS: "fa-trophy"
};

/** menu pre vytvorenie novej obrazovky */
export const newScreen = {
  SCREEN: [
    ["IMAGE", "Obrazovka s obrázkem"],
    ["VIDEO", "Obrazovka s videem"],
    ["TEXT", "Obrazovka s textem"],
    ["PARALLAX", "Parallax"],
    ["IMAGE_ZOOM", "Zoom in"],
    ["PHOTOGALERY", "Fotogalerie"],
    ["IMAGE_CHANGE", "Foto před a po"],
    ["EXTERNAL", "Obrazovka s externím objektem"]
  ],
  GAME: [
    ["GAME_FIND", "Nájdi v obrázku"],
    ["GAME_DRAW", "Dokresli"],
    ["GAME_WIPE", "Stírací los"],
    ["GAME_SIZING", "Hádej velikost"],
    ["GAME_MOVE", "Posuň na správne místo"],
    ["GAME_OPTIONS", "Výběr z možností"]
  ]
};

/** url obrazovky */
export const screenUrl = {
  START: "start",
  FINISH: "finish",
  INTRO: "intro",
  IMAGE: "image",
  VIDEO: "video",
  TEXT: "text",
  PARALLAX: "parallax",
  IMAGE_ZOOM: "image-zoom",
  PHOTOGALERY: "photogalery",
  IMAGE_CHANGE: "image-change",
  EXTERNAL: "external",
  GAME_FIND: "game-find",
  GAME_DRAW: "game-draw",
  GAME_WIPE: "game-wipe",
  GAME_SIZING: "game-sizing",
  GAME_MOVE: "game-move",
  GAME_OPTIONS: "game-options"
};

/** timeout nastaveny automaticky v ExpoViewer.js */
export const automaticRouting = {
  INTRO: true,
  IMAGE: true,
  VIDEO: false,
  TEXT: true,
  PARALLAX: true,
  IMAGE_ZOOM: true,
  PHOTOGALERY: true,
  IMAGE_CHANGE: true,
  EXTERNAL: true,
  GAME_FIND: false,
  GAME_DRAW: false,
  GAME_WIPE: false,
  GAME_SIZING: false,
  GAME_MOVE: false,
  GAME_OPTIONS: false
};
