// App part of redux store
export const APP = "APP";
export const RADIO_STATE_CHANGE = "RADIO_STATE_CHANGE";
export const SWITCH_STATE_CHANGE = "SWITCH_STATE_CHANGE";
export const MOUSE_ACTUALIZE = "MOUSE_ACTUALIZE";
export const ZOOM_ACTUALIZE = "ZOOM_ACTUALIZE";
export const ZOOM_ACTUALIZE_2 = "ZOOM_ACTUALIZE_2";
export const ZOOM_ACTUALIZE_3 = "ZOOM_ACTUALIZE_3";
export const IMAGE_EDITOR = "IMAGE_EDITOR";

// Dialog part of redux store
export const DIALOG_SET = "DIALOG_SET";
export const DIALOG_CLOSE = "DIALOG_CLOSE";
export const DIALOG_DATA_ADD = "DIALOG_DATA_ADD";

// Admin part of redux store
export const ADMIN = "ADMIN";

// User part of the redux store
export const USER = "USER";
export const USERS = "USERS";
export const USER_INFO = "USER_INFO";
export const USER_DELETE = "USER_DELETE";
export const USER_REACTIVATE = "USER_REACTIVATE";
export const USER_SET = "USER_SET";

// File part of the redux store
export const TAB_FOLDER = "TAB_FOLDER";
export const TAB_FILE = "TAB_FILE";

// Expo part of the redux store
export const EXPOSITIONS = "EXPOSITIONS"; // setActiveScreenEdited from screen-actions.js, getExpositions from expo-actions.js
export const EXPOSITIONS_FILTER = "EXPOSITIONS_FILTER"; // setExpoFilter from expo-actions.js
export const EXPOSITIONS_PAGER = "EXPOSITIONS_PAGER"; // setExpoPager from expo-actions.js

export const EXPO_SET = "EXPO_SET"; // loadExpo (store.expo.activeExpo), updateExpo, changeExpositionsViewType (store.expo.cardsList) from expo-actions.js
export const EXPO_UPDATE = "EXPO_UPDATE";
export const EXPO_STRUCTURE_SET = "EXPO_STRUCTURE_SET"; // addFolder, addFile, renameFile, deleteFileById, moveFile, renameFolder, deleteFolder from file-actions.js
// ^ another actions from expo-structure.js and screen-actions.js ^
export const EXPO_STRUCTURE_SCREEN_SET = "EXPO_STRUCTURE_SCREEN_SET"; // saveScreen from screen-actions.js
export const EXPO_SCREEN_SET = "EXPO_SCREEN_SET";
export const EXPO_SCREEN_UPDATE = "EXPO_SCREEN_UPDATE";

export const EXPO_SCREEN_COLLABORATORS_ADD = "EXPO_SCREEN_COLLABORATORS_ADD";
export const EXPO_SCREEN_COLLABORATORS_CHANGE =
  "EXPO_SCREEN_COLLABORATORS_CHANGE";
export const EXPO_SCREEN_COLLABORATORS_SWAP = "EXPO_SCREEN_COLLABORATORS_SWAP";
export const EXPO_SCREEN_COLLABORATORS_DELETE =
  "EXPO_SCREEN_COLLABORATORS_REMOVE";

export const EXPO_SCREEN_DOCUMENT_ADD = "EXPO_SCREEN_DOCUMENT_ADD";
export const EXPO_SCREEN_DOCUMENT_CHANGE = "EXPO_SCREEN_DOCUMENT_CHANGE";
export const EXPO_SCREEN_DOCUMENT_SWAP = "EXPO_SCREEN_DOCUMENT_SWAP";
export const EXPO_SCREEN_DOCUMENT_DELETE = "EXPO_SCREEN_DOCUMENT_DELETE";

export const EXPO_COLLABORATOR_ADD = "EXPO_COLLABORATOR_ADD";
export const EXPO_COLLABORATOR_DELETE = "EXPO_COLLABORATOR_DELETE";
export const EXPO_COLLABORATOR_TYPE = "EXPO_COLLABORATOR_TYPE";

export const EXPO_RENAME = "EXPO_RENAME"; // renameExpo from expo-settings-actions.js
export const EXPO_STATE_CHANGE = "EXPO_STATE_CHANGE"; // changeStateExpo from expo-settings-actions.js
export const EXPO_DELETE = "EXPO_DELETE"; // deleteExpo from expo-settings-actions.js
export const EXPO_ADD = "EXPO_ADD"; // duplicateExpo from expo-settings-actions.js

export const EXPO_VIEWER = "EXPO_VIEWER";

export const EXPO_EDITOR_UPDATE = "EXPO_EDITOR_UPDATE"; // (store.expo.expoEditor) updateStartAuthorsFilter from screen-actions.js

export const EXPO_VIEW_PROGRESS_UPDATE = "EXPO_VIEW_PROGRESS_UPDATE"; // (store.expo.viewProgress) setViewProgress, tickProgress from viewer-actions.js

export const EXPO_TOOLTIP_INFO_UPDATE = "EXPO_TOOLTIP_INFO_UPDATE";

export const EXPO_VOLUMES_UPDATE = "EXPO_VOLUMES_SPEECH_UPDATE";

export const EXPO_SCREENS_INFO_UPDATE = "EXPO_SCREENS_INFO_UPDATE";
