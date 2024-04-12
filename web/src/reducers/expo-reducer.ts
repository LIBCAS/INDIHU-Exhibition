import { map, filter, find, concat } from "lodash";
import { Reducer } from "redux";
import * as c from "../actions/constants";

import { ExpositionItem, Screen, Volumes, ViewExpo } from "models";

export type ExpoReducerState = {
  expositions: { items: ExpositionItem[]; count: number };
  activeExpo: Record<string, any>;
  activeScreen: Record<string, any>;
  activeScreenEdited: boolean;
  activeScreenDb: Record<string, any>; // at load page -> activeScreen and activeScreenDb are same, but activeScreen is currently being modified before save, while activeScreenDB is reflecting the screen currently stored in DB
  viewExpo: ViewExpo | null;
  viewProgress: {
    timeElapsed: number;
    totalTime: number;
    rewindToTime: number | null;
    shouldIncrement: boolean;
    shouldRedirect: boolean;
    screenFilesLoading: boolean;
  };
  viewScreen: Screen | null;
  expoEditor: {
    startAuthorsFilter: { sort: string; order: string; search: string };
  };
  expoVolumes: { speechVolume: Volumes; musicVolume: Volumes }; // volumes are numbers in range <0, 100>
  tooltipInfo: {
    tooltipContent: string | null;
    videoDuration: number | null;
    imageUrlsFromSlideshow: string[] | null;
  };
  screensInfo: {
    isPhotogalleryLightboxOpened: boolean;
  };
  isForbiddenEditExpoActionOn: boolean;
};

const initialState: ExpoReducerState = {
  expositions: { items: [], count: 0 },
  activeExpo: {},
  activeScreen: {},
  activeScreenEdited: false,
  activeScreenDb: {},
  viewExpo: null,
  viewProgress: {
    timeElapsed: 0,
    totalTime: 20,
    rewindToTime: null,
    shouldIncrement: false,
    shouldRedirect: false,
    screenFilesLoading: false,
  },
  viewScreen: null,
  expoEditor: {
    startAuthorsFilter: { sort: "TITLE", order: "ASC", search: "" },
  },
  expoVolumes: {
    speechVolume: { previousVolume: 0, actualVolume: 100 },
    musicVolume: { previousVolume: 0, actualVolume: 20 },
  },
  tooltipInfo: {
    tooltipContent: null,
    videoDuration: null,
    imageUrlsFromSlideshow: null,
  },
  screensInfo: {
    isPhotogalleryLightboxOpened: false,
  },
  isForbiddenEditExpoActionOn: false,
};

