import { File } from "models";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { AppState } from "store/store";

export type FileLookupMap = Record<string, File>;

const stateSelector = createSelector(
  ({ expo }: AppState) => expo?.viewExpo?.structure?.files,
  (files) => ({ files })
);

export const useFiles = () => {
  const { files } = useSelector(stateSelector);

  const fileLookupMap = useMemo(
    () =>
      files?.reduce<FileLookupMap>((acc, folder) => {
        const folderFiles =
          folder.files?.reduce<FileLookupMap>((acc, file) => {
            return { ...acc, [file.id]: file };
          }, {}) ?? {};

        return { ...acc, ...folderFiles };
      }, {}) ?? {},
    [files]
  );

  return fileLookupMap;
};
