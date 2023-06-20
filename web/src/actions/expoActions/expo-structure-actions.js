import * as uuid from "uuid/v4";

import { EXPO_STRUCTURE_SET } from "../constants";
import { saveExpo } from "./expo-actions";
import { screenTypeText, screenType } from "../../enums/screen-type";

/** EXPO STRUCTURE */
export const addScreen =
  (row, idx, type, aloneScreen) => async (dispatch, getState) => {
    const expo = getState().expo.activeExpo;
    const title = `${screenTypeText[type]}${row ? ` ${row + 1}` : ""}`;

    if (aloneScreen) {
      const screens = expo.structure.screens;
      const arr = [
        {
          id: uuid(),
          type,
          title,
          aloneScreen: type === screenType.INTRO ? undefined : aloneScreen,
          answers:
            type === screenType.GAME_OPTIONS
              ? [
                  { correct: true, text: "", image: null },
                  { correct: false, text: "", image: null },
                  { correct: false, text: "", image: null },
                ]
              : undefined,
        },
      ];
      if (row === 0) screens.unshift(arr);
      else if (row > 0) screens.splice(row, 0, arr);
      else screens.push(arr);
      expo.structure.screens = screens;
    } else {
      const screens = expo.structure.screens[row];
      const screenObject = {
        id: uuid(),
        type,
        title,
        answers:
          type === screenType.GAME_OPTIONS
            ? [
                { correct: true, text: "", image: null },
                { correct: false, text: "", image: null },
                { correct: false, text: "", image: null },
              ]
            : undefined,
      };

      if (idx) screens.splice(idx, 0, screenObject);
      else screens.push(screenObject);
      expo.structure.screens[row] = screens;
    }

    dispatch({
      type: EXPO_STRUCTURE_SET,
      payload: {
        screens: expo.structure.screens,
      },
    });

    saveExpo(expo);
  };

export const removeScreen = (row, idx) => async (dispatch, getState) => {
  const expo = getState().expo.activeExpo;
  const screens = expo.structure.screens;
  if (idx === 0) screens.splice(row, 1);
  else {
    screens[row].splice(idx, 1);
    if (screens[row].length < 1) screens.splice(row, 1);
  }
  expo.structure.screens = screens;

  dispatch({
    type: EXPO_STRUCTURE_SET,
    payload: {
      screens: expo.structure.screens,
    },
  });

  saveExpo(expo);
};

export const swapSections = (idx1, idx2) => async (dispatch, getState) => {
  const expo = getState().expo.activeExpo;
  const screens = expo.structure.screens;
  screens[idx1] = screens.splice(idx2, 1, screens[idx1])[0];
  expo.structure.screens = screens;

  dispatch({
    type: EXPO_STRUCTURE_SET,
    payload: {
      screens: expo.structure.screens,
    },
  });

  saveExpo(expo);
};

export const swapScreens = (row, idx1, idx2) => async (dispatch, getState) => {
  const expo = getState().expo.activeExpo;
  const screens = expo.structure.screens[row];
  screens[idx1] = screens.splice(idx2, 1, screens[idx1])[0];
  expo.structure.screens[row] = screens;

  dispatch({
    type: EXPO_STRUCTURE_SET,
    payload: {
      screens: expo.structure.screens,
    },
  });

  saveExpo(expo);
};

export const moveScreen =
  (rowNumOld, colNumOld, rowNumNew, colNumNew) =>
  async (dispatch, getState) => {
    const expo = getState().expo.activeExpo;
    const screens = expo.structure.screens;

    if (rowNumOld === rowNumNew && colNumOld === colNumNew) return;

    if (rowNumOld === rowNumNew) {
      if (colNumOld < colNumNew) {
        screens[rowNumOld] = [
          ...screens[rowNumOld].slice(0, colNumOld),
          ...screens[rowNumOld].slice(colNumOld + 1, colNumNew + 1),
          screens[rowNumOld][colNumOld],
          ...screens[rowNumOld].slice(colNumNew + 1, screens[rowNumOld].length),
        ];
      } else {
        screens[rowNumOld] = [
          ...screens[rowNumOld].slice(0, colNumNew),
          screens[rowNumOld][colNumOld],
          ...screens[rowNumOld].slice(colNumNew, colNumOld),
          ...screens[rowNumOld].slice(colNumOld + 1, screens[rowNumOld].length),
        ];
      }
    } else {
      screens[rowNumNew] = [
        ...screens[rowNumNew].slice(0, colNumNew),
        screens[rowNumOld][colNumOld],
        ...screens[rowNumNew].slice(colNumNew),
      ];

      screens[rowNumOld] = [
        ...screens[rowNumOld].slice(0, colNumOld),
        ...screens[rowNumOld].slice(colNumOld + 1),
      ];
    }

    dispatch({
      type: EXPO_STRUCTURE_SET,
      payload: {
        screens,
      },
    });

    saveExpo(expo);
  };