const reducer: Reducer<ExpoReducerState> = (state = initialState, action) => {
  switch (action.type) {
    case c.EXPOSITIONS:
      return { ...state, ...action.payload };
    case c.EXPO_SET:
      return { ...state, ...action.payload };
    case c.EXPO_UPDATE:
      return {
        ...state,
        activeExpo: { ...state.activeExpo, ...action.payload },
      };
    case c.EXPO_STRUCTURE_SET:
      return {
        ...state,
        activeExpo: {
          ...state.activeExpo,
          structure: {
            ...state.activeExpo.structure,
            ...action.payload,
          },
        },
      };
    case c.EXPO_STRUCTURE_SCREEN_SET:
      return {
        ...state,
        activeExpo: {
          ...state.activeExpo,
          structure: {
            ...state.activeExpo.structure,
            screens: map(state.activeExpo.structure.screens, (row, rowNum) =>
              rowNum === action.payload.rowNum
                ? map(row, (screen, colNum) =>
                    colNum === action.payload.colNum
                      ? action.payload.screen
                      : screen
                  )
                : row
            ),
          },
        },
      };
    case c.EXPO_SCREEN_SET:
      return { ...state, ...action.payload };
    case c.EXPO_SCREEN_UPDATE:
      return {
        ...state,
        activeScreen: action.payload
          ? { ...state.activeScreen, ...action.payload }
          : null,
      };
    case c.EXPO_SCREEN_DB_UPDATE:
      return {
        ...state,
        activeScreenDb: action.payload
          ? { ...state.activeScreenDb, ...action.payload }
          : null,
      };
    case c.EXPO_SCREEN_COLLABORATORS_ADD:
      return {
        ...state,
        activeScreen: {
          ...state.activeScreen,
          collaborators: state.activeScreen.collaborators
            ? [...state.activeScreen.collaborators, action.payload]
            : [action.payload],
        },
      };
    case c.EXPO_SCREEN_COLLABORATORS_CHANGE:
      return {
        ...state,
        activeScreen: {
          ...state.activeScreen,
          collaborators: [
            ...filter(
              state.activeScreen.collaborators,
              (c) =>
                c.role !== action.payload.collaboratorsOld.role ||
                c.text !== action.payload.collaboratorsOld.text
            ),
            action.payload.collaboratorsNew,
          ],
        },
      };
    case c.EXPO_SCREEN_COLLABORATORS_SWAP:
      return {
        ...state,
        activeScreen: {
          ...state.activeScreen,
          collaborators: map(state.activeScreen.collaborators, (c) =>
            c.role === action.payload.collaborators1.role &&
            c.text === action.payload.collaborators1.text
              ? action.payload.collaborators2
              : c.role === action.payload.collaborators2.role &&
                c.text === action.payload.collaborators2.text
              ? action.payload.collaborators1
              : c
          ),
        },
      };
    case c.EXPO_SCREEN_COLLABORATORS_DELETE:
      return {
        ...state,
        activeScreen: {
          ...state.activeScreen,
          collaborators: filter(
            state.activeScreen.collaborators,
            (c) =>
              c.role !== action.payload.role || c.text !== action.payload.text
          ),
        },
      };
    case c.EXPO_SCREEN_DOCUMENT_ADD:
      return {
        ...state,
        activeScreen: {
          ...state.activeScreen,
          documents: state.activeScreen.documents
            ? [...state.activeScreen.documents, action.payload]
            : [action.payload],
        },
      };
    case c.EXPO_SCREEN_DOCUMENT_CHANGE:
      return {
        ...state,
        activeScreen: {
          ...state.activeScreen,
          documents: [
            ...filter(
              state.activeScreen.documents,
              (c) => c.fileName !== action.payload.documentOld.fileName
            ),
            action.payload.documentNew,
          ],
        },
      };
    case c.EXPO_SCREEN_DOCUMENT_SWAP:
      return {
        ...state,
        activeScreen: {
          ...state.activeScreen,
          documents: map(state.activeScreen.documents, (d, i) =>
            i === action.payload.index1
              ? state.activeScreen.documents[action.payload.index2]
              : i === action.payload.index2
              ? state.activeScreen.documents[action.payload.index1]
              : d
          ),
        },
      };
    case c.EXPO_SCREEN_DOCUMENT_DELETE:
      return {
        ...state,
        activeScreen: {
          ...state.activeScreen,
          documents: filter(
            state.activeScreen.documents,
            (c) => c.fileName !== action.payload.fileName
          ),
        },
      };
    case c.EXPO_COLLABORATOR_ADD:
      return {
        ...state,
        activeExpo: {
          ...state.activeExpo,
          collaborators: concat(state.activeExpo.collaborators, action.payload),
        },
      };
    case c.EXPO_COLLABORATOR_DELETE:
      return {
        ...state,
        activeExpo: {
          ...state.activeExpo,
          collaborators: filter(
            state.activeExpo.collaborators,
            (c) => c.id !== action.payload.id
          ),
        },
      };
    case c.EXPO_COLLABORATOR_TYPE:
      return {
        ...state,
        activeExpo: {
          ...state.activeExpo,
          collaborators: map(state.activeExpo.collaborators, (c) =>
            c.id === action.payload.id
              ? { ...c, collaborationType: action.payload.type }
              : c
          ),
        },
      };
    case c.EXPO_RENAME:
      return {
        ...state,
        expositions: {
          ...state.expositions,
          items: [
            ...filter(
              state.expositions.items,
              (e) => e.id !== action.payload.id
            ),
            {
              ...find(state.expositions.items, { id: action.payload.id }),
              title: action.payload.title,
            },
          ],
        },
      };
    case c.EXPO_STATE_CHANGE:
      return {
        ...state,
        expositions: {
          ...state.expositions,
          items: [
            ...filter(
              state.expositions.items,
              (e) => e.id !== action.payload.id
            ),
            {
              ...find(state.expositions.items, { id: action.payload.id }),
              state: action.payload.state,
            },
          ],
        },
        activeExpo: {
          ...state.activeExpo,
          state: action.payload.state,
        },
      };
    case c.EXPO_DELETE:
      return {
        ...state,
        expositions: {
          items: [
            ...filter(
              state.expositions.items,
              (e) => e.id !== action.payload.id
            ),
          ],
          count: filter(
            state.expositions.items,
            (e) => e.id !== action.payload.id
          ).length,
        },
      };
    case c.EXPO_ADD:
      return {
        ...state,
        expositions: {
          items: [...state.expositions.items, action.payload],
          count: [...state.expositions.items, action.payload].length,
        },
      };
    case c.EXPO_VIEWER:
      return {
        ...state,
        ...action.payload,
      };
    case c.EXPO_EDITOR_UPDATE:
      return {
        ...state,
        expoEditor: { ...state.expoEditor, ...action.payload },
      };
    default:
      return state;
    case c.EXPO_VIEW_PROGRESS_UPDATE: {
      return {
        ...state,
        viewProgress: {
          ...state.viewProgress,
          ...action.payload,
        },
      };
    }
    case c.EXPO_TOOLTIP_INFO_UPDATE: {
      return {
        ...state,
        tooltipInfo: {
          ...state.tooltipInfo,
          ...action.payload,
        },
      };
    }
    case c.EXPO_VOLUMES_UPDATE: {
      return {
        ...state,
        expoVolumes: {
          ...state.expoVolumes,
          ...action.payload,
        },
      };
    }
    case c.EXPO_SCREENS_INFO_UPDATE: {
      return {
        ...state,
        screensInfo: {
          ...state.screensInfo,
          ...action.payload,
        },
      };
    }
    case c.EXPO_DESIGN_DATA_UPDATE: {
      return {
        ...state,
        activeExpo: {
          ...state.activeExpo,
          expositionDesignData: action.payload,
        },
      };
    }
    case c.EXPOSITION_ITEM_PIN: {
      return {
        ...state,
        expositions: {
          ...state.expositions,
          items: state.expositions.items.map((expositionItem) =>
            expositionItem.id === action.payload
              ? { ...expositionItem, pinned: true }
              : expositionItem
          ),
        },
      };
    }
    case c.EXPOSITION_ITEM_UNPIN: {
      return {
        ...state,
        expositions: {
          ...state.expositions,
          items: state.expositions.items.map((expositionItem) =>
            expositionItem.id === action.payload
              ? { ...expositionItem, pinned: false }
              : expositionItem
          ),
        },
      };
    }
    case c.EXPOSITION_FORBIDDEN_EDIT_ACTION: {
      return {
        ...state,
        isForbiddenEditExpoActionOn: action.payload,
      };
    }
  }
};

export default reducer;
