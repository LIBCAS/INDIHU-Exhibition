import React from "react";
import { connect } from "react-redux";
import {
  compose,
  lifecycle,
  withState,
  withHandlers,
  withProps
} from "recompose";
import { get, filter, isEmpty } from "lodash";

import Header from "./Header";
import FileManager from "./FileManager";
import FileView from "./FileView";
import FileMeta from "./FileMeta";
import * as fileActions from "../../../actions/fileActions";
import { setDialog } from "../../../actions/dialogActions";
import { keyShortcutsEnhancer, sortFilterFiles } from "./utils";

const Files = ({ setSort, setOrder, containerID, ...props }) => (
  <div className="container container-tabMenu">
    <Header
      sort={props.sort}
      setSort={setSort}
      order={props.order}
      setOrder={setOrder}
    />
    <div className="files-row">
      <div className="files-wrap--manager">
        <FileManager {...props} id={containerID} enableImageEditor={true} />
      </div>
      <div className="files-col">
        <div className="files-wrap--view">
          <FileView
            activeFile={props.activeFile}
            activeFolder={props.activeFolder}
          />
        </div>
        <div className="files-wrap--meta">
          <FileMeta activeFile={props.activeFile} />
        </div>
      </div>
    </div>
  </div>
);

export default compose(
  connect(
    ({ file: { folder, file } }) => ({
      activeFolder: folder,
      activeFile: file
    }),
    { ...fileActions, setDialog }
  ),
  withState("activeExpoReceived", "setActiveExpoReceived", false),
  withState("sort", "setSort", "CREATED"),
  withState("order", "setOrder", "ASC"),
  withProps(({ activeExpo, sort, order }) => ({
    containerID: "expo-files-manager",
    files: sortFilterFiles(activeExpo, sort, order)
  })),
  withHandlers({
    init: ({ activeExpoReceived, setActiveExpoReceived, tabFile }) => files => {
      if (!activeExpoReceived) {
        tabFile(null);

        if (!isEmpty(files)) {
          setActiveExpoReceived(true);
          tabFile(
            get(
              get(
                filter(files, files => files.name === undefined),
                "[0].files"
              ),
              "[0]",
              null
            )
          );
        }
      }
    }
  }),
  keyShortcutsEnhancer,
  lifecycle({
    componentWillMount() {
      const { init, files } = this.props;
      init(files);
    },
    componentWillReceiveProps({ files }) {
      const { init } = this.props;
      init(files);
    }
  })
)(Files);
