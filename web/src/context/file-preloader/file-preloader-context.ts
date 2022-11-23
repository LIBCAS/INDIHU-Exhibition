import { createContext, useContext } from "react";

import { FilePreloaderContextType } from "./file-preloader-types";

export const FilePreloaderContext = createContext<FilePreloaderContextType>(
  undefined as never
);

export const useFilePreloader = () => useContext(FilePreloaderContext);
