import { useCallback } from "react";

// Components
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

// Models
import { Document } from "models";

// Utils
import { getDocumentIconName } from "utils/screen";
import { downloadFile } from "utils/download-file";
import cx from "classnames";

// - - - - - - - -

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
  // Document as File, not UrlDocument or EmptyLinkDocument, fileName is supplied by the user when creating the file document
  const handleDownload = useCallback(() => {
    if (!("fileId" in file && "name" in file)) {
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
      ) : "url" in file ? (
        <a href={file.url} target="_blank" rel="noopener noreferrer">
          {file.fileName}
        </a>
      ) : (
        <span>{file.fileName}</span>
      )}
      {"name" in file && (
        <Button onClick={handleDownload} className="ml-auto">
          <Icon name="file_download" color="primary" />
        </Button>
      )}
    </div>
  );
};
