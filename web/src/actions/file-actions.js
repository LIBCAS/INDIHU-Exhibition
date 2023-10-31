import fetch from "../utils/fetch";
import {
  map,
  find,
  findIndex,
  filter,
  forEach,
  isEmpty,
  sortBy,
  compact,
  uniq,
} from "lodash";
import { TAB_FOLDER, TAB_FILE, EXPO_STRUCTURE_SET } from "./constants";
import { saveExpo } from "./expoActions";
import { screenTypeText } from "../enums/screen-type";

export const tabFolder = (name) => ({
  type: TAB_FOLDER,
  payload: { folder: name, file: null },
});

export const tabFile = (file) => ({
  type: TAB_FILE,
  payload: { file },
});

export const addFolder = (name) => async (dispatch, getState) => {
  const expo = getState().expo.activeExpo;
  const files = expo.structure.files;

  if (findIndex(files, (f) => f.name === name) > -1) return false;

  files.push({ name, files: [] });
  expo.structure.files = sortBy(files, (f) => f.name);

  if (!(await saveExpo(expo))) {
    return false;
  }

  await dispatch({
    type: EXPO_STRUCTURE_SET,
    payload: {
      files: expo.structure.files,
    },
  });

  return true;
};

// will add the file to the expo.structure
export const addFile = (file, folder) => async (dispatch, getState) => {
  const expo = getState().expo.activeExpo;
  const files = expo.structure.files;
  file.created = new Date().toISOString();
  if (folder === null || folder === undefined) {
    map(files, (f) => (f.name ? f : f.files.push(file)));
  } else {
    map(files, (f) => (f.name && f.name === folder ? f.files.push(file) : f));
  }
  expo.structure.files = files;

  if (!(await saveExpo(expo))) {
    return false;
  }

  dispatch({
    type: EXPO_STRUCTURE_SET,
    payload: {
      files: expo.structure.files,
    },
  });

  return true;
};

export const renameFile =
  (fileId, fileNameNew) => async (dispatch, getState) => {
    const expo = getState().expo.activeExpo;
    const files = expo.structure.files;
    const folderName = getState().file.folder;

    const idx = !fileId
      ? null
      : folderName === null || folderName === undefined
      ? findIndex(files, (f) => !f.name)
      : findIndex(files, (f) => f.name === folderName);
    if (idx === null) {
      return false;
    }

    const filesInFolder = files[idx];
    filesInFolder.files = map(filesInFolder.files, (f) =>
      f.id === fileId ? { ...f, name: fileNameNew } : f
    );
    files[idx] = filesInFolder;
    expo.structure.files = files;

    if (!(await saveExpo(expo))) {
      return false;
    }

    await dispatch({
      type: EXPO_STRUCTURE_SET,
      payload: {
        files: expo.structure.files,
      },
    });

    return true;
  };

export const deleteFileById = (id) => async () => {
  try {
    const response = await fetch(`/api/file/${id}`, {
      method: "DELETE",
    });

    if (response.status !== 200) return false;
    return true;
  } catch (error) {
    return false;
  }
};

export const deleteFile = (fileId) => async (dispatch, getState) => {
  const expo = getState().expo.activeExpo;
  const files = expo.structure.files;
  const folderName = getState().file.folder;

  if (!fileId || !(await dispatch(deleteFileById(fileId)))) {
    return false;
  }

  const idx =
    folderName === null || folderName === undefined
      ? findIndex(files, (f) => !f.name)
      : findIndex(files, (f) => f.name === folderName);

  const filesInFolder = files[idx];
  filesInFolder.files = filter(filesInFolder.files, (f) => f.id !== fileId);
  files[idx] = filesInFolder;
  expo.structure.files = files;

  if (!(await saveExpo(expo))) {
    return false;
  }

  await dispatch({
    type: EXPO_STRUCTURE_SET,
    payload: {
      files: expo.structure.files,
    },
  });

  return true;
};

export const moveFile =
  (file, folder, folderFrom) => async (dispatch, getState) => {
    const expo = getState().expo.activeExpo;
    const files = expo.structure.files;
    const fileId = file.id;

    if (folder === folderFrom) {
      return false;
    }

    const idx = !fileId
      ? null
      : folderFrom === null || folderFrom === undefined
      ? findIndex(files, (f) => !f.name)
      : findIndex(files, (f) => f.name === folderFrom);
    if (idx === null) {
      return false;
    }

    const oldFolder = files[idx];
    oldFolder.files = filter(oldFolder.files, (f) => f.id !== fileId);
    files[idx] = oldFolder;

    const idxNew =
      folder === null
        ? findIndex(files, (f) => !f.name)
        : findIndex(files, (f) => f.name === folder);

    const newFolder = files[idxNew];
    newFolder.files.push(file);
    files[idxNew] = newFolder;

    expo.structure.files = files;

    if (!(await saveExpo(expo))) {
      return false;
    }

    await dispatch({
      type: EXPO_STRUCTURE_SET,
      payload: {
        files: expo.structure.files,
      },
    });

    return true;
  };

