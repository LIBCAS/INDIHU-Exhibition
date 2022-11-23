import fetch from "../../utils/fetch";
import { get, forEach, isEmpty, isArray, compact, set, map } from "lodash";
import { possibleFiles, fileObjects } from "../../enums/file-type";
import {
  EXPO_VIEWER,
  EXPO_VIEWER_FILE_LOADED,
  EXPO_VIEWER_FILES_TOTAL,
  EXPO_VIEWER_AUDIO_FILE_LOADED,
  EXPO_VIEWER_AUDIO_FILES_TOTAL,
  EXPO_VIEWER_VIDEO_FILE_LOADED,
  EXPO_VIEWER_VIDEO_FILES_TOTAL,
  EXPO_VIEWER_FILE_ERROR_ADD,
  EXPO_VIEWER_FILE_ERROR_TIMEOUT_ADD,
  EXPO_VIEW_PROGRESS_UPDATE,
} from "../constants";
import { getFileById } from "../file-actions";
import { showLoader } from "../app-actions";
import { setDialog, closeDialog } from "../dialog-actions";
import { screenUrl, screenType } from "../../enums/screen-type";
import { animationType } from "../../enums/animation-type";
import { tickTime } from "constants/view-screen-progress";

export const toggleInteractive = (viewInteractive) => ({
  type: EXPO_VIEWER,
  payload: { viewInteractive },
});

export const setViewInteractiveData = (viewInteractiveData) => ({
  type: EXPO_VIEWER,
  payload: { viewInteractiveData },
});

