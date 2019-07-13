import React from "react";
import { compose, withState, withHandlers, defaultProps } from "recompose";
import { every, isEmpty, map, noop, sumBy, find } from "lodash";
import { CircularProgress } from "react-md";
import { Uploader, UploadField } from "@navjobs/upload";
import { postFile } from "../../actions/fileActions";
import { asyncForEach } from "../../utils";

const MAX_FILE_SIZE = 26214400; // 25MB
const MAX_FILES_SIZE = 131072000; // 125MB

const FileUploader = ({
  accept,
  children,
  fileError,
  handleFiles,
  progress,
  isLoading,
  ...rest
}) => (
  <Uploader uploadOnSelection {...rest}>
    {({ error }) => (
      <div className="fileUploader">
        <div className="fileUploader-inner">
          <UploadField
            onFiles={handleFiles}
            uploadProps={{
              accept:
                accept ||
                "video/mp4,audio/mp3,image/jpeg,image/png,application/*,text/*",
              multiple: true
            }}
          >
            {children}
          </UploadField>
          {isLoading && !(error || fileError) ? (
            <CircularProgress className="circular-progress" />
          ) : (
            <div />
          )}
        </div>
        {progress && !(error || fileError) ? (
          <progress className="progress" max="100" value={progress} />
        ) : (
          <div />
        )}
        {(error || fileError) && (
          <div className="invalid">{fileError || "Nahrávání selhalo."}</div>
        )}
      </div>
    )}
  </Uploader>
);

export default compose(
  defaultProps({
    onLoadingStart: noop,
    onLoadingEnd: noop
  }),
  withState("fileError", "setFileError", null),
  withState("isLoading", "setIsLoading", false),
  withState("progress", "setProgress", 0),
  withHandlers({
    handleFiles: ({
      setFileError,
      onComplete,
      url,
      setProgress,
      setIsLoading
    }) => async files => {
      const filesArray = map(files, file => file);

      if (find(files, ({ size }) => size > MAX_FILE_SIZE)) {
        setFileError("Maximální velikost souboru je 25MB.");
      } else if (sumBy(files, "size") > MAX_FILES_SIZE) {
        setFileError("Součet velikostí všech souborů nesmí překročit 125MB.");
      } else if (files.length > 0 && every(files, isEmpty)) {
        setFileError(null);

        if (filesArray.length > 1) {
          setProgress(1);
        } else {
          setIsLoading(true);
        }

        const filesToReturn = [];

        const ok = await asyncForEach(filesArray, async (file, i) => {
          const newFile = await postFile(file, url);

          if (newFile) {
            setProgress(Math.floor(((i + 1) / filesArray.length) * 100));
            filesToReturn.push(newFile);
            return true;
          } else {
            setFileError(
              `Nahrávání souboru ${
                file.name
              } selhalo. Seznam podporovaných formátů je k dispozici v manuálu.`
            );
            return false;
          }
        });

        setIsLoading(false);

        if (ok && filesToReturn) {
          onComplete(filesToReturn);
        }
      } else {
        setFileError(null);
      }

      setProgress(0);
    }
  })
)(FileUploader);