export const renameFolder =
  (nameNew, nameOld) => async (dispatch, getState) => {
    const expo = getState().expo.activeExpo;
    const activeFolder = getState().file.folder;

    if (findIndex(expo.structure.files, (f) => f.name === nameNew) > -1) {
      return false;
    }

    expo.structure.files = map(expo.structure.files, (f) =>
      f.name && f.name === nameOld ? { ...f, name: nameNew } : f
    );

    if (!(await saveExpo(expo))) {
      return false;
    }

    await dispatch({
      type: EXPO_STRUCTURE_SET,
      payload: {
        files: expo.structure.files,
      },
    });

    if (activeFolder === nameOld) {
      await dispatch({
        type: TAB_FOLDER,
        payload: { folder: nameNew },
      });
    }

    return true;
  };

export const deleteFolder = (name) => async (dispatch, getState) => {
  const expo = getState().expo.activeExpo;
  const activeFolder = getState().file.folder;

  const folder = find(expo.structure.files, (f) => f.name === name);

  if (folder && folder.files && folder.files.length > 0) {
    forEach(folder.files, (f) => dispatch(deleteFileById(f.id)));
  }

  expo.structure.files = filter(expo.structure.files, (f) => f.name !== name);

  if (!(await saveExpo(expo))) {
    return false;
  }

  await dispatch({
    type: EXPO_STRUCTURE_SET,
    payload: {
      files: expo.structure.files,
    },
  });

  if (activeFolder === name) {
    await dispatch({
      type: TAB_FOLDER,
      payload: { folder: null },
    });
  }
};

/** UTILS */

/**
 * Returns file from file structure by its id
 * @param {*} id string
 * @returns file
 */
export const getFileById = (id) => (_, getState) => {
  if (!id) return null;
  const files = !isEmpty(getState().expo.activeExpo)
    ? getState().expo.activeExpo.structure.files
    : !isEmpty(getState().expo.viewExpo)
    ? getState().expo.viewExpo.structure.files
    : null;
  if (!files) return null;
  const found = find(files, (fold) => find(fold.files, (f) => f.id === id));
  return found ? find(found.files, (f) => f.id === id) : null;
};

/**
 * Checks if file is used in any screen of currently active expo
 * @param {*} id string - file id
 * @returns boolean
 */
export const isFileUsed = (id) => (_, getState) => {
  if (!id) return false;
  const activeExpo = getState().expo.activeExpo;
  if (!activeExpo) return false;
  const structure = activeExpo.structure;
  const start = structure.start;
  if (
    start.image === id ||
    start.audio === id ||
    find(start.documents, (d) => d.id === id)
  )
    return screenTypeText.START;
  const screens = structure.screens;
  let screen;
  find(screens, (chapter) =>
    find(chapter, (s) => {
      const isUsed =
        s.audio === id ||
        s.music === id ||
        s.video === id ||
        s.image === id ||
        s.image1 === id ||
        s.image2 === id ||
        s.image3 === id ||
        s.object === id ||
        find(
          s.images,
          (img) => img === id || (!isEmpty(img) && img.id === id)
        ) ||
        find(s.documents, (d) => d.id === id);

      if (isUsed) {
        screen = s;
      }

      return isUsed;
    })
  );
  if (screen) return screen.title || "Neznámá obrazovka";
  return false;
};

/**
 * Checks if any file in folder is used in any screen of currently active expo
 * @param {*} id string - folder name
 * @returns boolean
 */
export const isFileInFolderUsed = (name) => (dispatch, getState) => {
  if (!name) return false;
  const activeExpo = getState().expo.activeExpo;
  if (!activeExpo) return false;
  const files = activeExpo.structure?.files;
  const folder = find(files, (f) => f.name === name);
  if (!folder) return false;
  return uniq(compact(map(folder.files, (f) => dispatch(isFileUsed(f.id)))));
};

export const postFile = async (file, url = "/api/files/") => {
  try {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (response.status === 200) {
      const file = await response.json();

      return file;
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const postExpoFile = async (expoId, file) => {
  try {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(`/api/file/?id=${expoId}`, {
      method: "POST",
      body: formData,
    });

    if (response.status === 200) {
      const file = await response.json();

      return file;
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
