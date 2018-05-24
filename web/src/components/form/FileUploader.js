import React from "react";
import { Uploader, UploadField } from "@navjobs/upload";
import * as storage from "../../utils/storage";

// 125 Mb

const FileUploader = ({ url, accept, children, request, onComplete, ...rest }) =>
  <Uploader
    request={{
      fileName: "file",
      url,
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${storage.get("token")}`
      },
      ...request
    }}
    onComplete={onComplete}
    uploadOnSelection
    {...rest}
  >
    {({ onFiles, progress, complete, error }) =>
      <div className="fileUploader">
        <UploadField onFiles={onFiles} uploadProps={{ accept }}>
          {children}
        </UploadField>
        {progress &&
          !complete &&
          !error &&
          <progress className="progress" max="100" value={complete ? 100 : progress - 10} />}
        {error && <span className="invalid">Nahrávání selhalo</span>}
      </div>}
  </Uploader>;

export default FileUploader;