export const moveAloneScreenToChapter =
  (rowNumOld, rowNumNew, colNumNew) => async (dispatch, getState) => {
    const expo = getState().expo.activeExpo;
    expo.structure.screens =
      rowNumOld < rowNumNew
        ? [
            ...expo.structure.screens.slice(0, rowNumOld),
            ...expo.structure.screens.slice(rowNumOld + 1, rowNumNew),
            [
              ...expo.structure.screens[rowNumNew].slice(0, colNumNew),
              { ...expo.structure.screens[rowNumOld][0], aloneScreen: false },
              ...expo.structure.screens[rowNumNew].slice(
                colNumNew,
                expo.structure.screens[rowNumNew].length
              ),
            ],
            ...expo.structure.screens.slice(
              rowNumNew + 1,
              expo.structure.screens.length
            ),
          ]
        : [
            ...expo.structure.screens.slice(0, rowNumNew),
            [
              ...expo.structure.screens[rowNumNew].slice(0, colNumNew),
              { ...expo.structure.screens[rowNumOld][0], aloneScreen: false },
              ...expo.structure.screens[rowNumNew].slice(
                colNumNew,
                expo.structure.screens[rowNumNew].length
              ),
            ],
            ...expo.structure.screens.slice(rowNumNew + 1, rowNumOld),
            ...expo.structure.screens.slice(
              rowNumOld + 1,
              expo.structure.screens.length
            ),
          ];

    dispatch({
      type: EXPO_STRUCTURE_SET,
      payload: {
        screens: expo.structure.screens,
      },
    });

    saveExpo(expo);
  };

export const moveScreenFromChapter =
  (rowNumOld, colNumOld, rowNumNew) => async (dispatch, getState) => {
    const expo = getState().expo.activeExpo;
    expo.structure.screens =
      rowNumOld < rowNumNew
        ? [
            ...expo.structure.screens.slice(0, rowNumOld),
            [
              ...expo.structure.screens[rowNumOld].slice(0, colNumOld),
              ...expo.structure.screens[rowNumOld].slice(
                colNumOld + 1,
                expo.structure.screens[rowNumOld].length
              ),
            ],
            ...expo.structure.screens.slice(rowNumOld + 1, rowNumNew),
            [
              {
                ...expo.structure.screens[rowNumOld][colNumOld],
                aloneScreen: true,
              },
            ],
            ...expo.structure.screens.slice(
              rowNumNew,
              expo.structure.screens.length
            ),
          ]
        : [
            ...expo.structure.screens.slice(0, rowNumNew),
            [
              {
                ...expo.structure.screens[rowNumOld][colNumOld],
                aloneScreen: true,
              },
            ],
            ...expo.structure.screens.slice(rowNumNew, rowNumOld),
            [
              ...expo.structure.screens[rowNumOld].slice(0, colNumOld),
              ...expo.structure.screens[rowNumOld].slice(
                colNumOld + 1,
                expo.structure.screens[rowNumOld].length
              ),
            ],
            ...expo.structure.screens.slice(
              rowNumOld + 1,
              expo.structure.screens.length
            ),
          ];

    dispatch({
      type: EXPO_STRUCTURE_SET,
      payload: {
        screens: expo.structure.screens,
      },
    });

    saveExpo(expo);
  };

export const moveChapter =
  (rowNumOld, rowNumNew) => async (dispatch, getState) => {
    if (rowNumOld === rowNumNew) return;

    const expo = getState().expo.activeExpo;
    expo.structure.screens =
      rowNumOld < rowNumNew
        ? [
            ...expo.structure.screens.slice(0, rowNumOld),
            ...expo.structure.screens.slice(rowNumOld + 1, rowNumNew + 1),
            expo.structure.screens[rowNumOld],
            ...expo.structure.screens.slice(
              rowNumNew + 1,
              expo.structure.screens.length
            ),
          ]
        : [
            ...expo.structure.screens.slice(0, rowNumNew),
            expo.structure.screens[rowNumOld],
            ...expo.structure.screens.slice(rowNumNew, rowNumOld),
            ...expo.structure.screens.slice(
              rowNumOld + 1,
              expo.structure.screens.length
            ),
          ];

    dispatch({
      type: EXPO_STRUCTURE_SET,
      payload: {
        screens: expo.structure.screens,
      },
    });

    saveExpo(expo);
  };

export const duplicateScreen =
  (rowNumOld, colNumOld, rowNumNew, colNumNew) =>
  async (dispatch, getState) => {
    const expo = getState().expo.activeExpo;
    const screens = expo.structure.screens;

    if (rowNumOld === rowNumNew) {
      screens[rowNumOld] = [
        ...screens[rowNumOld].slice(0, colNumNew),
        screens[rowNumOld][colNumOld],
        ...screens[rowNumOld].slice(colNumNew, screens[rowNumOld].length),
      ];
    } else {
      screens[rowNumNew] = [
        ...screens[rowNumNew].slice(0, colNumNew),
        screens[rowNumOld][colNumOld],
        ...screens[rowNumNew].slice(colNumNew, screens[rowNumOld].length),
      ];
    }

    dispatch({
      type: EXPO_STRUCTURE_SET,
      payload: {
        screens,
      },
    });

    saveExpo(expo);
  };

export const duplicateChapter =
  (rowNumOld, rowNumNew) => async (dispatch, getState) => {
    const expo = getState().expo.activeExpo;
    expo.structure.screens = [
      ...expo.structure.screens.slice(0, rowNumNew),
      expo.structure.screens[rowNumOld],
      ...expo.structure.screens.slice(rowNumNew, expo.structure.screens.length),
    ];

    dispatch({
      type: EXPO_STRUCTURE_SET,
      payload: {
        screens: expo.structure.screens,
      },
    });

    saveExpo(expo);
  };
