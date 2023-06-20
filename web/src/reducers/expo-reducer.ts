import { map, filter, find, concat } from "lodash";
import { Reducer } from "redux";

import {
  Exposition,
  FinishScreen,
  Folder,
  Screen,
  StartScreen,
  Volumes,
} from "models";

import * as c from "../actions/constants";

export type ViewExpo = {
  state: string;
  author: {
    id: string;
    firstName: string;
    surname: string;
    username: string;
    institution: string;
    email: string;
  };
  title: string;
  url: string;
  structure: {
    start: StartScreen;
    finish: FinishScreen;
    screens: Screen[][];
    files: Folder[];
  };
  filesTotal: number;
  audioFilesTotal: number;
  videoFilesTotal: number;
  filesLoaded: number;
  audioFilesLoaded: number;
  videoFilesLoaded: number;
};

export type ExpoReducerState = {
  expositions: { items: Exposition[]; count: number };
  activeExpo: Record<string, any>;
  activeScreen: Record<string, any>;
  activeScreenEdited: boolean;
  filter: {
    filter?: string;
    sort?: string;
    order?: string;
    search?: string;
  };
  pager: {
    page: number;
    pageSize: number;
  };
  cardsList: boolean;
  viewExpo: ViewExpo | null;
  viewProgress: {
    timeElapsed: number;
    totalTime: number;
    rewindToTime: number | null;
    shouldIncrement: boolean;
    shouldRedirect: boolean;
    showProgressBar: boolean;
    screenFilesLoading: boolean;
  };
  viewScreen: Screen | null;
  viewInteractive: boolean;
  viewInteractiveData: any;
  viewChapterMusic: any;
  viewScreenAudio: any;
  preloadedFiles: any;
  errorFiles: any[];
  errorTimeoutFiles: any[];
  expoEditor: {
    startAuthorsFilter: { sort: string; order: string; search: string };
  };
  soundIsTurnedOff: boolean;
  expoVolumes: { speechVolume: Volumes; musicVolume: Volumes }; // volumes are numbers in range <0, 100>
  tooltipInfo: {
    tooltipContent: string | null;
    videoDuration: number | null;
    imageUrlsFromPhotogallery: string[] | null;
  };
};

const initialState = {
  expositions: { items: [], count: 0 },
  activeExpo: {},
  activeScreen: {},
  activeScreenEdited: false,
  filter: {
    filter: "ALL",
    sort: "updated",
    order: "ASC",
    search: "",
  },
  pager: {
    page: 0,
    pageSize: 10,
  },
  cardsList: true,
  viewExpo: null,
  viewProgress: {
    timeElapsed: 0,
    totalTime: 20,
    rewindToTime: null,
    shouldIncrement: false,
    shouldRedirect: false,
    showProgressBar: false,
    screenFilesLoading: false,
  },
  viewScreen: null,
  viewInteractive: false,
  viewInteractiveData: null,
  viewChapterMusic: null,
  viewScreenAudio: null,
  preloadedFiles: [],
  errorFiles: [],
  errorTimeoutFiles: [],
  expoEditor: {
    startAuthorsFilter: { sort: "TITLE", order: "ASC", search: "" },
  },
  soundIsTurnedOff: false,
  expoVolumes: {
    speechVolume: { previousVolume: 0, actualVolume: 100 },
    musicVolume: { previousVolume: 0, actualVolume: 20 },
  },
  tooltipInfo: {
    tooltipContent: null,
    videoDuration: null,
    imageUrlsFromPhotogallery: null,
  },
};

const reducer: Reducer<ExpoReducerState> = (state = initialState, action) => {
  switch (action.type) {
    case c.EXPOSITIONS:
      return { ...state, ...action.payload };
    case c.EXPOSITIONS_FILTER:
      return { ...state, filter: { ...action.payload } };
    case c.EXPOSITIONS_PAGER:
      return { ...state, pager: { ...action.payload } };
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
    case c.EXPO_VIEWER_FILES_TOTAL:
      return {
        ...state,
        viewExpo: {
          ...state.viewExpo,
          filesTotal: state.viewExpo?.filesTotal
            ? state.viewExpo.filesTotal + 1
            : 1,
        },
      };
    case c.EXPO_VIEWER_FILE_LOADED:
      return {
        ...state,
        viewExpo: {
          ...state.viewExpo,
          filesLoaded: state.viewExpo?.filesLoaded
            ? state.viewExpo.filesLoaded + 1
            : 1,
        },
      };
    case c.EXPO_VIEWER_AUDIO_FILES_TOTAL:
      return {
        ...state,
        viewExpo: {
          ...state.viewExpo,
          audioFilesTotal: state.viewExpo?.audioFilesTotal
            ? state.viewExpo.audioFilesTotal + 1
            : 1,
        },
      };
    case c.EXPO_VIEWER_AUDIO_FILE_LOADED:
      return {
        ...state,
        viewExpo: {
          ...state.viewExpo,
          audioFilesLoaded: state.viewExpo?.audioFilesLoaded
            ? state.viewExpo.audioFilesLoaded + 1
            : 1,
        },
      };
    case c.EXPO_VIEWER_VIDEO_FILES_TOTAL:
      return {
        ...state,
        viewExpo: {
          ...state.viewExpo,
          videoFilesTotal: state.viewExpo?.videoFilesTotal
            ? state.viewExpo.videoFilesTotal + 1
            : 1,
        },
      };
    case c.EXPO_VIEWER_VIDEO_FILE_LOADED:
      return {
        ...state,
        viewExpo: {
          ...state.viewExpo,
          videoFilesLoaded: state.viewExpo?.videoFilesLoaded
            ? state.viewExpo.videoFilesLoaded + 1
            : 1,
        },
      };
    case c.EXPO_VIEWER_FILE_ERROR_ADD:
      return {
        ...state,
        errorFiles: [...state.errorFiles, action.payload.name],
      };
    case c.EXPO_VIEWER_FILE_ERROR_TIMEOUT_ADD:
      return {
        ...state,
        errorTimeoutFiles: [...state.errorTimeoutFiles, action.payload.name],
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
  }
};

export default reducer;