export const loadExposition = (url) => async (dispatch) => {
  try {
    const response = await fetch(`/api/exposition/u/${url}`);
    const body = await response.text();

    if (body) {
      const viewExpo = await JSON.parse(body);

      dispatch({
        type: EXPO_VIEWER,
        payload: {
          viewExpo: { ...viewExpo, structure: JSON.parse(viewExpo.structure) },
        },
      });

      return viewExpo;
    }

    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export const loadScreen = (section, screen) => async (dispatch, getState) => {
  const expo = getState().expo.viewExpo;
  if (!expo || !expo.structure || (screen && !expo.structure.screens))
    return false;

  const viewScreen =
    screen !== undefined
      ? expo.structure.screens[section]
        ? expo.structure.screens[section][screen]
        : null
      : section === screenUrl.FINISH
      ? { ...expo.structure[screenUrl.START], ...expo.structure[section] }
      : expo.structure[section];

  if (viewScreen) {
    await dispatch({
      type: EXPO_VIEWER,
      payload: { viewScreen },
    });

    return viewScreen;
  }

  await dispatch({
    type: EXPO_VIEWER,
    payload: { viewScreen: null },
  });

  return false;
};

export const setChapterMusic = (viewChapterMusic) => ({
  type: EXPO_VIEWER,
  payload: { viewChapterMusic },
});

export const setScreenAudio = (viewScreenAudio) => ({
  type: EXPO_VIEWER,
  payload: { viewScreenAudio },
});

export const setLastChapter = (viewLastChapter) => ({
  type: EXPO_VIEWER,
  payload: { viewLastChapter },
});

export const setViewExpo = (viewExpo) => ({
  type: EXPO_VIEWER,
  payload: { viewExpo },
});

export const setViewScreen = (viewScreen) => ({
  type: EXPO_VIEWER,
  payload: { viewScreen },
});

export const expoViewerFileLoaded = () => ({
  type: EXPO_VIEWER_FILE_LOADED,
  payload: {},
});

export const expoViewerFilesTotalUpdate = () => ({
  type: EXPO_VIEWER_FILES_TOTAL,
  payload: {},
});

export const expoViewerAudioFileLoaded = () => ({
  type: EXPO_VIEWER_AUDIO_FILE_LOADED,
  payload: {},
});

export const expoViewerAudioFilesTotalUpdate = () => ({
  type: EXPO_VIEWER_AUDIO_FILES_TOTAL,
  payload: {},
});

export const expoViewerVideoFileLoaded = () => ({
  type: EXPO_VIEWER_VIDEO_FILE_LOADED,
  payload: {},
});

export const expoViewerVideoFilesTotalUpdate = () => ({
  type: EXPO_VIEWER_VIDEO_FILES_TOTAL,
  payload: {},
});

export const addNameToErrorFiles = (name) => ({
  type: EXPO_VIEWER_FILE_ERROR_ADD,
  payload: { name },
});

export const addNameToErrorTimeoutFiles = (name) => ({
  type: EXPO_VIEWER_FILE_ERROR_TIMEOUT_ADD,
  payload: { name },
});

/**
 * Displays dialog with list of files where an error occurred while loading
 */
const openFilesErrorDialog = () => (dispatch, getState) => {
  const errorFiles = getState().expo.errorFiles;
  const errorTimeoutFiles = getState().expo.errorTimeoutFiles;
  dispatch(closeDialog());
  dispatch(
    setDialog("Info", {
      title: "Chyba",
      content: (
        <div>
          {!isEmpty(errorFiles) ? (
            <div>
              <div style={{ marginBottom: "1em" }}>
                Došlo k chybě při načítání souborů:
              </div>
              {map(errorFiles, (file, key) => (
                <div key={key}>
                  {Number(key) + 1}. <strong>{file}</strong>
                </div>
              ))}
              <div style={{ marginTop: "1em" }}>
                Seznam podporovaných formátů je k dispozici v manuálu.
              </div>
            </div>
          ) : (
            <div />
          )}
          {!isEmpty(errorTimeoutFiles) ? (
            <div style={{ marginTop: !isEmpty(errorFiles) ? "2em" : 0 }}>
              <div style={{ marginBottom: "1em" }}>
                Došlo k vypršení časového limitu pro načtení souborů:
              </div>
              {map(errorTimeoutFiles, (file, key) => (
                <div key={key}>
                  {Number(key) + 1}. <strong>{file}</strong>
                </div>
              ))}
              <div style={{ marginTop: "1em" }}>
                Je možné, že tyto soubory ve výstavě nebudou fungovat správně.
                Důvodem je možná chybějící podpora pro formáty těchto souborů ve
                Vašem zařízení nebo nedostatečná rychlost internetového
                připojení.
              </div>
            </div>
          ) : (
            <div />
          )}
        </div>
      ),
    })
  );
};

/**
 * Maximum time to wait for audio/video to load
 */
const AUDIO_VIDEO_TIMEOUT_SHORT = 3 * 60 * 1000;
const AUDIO_VIDEO_TIMEOUT = 15 * 60 * 1000;

/**
 * Create object with file instance
 */
const returnMeObject = (
  data,
  fileType,
  attribute,
  screen,
  dispatch,
  getState
) => {
  if (data) {
    const obj = {};
    if (fileObjects[fileType] === fileObjects.audio) {
      const audio = new Audio();
      audio.src = `/api/files/${data.fileId}`;

      if (dispatch) {
        let checkLoadId;
        const currentTime = new Date().getTime();
        const checkLoad = () => {
          if (audio.readyState === 4) {
            checkLoadId = null;
            dispatch(expoViewerFileLoaded());
            dispatch(expoViewerAudioFileLoaded());
            return;
          }

          const viewExpo = getState().expo.viewExpo;

          if (
            new Date().getTime() > currentTime + AUDIO_VIDEO_TIMEOUT_SHORT &&
            viewExpo &&
            ((!viewExpo.audioFilesLoaded &&
              viewExpo.filesTotal - viewExpo.filesLoaded <=
                viewExpo.audioFilesTotal) ||
              viewExpo.filesTotal - viewExpo.filesLoaded <=
                viewExpo.audioFilesTotal - viewExpo.audioFilesLoaded) &&
            (!data.type || !data.type.match(/^audio\/mpeg$/))
          ) {
            checkLoadId = null;
            dispatch(expoViewerFileLoaded());
            dispatch(expoViewerAudioFileLoaded());
            dispatch(addNameToErrorFiles(data.name));
            dispatch(openFilesErrorDialog());
          } else if (new Date().getTime() > currentTime + AUDIO_VIDEO_TIMEOUT) {
            dispatch(expoViewerFileLoaded());
            dispatch(expoViewerAudioFileLoaded());
            dispatch(addNameToErrorTimeoutFiles(data.name));
            dispatch(openFilesErrorDialog());
          } else {
            checkLoadId = setTimeout(checkLoad, 500);
          }
        };

        checkLoadId = setTimeout(checkLoad, 500);
        audio.addEventListener("error", () => {
          clearTimeout(checkLoadId);
          dispatch(expoViewerFileLoaded());
          dispatch(expoViewerAudioFileLoaded());
          dispatch(addNameToErrorFiles(data.name));
          dispatch(openFilesErrorDialog());
        });
        dispatch(expoViewerFilesTotalUpdate());
        dispatch(expoViewerAudioFilesTotalUpdate());
      }

      obj[attribute] = audio;
    } else if (fileObjects[fileType] === fileObjects.image) {
      const image = new Image();
      image.src = `/api/files/${data.fileId}`;
      image.alt = "";

      if (dispatch) {
        image.onload = () => {
          dispatch(expoViewerFileLoaded());
        };
        image.onerror = () => {
          dispatch(expoViewerFileLoaded());
          dispatch(addNameToErrorFiles(data.name));
          dispatch(openFilesErrorDialog());
        };
        dispatch(expoViewerFilesTotalUpdate());
      }

      obj[attribute] = image;

      if (
        (get(screen, "animationType") ===
          animationType.WITHOUT_AND_BLUR_BACKGROUND ||
          get(screen, "animationType") ===
            animationType.FADE_IN_OUT_AND_BLUR_BACKGROUND ||
          get(screen, "animationType") ===
            animationType.FLY_IN_OUT_AND_BLUR_BACKGROUND) &&
        (get(screen, "type") === screenType.IMAGE ||
          get(screen, "type") === screenType.PHOTOGALERY ||
          get(screen, "type") === screenType.INTRO ||
          get(screen, "type") === screenType.START)
      ) {
        const image = new Image();
        image.src = `/api/files/${data.fileId}`;
        image.alt = "";

        if (dispatch) {
          image.onload = () => {
            dispatch(expoViewerFileLoaded());
          };
          image.onerror = () => {
            dispatch(expoViewerFileLoaded());
            dispatch(addNameToErrorFiles(data.name));
            dispatch(openFilesErrorDialog());
          };
          dispatch(expoViewerFilesTotalUpdate());
        }

        obj[`${attribute}-reserved`] = image;
      }
    } else if (fileObjects[fileType] === fileObjects.video) {
      const video = document.createElement("video");

      const source = document.createElement("source");
      source.src = `/api/files/${data.fileId}`;
      source.type = data.type;

      video.appendChild(source);

      if (dispatch) {
        let checkLoadId;
        const currentTime = new Date().getTime();
        const checkLoad = () => {
          if (video.readyState === 4) {
            checkLoadId = null;
            dispatch(expoViewerFileLoaded());
            dispatch(expoViewerVideoFileLoaded());
            return;
          }

          const viewExpo = getState().expo.viewExpo;

          if (
            new Date().getTime() > currentTime + AUDIO_VIDEO_TIMEOUT_SHORT &&
            viewExpo &&
            ((!viewExpo.videoFilesLoaded &&
              viewExpo.filesTotal - viewExpo.filesLoaded <=
                viewExpo.videoFilesTotal) ||
              viewExpo.filesTotal - viewExpo.filesLoaded <=
                viewExpo.videoFilesTotal - viewExpo.videoFilesLoaded) &&
            (!data.type || !data.type.match(/^video\/mp4$/))
          ) {
            checkLoadId = null;
            dispatch(expoViewerFileLoaded());
            dispatch(expoViewerVideoFileLoaded());
            dispatch(addNameToErrorFiles(data.name));
            dispatch(openFilesErrorDialog());
          } else if (new Date().getTime() > currentTime + AUDIO_VIDEO_TIMEOUT) {
            dispatch(expoViewerFileLoaded());
            dispatch(expoViewerVideoFileLoaded());
            dispatch(addNameToErrorTimeoutFiles(data.name));
            dispatch(openFilesErrorDialog());
          } else {
            checkLoadId = setTimeout(checkLoad, 500);
          }
        };

        checkLoadId = setTimeout(checkLoad, 500);
        video.addEventListener("error", () => {
          clearTimeout(checkLoadId);
          dispatch(expoViewerFileLoaded());
          dispatch(expoViewerVideoFileLoaded());
          dispatch(addNameToErrorFiles(data.name));
          dispatch(openFilesErrorDialog());
        });
        dispatch(expoViewerFilesTotalUpdate());
        dispatch(expoViewerVideoFilesTotalUpdate());
      }

      obj[attribute] = video;
    }
    return !isEmpty(obj) ? obj : null;
  }
  return null;
};

/**
 * Create structure of file instances to be preloaded
 */
export const filePreloader = () => async (dispatch, getState) => {
  dispatch(showLoader(true));
  const expo = getState().expo.viewExpo;
  const structure = get(expo, "structure");
  const struct = get(structure, "screens");

  if (struct) {
    const preloadedFiles = {};

    set(preloadedFiles, screenUrl.START, {});
    set(preloadedFiles, screenUrl.FINISH, {});

    if (get(structure, screenUrl.START)) {
      if (get(structure, `${screenUrl.START}.image`)) {
        set(preloadedFiles, screenUrl.START, {
          ...preloadedFiles[screenUrl.START],
          ...returnMeObject(
            dispatch(getFileById(get(structure, `${screenUrl.START}.image`))),
            "image",
            "image",
            get(structure, `${screenUrl.START}`),
            dispatch,
            getState
          ),
        });

        set(preloadedFiles, screenUrl.FINISH, {
          ...preloadedFiles[screenUrl.FINISH],
          ...returnMeObject(
            dispatch(getFileById(get(structure, `${screenUrl.START}.image`))),
            "image",
            "image",
            get(structure, `${screenUrl.FINISH}`),
            dispatch,
            getState
          ),
        });
      }
    }

    forEach(struct, (chapter, rowN) => {
      set(preloadedFiles, rowN, []);
      forEach(chapter, (screen, colN) => {
        preloadedFiles[rowN].push({});
        forEach(possibleFiles, (fileType) => {
          const adept = get(screen, fileType);
          if (isArray(adept)) {
            forEach(compact(adept), (a, i) => {
              const file = a.id ? a.id : a;
              preloadedFiles[rowN][colN] = {
                ...preloadedFiles[rowN][colN],
                ...returnMeObject(
                  dispatch(getFileById(file)),
                  fileType,
                  `${fileType}[${i}]`,
                  screen,
                  dispatch,
                  getState
                ),
              };
            });
          } else if (adept) {
            preloadedFiles[rowN][colN] = {
              ...preloadedFiles[rowN][colN],
              ...returnMeObject(
                dispatch(getFileById(adept)),
                fileType,
                fileType,
                screen,
                dispatch,
                getState
              ),
            };
          }
        });
      });
    });

    dispatch({
      type: EXPO_VIEWER,
      payload: {
        preloadedFiles,
      },
    });
  }
  dispatch(showLoader(false));
};

/**
 * Create object of file instances of one choosen screen
 */
export const screenFilePreloader =
  (activeScreen, section, screen) => async (dispatch, getState) => {
    dispatch(showLoader(true));
    const expo = getState().expo.activeExpo;
    const structure = get(expo, "structure");

    let preloadedFiles =
      screen > 0
        ? {
            ...returnMeObject(
              dispatch(getFileById(structure.screens[section][0].music)),
              "music",
              "music",
              activeScreen,
              dispatch,
              getState
            ),
          }
        : {};

    forEach(possibleFiles, (fileType) => {
      const adept = get(activeScreen, fileType);
      if (isArray(adept)) {
        forEach(compact(adept), (a, i) => {
          const file = a.id ? a.id : a;
          preloadedFiles = {
            ...preloadedFiles,
            ...returnMeObject(
              dispatch(getFileById(file)),
              fileType,
              `${fileType}[${i}]`,
              activeScreen,
              dispatch,
              getState
            ),
          };
        });
      } else if (adept) {
        preloadedFiles = {
          ...preloadedFiles,
          ...returnMeObject(
            dispatch(getFileById(adept)),
            fileType,
            fileType,
            activeScreen,
            dispatch,
            getState
          ),
        };
      }
    });

    dispatch({
      type: EXPO_VIEWER,
      payload: {
        preloadedFiles,
      },
    });
    dispatch(showLoader(false));

    return preloadedFiles;
  };

/**
 * Turn on/off music and audio of expo screen
 *
 * @param {*} soundIsTurnedOff boolean
 */
export const turnSoundOff = (soundIsTurnedOff) => (dispatch, getState) => {
  const viewChapterMusic = getState().expo.viewChapterMusic;
  const viewScreenAudio = getState().expo.viewScreenAudio;
  const viewScreen = getState().expo.viewScreen;

  if (viewChapterMusic) {
    viewChapterMusic.volume =
      viewScreen.muteChapterMusic || soundIsTurnedOff ? 0 : 0.2;
  }

  if (viewScreenAudio) {
    viewScreenAudio.volume = soundIsTurnedOff ? 0 : 1;
  }

  const videoElement = document.getElementById("view-video-video");

  if (videoElement) {
    videoElement.muted = soundIsTurnedOff;
  }

  dispatch({
    type: EXPO_VIEWER,
    payload: { soundIsTurnedOff },
  });
};

/**
 * Needed actions before redirect to start of expo viewer
 */
export const prepareReturnToViewStart = () => (dispatch, getState) => {
  const viewChapterMusic = getState().expo.viewChapterMusic;
  const viewScreenAudio = getState().expo.viewScreenAudio;

  if (viewChapterMusic) {
    viewChapterMusic.pause();
    viewChapterMusic.currentTime = 0;
    dispatch(setChapterMusic(null));
  }

  if (viewScreenAudio) {
    viewScreenAudio.pause();
    viewScreenAudio.currentTime = 0;
    dispatch(setScreenAudio(null));
  }

  dispatch(setLastChapter(null));
};

/**
 * Sets new values for the viewProgress
 */
export const setViewProgress = (values) => (dispatch) => {
  dispatch({
    type: EXPO_VIEW_PROGRESS_UPDATE,
    payload: values,
  });
};

/**
 * Sets new values for the viewProgress
 */
export const tickProgress = () => (dispatch, getState) => {
  const viewProgress = getState().expo.viewProgress;

  if (!viewProgress.shouldIncrement || viewProgress.screenFilesLoading) {
    return;
  }

  const newValues = {
    ...viewProgress,
    timeElapsed: viewProgress.timeElapsed + tickTime,
  };

  dispatch({
    type: EXPO_VIEW_PROGRESS_UPDATE,
    payload: newValues,
  });
};
