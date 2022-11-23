import { FileLookupMap } from "containers/views/hooks/files-hook";

export type ScreenFiles = {
  images?: (string | undefined)[];
  image?: string;
  music?: string;
  video?: string;
  audio?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  object?: string;
  answers?: { image?: string }[];
};

type ScreenFilesInput = Omit<ScreenFiles, "images"> & {
  images: (string | { id: string } | undefined)[];
};

export type FilesCache = {
  [Key in string]?: ScreenFiles;
};

export type ScreenFileResolver<TProps = unknown, TReturn = unknown> = (
  props: TProps,
  fileLookupMap: FileLookupMap
) => Promise<TReturn>;

export type ScreenFileResolverMap = {
  [Key in keyof ScreenFiles]: ScreenFileResolver<
    ScreenFilesInput[Key],
    ScreenFiles[Key]
  >;
};

export type FilePreloaderContextType = {
  fileCache: FilesCache;
  screenFiles?: ScreenFiles;
  isLoading: boolean;
};
