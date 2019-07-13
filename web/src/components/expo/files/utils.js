import { compose, withHandlers, defaultProps } from "recompose";
import { get, map, filter, sortBy, find, findIndex, reverse } from "lodash";

import { withKeyShortcuts } from "../../hoc";

export const sortFilterFiles = (activeExpo, sort, order, typeMatch) =>
  map(get(activeExpo, "structure.files"), folder => {
    let files = get(folder, "files", []);

    files = typeMatch
      ? filter(files, ({ type }) => typeMatch.test(type))
      : files;

    if (sort === "NAME") {
      files = sortBy(files, ({ name }) => (name ? name.toLowerCase() : name));
    } else {
      files = sortBy(files, ({ created }) =>
        created ? new Date(created) : new Date("1970-01-01T01:01:01.000Z")
      );
    }

    if (order === "ASC") {
      files = reverse(files);
    }

    return { ...folder, files };
  });

export const keyShortcutsEnhancer = compose(
  defaultProps({ shortcutsEnabled: true }),
  withHandlers({
    onUpOrDown: ({
      files,
      activeFolder: activeFolderName,
      activeFile,
      tabFile,
      containerID,
      shortcutsEnabled
    }) => (up = true) => {
      if (activeFile && shortcutsEnabled) {
        const activeFolder = find(
          files,
          ({ name }) =>
            name === activeFolderName || (!name && !activeFolderName)
        );

        const activeFileIndex = findIndex(
          get(activeFolder, "files"),
          ({ id }) => id === activeFile.id
        );

        const newFile = get(
          activeFolder,
          `files[${up ? activeFileIndex - 1 : activeFileIndex + 1}]`
        );

        if (
          newFile &&
          ((up && activeFileIndex > 0) ||
            (!up && activeFileIndex < get(activeFolder, "files.length")))
        ) {
          tabFile(newFile);

          const container = document.getElementById(containerID);

          if (container) {
            container.scrollTop = up
              ? container.scrollTop - 37 > 0
                ? container.scrollTop - 37
                : 0
              : container.scrollTop + 38;
          }
        }
      }
    }
  }),
  withHandlers({
    onUp: ({ onUpOrDown }) => () => onUpOrDown(),
    onDown: ({ onUpOrDown }) => () => onUpOrDown(false),
    onDelete: ({ setDialog, activeFile, shortcutsEnabled }) => () => {
      if (activeFile && shortcutsEnabled) {
        setDialog("FileDelete", {
          id: activeFile.id,
          name: activeFile.name
        });
      }
    }
  }),
  withKeyShortcuts
);
