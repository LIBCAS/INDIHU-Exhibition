import { ReactNode, createContext, useContext } from "react";

import { useFilePreloaderScreens } from "./file-preloader-screens-hook";
import { useFilePreloaderMusic } from "./file-preloader-music-hook";
import { useFilePreloaderSoundtrack } from "./fire-preloader-soundtrack-hook";

// - - - - - -

// Represents object with preloaded files for one current screen
// e.g if current screen is 'Slideshow', then preloaded files are 'audio' and 'images'
// e.g if current screen is 'ImageChange', then preloaded files are 'image1' and 'image2'
export type ScreenPreloadedFiles = {
  backgroundImage?: string;
  images?: (string | undefined)[];
  image?: string;
  //music?: string;
  video?: string;
  audio?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  object?: string;
  object2?: string;
  object3?: string;
  answers?: { image?: string }[];
  links?: { image?: string }[];
  surveyAnswers?: { image?: string }[];
};

// - - - - - -

// Represents object of all screens which currently have preloaded files
// Current screen is always preloaded + next screen and previous screen
// If some screen is already preloaded, next time preloading will be ignored
// object looks like { [`${section},${screen}`]: ScreenFiles }
// { [`${section},${screen}`]: { image: "blob:...", music: "blob...", ... } }
export type FilesCache = {
  [Key in string]?: ScreenPreloadedFiles;
};

export type ScreenPreloads = {
  fileCache: FilesCache;
  screenPreloadedFiles?: ScreenPreloadedFiles;
  isLoading: boolean;
};

// - - - - - -

// Represent cache of preloaded chapter musics, separatly
// number key as index of chapter
export type ChapterMusicCache = Record<number, string | undefined>;

type MusicPreloads = {
  chapterMusicCache: ChapterMusicCache;
  isMusicLoading: boolean;
};

// - - - - - -

export type ExpoSoundtrackPreload = {
  soundtrackUrl: string | null;
  isSoundtrackLoading: boolean;
};

export type FilePreloaderContextType = ScreenPreloads &
  MusicPreloads &
  ExpoSoundtrackPreload;

const FilePreloaderContext = createContext<FilePreloaderContextType>(
  undefined as never
);

// - - - - - - - -

type FilePreloaderProviderProps = {
  children: ReactNode;
};

export const FilePreloaderProvider = ({
  children,
}: FilePreloaderProviderProps) => {
  // Global state with preloaded current + previous and next screen
  // Automatically listening to screen changes, when screen changes, preload its current + previous and next screen
  const screenPreloads = useFilePreloaderScreens();
  const musicPreloads = useFilePreloaderMusic();
  const soundtrackPreload = useFilePreloaderSoundtrack();

  const filePreloaderValue: FilePreloaderContextType = {
    fileCache: screenPreloads.fileCache,
    screenPreloadedFiles: screenPreloads.screenPreloadedFiles,
    isLoading: screenPreloads.isLoading,

    chapterMusicCache: musicPreloads.chapterMusicCache,
    isMusicLoading: musicPreloads.isMusicLoading,

    soundtrackUrl: soundtrackPreload.soundtrackUrl,
    isSoundtrackLoading: soundtrackPreload.isSoundtrackLoading,
  };

  return (
    <FilePreloaderContext.Provider value={filePreloaderValue}>
      {children}
    </FilePreloaderContext.Provider>
  );
};

// - - - - - - -

export const useFilePreloader = () => useContext(FilePreloaderContext);
