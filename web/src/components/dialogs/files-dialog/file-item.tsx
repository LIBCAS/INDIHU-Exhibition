import { useCallback } from "react";

import cx from "classnames";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import { getDocumentIconName } from "utils";
import { downloadFile } from "utils/download-file";

import { Document } from "models";

interface Props {
  file: Document;
  isFromFinishFileDialog?: boolean;
  isSubItem?: boolean; // for padding
}

export const FileItem = ({
  file,
  isFromFinishFileDialog,
  isSubItem,
}: Props) => {
  // fileName is name given by the user from the TextField
  // name (original when uploading) and fileId exist if file is file (not URL or odkaz)
  const handleDownload = useCallback(() => {
    if (!("name" in file)) {
      return;
    }

    downloadFile(`/api/files/${file.fileId}`, file.name);
  }, [file]);

  return (
    <div
      className={cx(
        "flex items-center gap-4 p-2 border-b border-b-black border-opacity-10",
        {
          "w-11/12": isFromFinishFileDialog,
          "ml-12": isSubItem,
        }
      )}
    >
      <Icon
        className="text-muted"
        name={getDocumentIconName(
          "name" in file
            ? file.type
            : "urlType" in file
            ? file.urlType
            : undefined
        )}
      />
      {"name" in file ? (
        <span>{file.fileName}</span>
      ) : (
        <a href={file.url} target="_blank" rel="noopener noreferrer">
          {file.fileName}
        </a>
      )}
      {"name" in file && (
        <Button onClick={handleDownload} className="ml-auto">
          <Icon name="file_download" color="primary" />
        </Button>
      )}
    </div>
  );
};
