import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

// Models
import { AppState } from "store/store";
import { File, Folder } from "models";

// - - - - - -

export type FileLookupMap = Record<string, File>;

const stateSelector = createSelector(
  ({ expo }: AppState) => expo?.viewExpo?.structure?.files,
  (files) => ({ files })
);

export const useFiles = () => {
  const { files } = useSelector(stateSelector);

  // fileLookupMap = { [file1.id]: File, [file2.id]: File, ... }
  const fileLookupMap = useMemo(
    () =>
      files?.reduce<FileLookupMap>((acc, folder: Folder) => {
        const folderFiles =
          folder.files?.reduce<FileLookupMap>((innerAcc, file: File) => {
            return { ...innerAcc, [file.id]: file };
          }, {}) ?? {};

        return { ...acc, ...folderFiles };
      }, {}) ?? {},
    [files]
  );

  return fileLookupMap;
};
