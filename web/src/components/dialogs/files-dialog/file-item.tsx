import { useCallback } from "react";
import { Button } from "components/button/button";

import { Document } from "models";
import { getDocumentIconName } from "utils";
import { downloadFile } from "utils/download-file";

import { Icon } from "components/icon/icon";

interface Props {
  file: Document;
}

export const FileItem = ({ file }: Props) => {
  const handleDownload = useCallback(() => {
    if (!("name" in file)) {
      return;
    }

    downloadFile(`/api/files/${file.fileId}`, file.name);
  }, [file]);

  return (
    <div className="flex items-center gap-4 border-b p-2 border-b-black border-opacity-10">
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
