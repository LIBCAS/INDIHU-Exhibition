import { ActiveExpo } from "models";
import { AppDispatch, AppState } from "store/store";
import { Folder } from "models";

import { isEmpty } from "lodash";

/**
 * Returns file from activeScreen or viewExpo file structure by its id
 * @param {*} id string
 * @returns file or null, if file with given id was not found
 */
export const getFileById =
  (id: string | null | undefined) =>
  (_dispatch: AppDispatch, getState: () => AppState) => {
    if (!id) {
      return null;
    }

    const activeExpo = getState().expo.activeExpo as ActiveExpo; // can be empty object!!
    const viewExpo = getState().expo.viewExpo;

    if (isEmpty(activeExpo) && (isEmpty(viewExpo) || !viewExpo)) {
      return null;
    }

    let files: Folder[] | null = null;
    if (!isEmpty(activeExpo)) {
      files = activeExpo.structure.files;
    } else if (!isEmpty(viewExpo) && viewExpo) {
      files = viewExpo.structure.files;
    } else {
      files = null;
    }

    if (!files) {
      return null;
    }

    const foundFolder = files.find((currFolder) =>
      currFolder.files?.find((currFile) => currFile.id === id)
    );
    if (!foundFolder) {
      return null;
    }

    const foundFile = foundFolder.files?.find((currFile) => currFile.id === id);
    if (!foundFile) {
      return null;
    }

    return foundFile;
  };
