export const screenType = {
  START: "START",
  FINISH: "FINISH",
  INTRO: "INTRO",
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
  TEXT: "TEXT",
  PARALLAX: "PARALLAX",
  IMAGE_ZOOM: "IMAGE_ZOOM",
  SLIDESHOW: "PHOTOGALERY", // 'PHOTOGALERY' key is used for screen called slideshow, because previosly, there were no second photogallery screen
  PHOTOGALLERY_NEW: "PHOTOGALLERY_NEW",
  IMAGE_CHANGE: "IMAGE_CHANGE",
  EXTERNAL: "EXTERNAL",
  SIGNPOST: "SIGNPOST", // new type of screen
  GAME_FIND: "GAME_FIND",
  GAME_DRAW: "GAME_DRAW",
  GAME_WIPE: "GAME_WIPE",
  GAME_SIZING: "GAME_SIZING",
  GAME_MOVE: "GAME_MOVE",
  GAME_OPTIONS: "GAME_OPTIONS",
} as const;

/** required since there is need for mapping in case photogalery back to slideshow */
export const mapScreenTypeValuesToKeys = {
  START: "START",
  FINISH: "FINISH",
  INTRO: "INTRO",
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
  TEXT: "TEXT",
  PARALLAX: "PARALLAX",
  IMAGE_ZOOM: "IMAGE_ZOOM",

  PHOTOGALERY: "SLIDESHOW", // map 'PHOTOGALERY' | 'SLIDESHOW' to only SLIDESHOW key
  SLIDESHOW: "SLIDESHOW",

  PHOTOGALLERY_NEW: "PHOTOGALLERY_NEW",
  IMAGE_CHANGE: "IMAGE_CHANGE",
  EXTERNAL: "EXTERNAL",
  SIGNPOST: "SIGNPOST",
  GAME_FIND: "GAME_FIND",
  GAME_DRAW: "GAME_DRAW",
  GAME_WIPE: "GAME_WIPE",
  GAME_SIZING: "GAME_SIZING",
  GAME_MOVE: "GAME_MOVE",
  GAME_OPTIONS: "GAME_OPTIONS",
} as const;

/** vyhladavanie v nazvoch obrazoviek */
export const screenTypeText = {
  START: "Úvod výstavy",
  FINISH: "Závěr výstavy",
  INTRO: "Úvod do kapitoly",
  IMAGE: "Obrazovka s obrázkem",
  VIDEO: "Obrazovka s videem",
  TEXT: "Obrazovka s textem",
  PARALLAX: "Parallax",
  IMAGE_ZOOM: "Animace přiblížení",
  SLIDESHOW: "Slideshow",
  PHOTOGALLERY_NEW: "Fotogalerie",
  IMAGE_CHANGE: "Foto před a po",
  EXTERNAL: "Obrazovka s externím obsahem",
  SIGNPOST: "Rozcestník",
  GAME_FIND: "Najdi na obrázku",
  GAME_DRAW: "Dokresli",
  GAME_WIPE: "Stírací los",
  GAME_SIZING: "Hádej velikost",
  GAME_MOVE: "Posuň na správne místo",
  GAME_OPTIONS: "Kvíz",
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
  SLIDESHOW: "fa-picture-o",
  PHOTOGALLERY_NEW: "fa-picture-o",
  IMAGE_CHANGE: "fa-picture-o",
  EXTERNAL: "fa-external-link",
  SIGNPOST: "fa-external-link",
  GAME_FIND: "fa-trophy",
  GAME_DRAW: "fa-trophy",
  GAME_WIPE: "fa-trophy",
  GAME_SIZING: "fa-trophy",
  GAME_MOVE: "fa-trophy",
  GAME_OPTIONS: "fa-trophy",
};

