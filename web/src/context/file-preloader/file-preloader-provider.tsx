import { ReactNode } from "react";

import { FilePreloaderContext } from "./file-preloader-context";
import { useFilePreloaderContext } from "./file-preloader-hook";

type FilePreloaderProps = {
  children?: ReactNode;
};

export const FilePreloaderProvider = ({ children }: FilePreloaderProps) => {
  const filePreloaderContext = useFilePreloaderContext();

  return (
    <FilePreloaderContext.Provider value={filePreloaderContext}>
      {children}
    </FilePreloaderContext.Provider>
  );
};
