import { map, filter, find, concat } from "lodash";
import * as c from "../actions/constants";

const initialState = {
  expositions: { items: [], count: 0 },
  activeExpo: {},
  activeScreen: {},
  activeScreenEdited: false,
  filter: {
    filter: "ALL",
    sort: "updated",
    order: "ASC",
    search: ""
  },
  pager: {
    page: 0,
    pageSize: 10
  },
  cardsList: true,
  viewExpo: null,
  viewScreen: null,
  viewInteractive: false,
  viewInteractiveData: null,
  viewChapterMusic: null,
  viewScreenAudio: null,
  viewLastChapter: null,
  preloadedFiles: [],
  expoEditor: {
    startAuthorsFilter: { sort: "TITLE", order: "ASC", search: "" }
  },
  soundIsTurnedOff: false
};

const reducer = (state = initialState, action) => {
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
        activeExpo: { ...state.activeExpo, ...action.payload }
      };
    case c.EXPO_STRUCTURE_SET:
      return {
        ...state,
        activeExpo: {
          ...state.activeExpo,
          structure: {
            ...state.activeExpo.structure,
            ...action.payload
          }
        }
      };
    case c.EXPO_STRUCTURE_SCREEN_SET:
      return {
        ...state,
        activeExpo: {
          ...state.activeExpo,
          structure: {
            ...state.activeExpo.structure,
            screens: map(
              state.activeExpo.structure.screens,
              (row, rowNum) =>
                rowNum === action.payload.rowNum
                  ? map(
                      row,
                      (screen, colNum) =>
                        colNum === action.payload.colNum
                          ? action.payload.screen
                          : screen
                    )
                  : row
            )
          }
        }
      };
    case c.EXPO_SCREEN_SET:
      return { ...state, ...action.payload };
    case c.EXPO_SCREEN_UPDATE:
      return {
        ...state,
        activeScreen: action.payload
          ? { ...state.activeScreen, ...action.payload }
          : null
      };
    case c.EXPO_SCREEN_COLLABORATORS_ADD:
      return {
        ...state,
        activeScreen: {
          ...state.activeScreen,
          collaborators: state.activeScreen.collaborators
            ? [...state.activeScreen.collaborators, action.payload]
            : [action.payload]
        }
      };
    case c.EXPO_SCREEN_COLLABORATORS_CHANGE:
      return {
        ...state,
        activeScreen: {
          ...state.activeScreen,
          collaborators: [
            ...filter(
              state.activeScreen.collaborators,
              c =>
                c.role !== action.payload.collaboratorsOld.role ||
                c.text !== action.payload.collaboratorsOld.text
            ),
            action.payload.collaboratorsNew
          ]
        }
      };
    case c.EXPO_SCREEN_COLLABORATORS_DELETE:
      return {
        ...state,
        activeScreen: {
          ...state.activeScreen,
          collaborators: filter(
            state.activeScreen.collaborators,
            c =>
              c.role !== action.payload.role || c.text !== action.payload.text
          )
        }
      };
    case c.EXPO_SCREEN_DOCUMENT_ADD:
      return {
        ...state,
        activeScreen: {
          ...state.activeScreen,
          documents: state.activeScreen.documents
            ? [...state.activeScreen.documents, action.payload]
            : [action.payload]
        }
      };
    case c.EXPO_SCREEN_DOCUMENT_CHANGE:
      return {
        ...state,
        activeScreen: {
          ...state.activeScreen,
          documents: [
            ...filter(
              state.activeScreen.documents,
              c => c.fileName !== action.payload.documentOld.fileName
            ),
            action.payload.documentNew
          ]
        }
      };
    case c.EXPO_SCREEN_DOCUMENT_DELETE:
      return {
        ...state,
        activeScreen: {
          ...state.activeScreen,
          documents: filter(
            state.activeScreen.documents,
            c => c.fileName !== action.payload.fileName
          )
        }
      };
    case c.EXPO_COLLABORATOR_ADD:
      return {
        ...state,
        activeExpo: {
          ...state.activeExpo,
          collaborators: concat(state.activeExpo.collaborators, action.payload)
        }
      };
    case c.EXPO_COLLABORATOR_DELETE:
      return {
        ...state,
        activeExpo: {
          ...state.activeExpo,
          collaborators: filter(
            state.activeExpo.collaborators,
            c => c.id !== action.payload.id
          )
        }
      };
    case c.EXPO_COLLABORATOR_TYPE:
      return {
        ...state,
        activeExpo: {
          ...state.activeExpo,
          collaborators: map(
            state.activeExpo.collaborators,
            c =>
              c.id === action.payload.id
                ? { ...c, collaborationType: action.payload.type }
                : c
          )
        }
      };
    case c.EXPO_RENAME:
      return {
        ...state,
        expositions: {
          ...state.expositions,
          items: [
            ...filter(state.expositions.items, e => e.id !== action.payload.id),
            {
              ...find(state.expositions.items, { id: action.payload.id }),
              title: action.payload.title
            }
          ]
        }
      };
    case c.EXPO_STATE_CHANGE:
      return {
        ...state,
        expositions: {
          ...state.expositions,
          items: [
            ...filter(state.expositions.items, e => e.id !== action.payload.id),
            {
              ...find(state.expositions.items, { id: action.payload.id }),
              state: action.payload.state
            }
          ]
        },
        activeExpo: {
          ...state.activeExpo,
          state: action.payload.state
        }
      };
    case c.EXPO_DELETE:
      return {
        ...state,
        expositions: {
          items: [
            ...filter(state.expositions.items, e => e.id !== action.payload.id)
          ],
          count: filter(
            state.expositions.items,
            e => e.id !== action.payload.id
          ).length
        }
      };
    case c.EXPO_ADD:
      return {
        ...state,
        expositions: {
          items: [...state.expositions.items, action.payload],
          count: [...state.expositions.items, action.payload].length
        }
      };
    case c.EXPO_VIEWER:
      return {
        ...state,
        ...action.payload
      };
    case c.EXPO_VIEWER_FILES_TOTAL:
      return {
        ...state,
        ...action.payload,
        viewExpo: {
          ...state.viewExpo,
          filesTotal: state.viewExpo.filesTotal
            ? state.viewExpo.filesTotal + 1
            : 1
        }
      };
    case c.EXPO_VIEWER_FILE_LOADED:
      return {
        ...state,
        ...action.payload,
        viewExpo: {
          ...state.viewExpo,
          filesLoaded: state.viewExpo.filesLoaded
            ? state.viewExpo.filesLoaded + 1
            : 1
        }
      };
    case c.EXPO_EDITOR_UPDATE:
      return {
        ...state,
        expoEditor: { ...state.expoEditor, ...action.payload }
      };
    default:
      return state;
  }
};

export default reducer;
