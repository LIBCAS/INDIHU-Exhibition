import { useCallback, useMemo } from "react";

// Components
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

// Models
import { Document } from "models";

// Utils
import { getDocumentIconName } from "utils/screen";
import { downloadFile } from "utils";
import cx from "classnames";

// - - - - - -

interface Props {
  file: Document;
  isFromFinishFileDialog?: boolean;
  isSubItem?: boolean;
  specialType?: "expoAudioVersion";
}

export const FileItem = ({
  file,
  isFromFinishFileDialog,
  isSubItem,
  specialType,
}: Props) => {
  const fileInfo = useMemo(() => {
    let fileIconName: string | undefined;
    let fileTitle: string;
    let shouldDisplayDownloadBtn: boolean;

    if ("name" in file) {
      fileIconName = getDocumentIconName(file.type);
      fileTitle = file.fileName ?? file.name;
      shouldDisplayDownloadBtn = true;
    } else if ("urlType" in file) {
      fileIconName = getDocumentIconName(file.urlType);
      fileTitle = file.fileName;
      shouldDisplayDownloadBtn = false;
    } else {
      fileIconName = undefined;
      fileTitle = file.fileName;
      shouldDisplayDownloadBtn = false;
    }

    if (specialType === "expoAudioVersion") {
      fileIconName = "hearing";
    }

    return { fileIconName, fileTitle, shouldDisplayDownloadBtn };
  }, [file, specialType]);

  // - - - Callbacks - - -

  /**
   * This callback is only for files of type `File`.
   * Other types: `UrlDocument` and `EmptyLinkDocument` are not supported here for download
   * NOTE: fileName field is supplied by the user when creating the file document
   */
  const handleDownload = useCallback(() => {
    const canDownload = "fileId" in file && "name" in file;
    if (!canDownload) {
      return;
    }
    downloadFile(`/api/files/${file.fileId}`, file.name);
  }, [file]);

  // - - - GUI - - -

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
      <Icon containerClassName="text-gray" name={fileInfo.fileIconName} />

      {"urlType" in file ? (
        <a href={file.url} target="_blank" rel="noopener noreferrer">
          {fileInfo.fileTitle}
        </a>
      ) : (
        <span>{fileInfo.fileTitle}</span>
      )}

      {fileInfo.shouldDisplayDownloadBtn && (
        <Button onClick={handleDownload} className="ml-auto">
          <Icon name="file_download" color="primary" />
        </Button>
      )}
    </div>
  );
};