/** menu pre vytvorenie novej obrazovky */
export const screenCategories = [
  {
    categoryId: "CONTENT_SCREEN",
    categoryName: "Obsahová obrazovka",
    screens: [
      { id: "IMAGE", name: "Obrazovka s obrázkem" },
      { id: "VIDEO", name: "Obrazovka s videem" },
      { id: "TEXT", name: "Obrazovka s textem" },
      { id: "PARALLAX", name: "Parallax" },
      { id: "IMAGE_ZOOM", name: "Animace přiblížení" },
      { id: "PHOTOGALERY", name: "Slideshow" },
    ],
  },
  {
    categoryId: "INTERACTIVE_SCREEN",
    categoryName: "Interaktivní obrazovka",
    screens: [
      { id: "PHOTOGALLERY_NEW", name: "Fotogalerie" },
      { id: "IMAGE_CHANGE", name: "Foto před a po" },
      { id: "EXTERNAL", name: "Obrazovka s externím obsahem" },
      { id: "SIGNPOST", name: "Rozcestník" },
    ],
  },
  {
    categoryId: "GAME_SCREEN",
    categoryName: "Herní obrazovka",
    screens: [
      { id: "GAME_FIND", name: "Najdi na obrázku" },
      { id: "GAME_DRAW", name: "Dokresli" },
      { id: "GAME_WIPE", name: "Stírací los" },
      { id: "GAME_SIZING", name: "Hádej velikost" },
      { id: "GAME_MOVE", name: "Posuň na správné místo" },
      { id: "GAME_OPTIONS", name: "Kvíz" },
    ],
  },
];

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
  SLIDESHOW: "slideshow",
  PHOTOGALLERY_NEW: "photogallery",
  IMAGE_CHANGE: "image-change",
  EXTERNAL: "external",
  SIGNPOST: "signpost",
  GAME_FIND: "game-find",
  GAME_DRAW: "game-draw",
  GAME_WIPE: "game-wipe",
  GAME_SIZING: "game-sizing",
  GAME_MOVE: "game-move",
  GAME_OPTIONS: "game-options",
};

/** timeout nastaveny automaticky v ExpoViewer.js */
export const automaticRouting = {
  START: false,
  FINISH: false,
  INTRO: true,
  IMAGE: true,
  VIDEO: true,
  TEXT: true,
  PARALLAX: true,
  IMAGE_ZOOM: true,
  SLIDESHOW: true,
  PHOTOGALLERY_NEW: true,
  IMAGE_CHANGE: true,
  EXTERNAL: true,
  SIGNPOST: true,
  GAME_FIND: true,
  GAME_DRAW: true,
  GAME_WIPE: true,
  GAME_SIZING: true,
  GAME_MOVE: true,
  GAME_OPTIONS: true,
};

// Screen is not shown in mobile device if false
export const mobileDeviceRouting = {
  START: false,
  FINISH: false,
  INTRO: true,
  IMAGE: true,
  VIDEO: true,
  TEXT: true,
  PARALLAX: true,
  IMAGE_ZOOM: true,
  SLIDESHOW: true,
  PHOTOGALLERY_NEW: true,
  IMAGE_CHANGE: true,
  EXTERNAL: true,
  SIGNPOST: false,
  GAME_FIND: false,
  GAME_DRAW: false,
  GAME_WIPE: false,
  GAME_SIZING: false,
  GAME_MOVE: false,
  GAME_OPTIONS: false,
};

/* audio */
export const audioEnabled = {
  START: false,
  FINISH: false,
  INTRO: true,
  IMAGE: true,
  VIDEO: false,
  TEXT: true,
  PARALLAX: true,
  IMAGE_ZOOM: true,
  SLIDESHOW: true,
  PHOTOGALLERY_NEW: true,
  IMAGE_CHANGE: true,
  EXTERNAL: true,
  SIGNPOST: true,
  GAME_FIND: false,
  GAME_DRAW: false,
  GAME_WIPE: false,
  GAME_SIZING: false,
  GAME_MOVE: false,
  GAME_OPTIONS: false,
};

/* music */
export const musicEnabled = {
  START: false,
  FINISH: false,
  INTRO: true,
  IMAGE: true,
  VIDEO: true,
  TEXT: true,
  PARALLAX: true,
  IMAGE_ZOOM: true,
  SLIDESHOW: true,
  PHOTOGALLERY_NEW: true,
  IMAGE_CHANGE: true,
  EXTERNAL: true,
  SIGNPOST: true,
  GAME_FIND: true,
  GAME_DRAW: true,
  GAME_WIPE: true,
  GAME_SIZING: true,
  GAME_MOVE: true,
  GAME_OPTIONS: true,
};

/* whether the current screen supports glass magnifier */
export const glassMagnifierEnabled = {
  START: false,
  FINISH: false,
  INTRO: true,
  IMAGE: true,
  VIDEO: false,
  TEXT: false,
  PARALLAX: false,
  IMAGE_ZOOM: false,
  SLIDESHOW: true,
  PHOTOGALLERY_NEW: false,
  IMAGE_CHANGE: false,
  EXTERNAL: false,
  SIGNPOST: false,
  GAME_FIND: false,
  GAME_DRAW: false,
  GAME_WIPE: false,
  GAME_SIZING: false,
  GAME_MOVE: false,
  GAME_OPTIONS: false,
};

/* list of game screens */
export const gameScreens = [
  screenType.GAME_DRAW,
  screenType.GAME_FIND,
  screenType.GAME_MOVE,
  screenType.GAME_OPTIONS,
  screenType.GAME_SIZING,
  screenType.GAME_WIPE,
];
