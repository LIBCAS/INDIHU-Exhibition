import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle, withState, withHandlers } from "recompose";
import { get, filter, isEmpty } from "lodash";

import Header from "./Header";
import FileManager from "./FileManager";
import FileView from "./FileView";
import FileMeta from "./FileMeta";
import * as fileActions from "../../../actions/fileActions";

const Files = props =>
  <div className="container container-tabMenu">
    <Header />
    <div className="files-row">
      <div className="files-wrap--manager">
        <FileManager {...props} />
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
  </div>;

export default compose(
  connect(
    ({ file: { folder, file } }) => ({
      activeFolder: folder,
      activeFile: file
    }),
    { ...fileActions }
  ),
  withState("activeExpoReceived", "setActiveExpoReceived", false),
  withHandlers({
    init: ({
      activeExpoReceived,
      setActiveExpoReceived,
      tabFile
    }) => activeExpo => {
      if (!activeExpoReceived) {
        tabFile(null);

        if (!isEmpty(activeExpo)) {
          setActiveExpoReceived(true);
          tabFile(
            get(
              get(
                filter(
                  get(activeExpo, "structure.files"),
                  files => files.name === undefined
                ),
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
  lifecycle({
    componentWillMount() {
      const { init, activeExpo } = this.props;
      init(activeExpo);
    },
    componentWillReceiveProps({ activeExpo }) {
      const { init } = this.props;
      init(activeExpo);
    }
  })
)(Files);
