import React from "react";
import { connect } from "react-redux";

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
          <FileView activeFile={props.activeFile} activeFolder={props.activeFolder} />
        </div>
        <div className="files-wrap--meta">
          <FileMeta activeFile={props.activeFile} />
        </div>
      </div>
    </div>
  </div>;

export default connect(({ file: { folder, file } }) => ({ activeFolder: folder, activeFile: file }), { ...fileActions })(Files);
