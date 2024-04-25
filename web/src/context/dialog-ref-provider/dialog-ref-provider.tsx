import {
  useState,
  useRef,
  useMemo,
  useCallback,
  MutableRefObject,
  createContext,
  useContext,
  ReactNode,
} from "react";

import { DialogRefType } from "./dialog-ref-types";
// - - -

type DialogRefProviderContextType = {
  dialogsDivRef: MutableRefObject<HTMLDivElement | null>;
  //
  openNewTopDialog: (dialogType: DialogRefType) => void;
  closeTopDialog: () => void;
  closeAllDialogs: () => void;
  openedTopDialog: DialogRefType | null;
  //
  isOverlayDialogOpen: boolean;
  isSettingsDialogOpen: boolean;
  isGlassMagnifierDialogOpen: boolean;
  isAudioDialogOpen: boolean;
  isChaptersDialogOpen: boolean;
  isFilesDialogOpen: boolean;
  isWorksheetDialogOpen: boolean;
  isExpoInfoDialogOpen: boolean;
  isShareExpoDialogOpen: boolean;
  isFinishAllFilesDialogOpen: boolean;
  isFinishInfoDialogOpen: boolean;
  isRatingDialogOpen: boolean;
  isInformationDialogOpen: boolean;
  isRegisterDialogOpen: boolean;
  isLoginDialogOpen: boolean;
  isExpoAuthorsDialogOpen: boolean;
};

const DialogRefContext = createContext<DialogRefProviderContextType>(
  undefined as never
);

// - - -

type DialogRefProviderProps = {
  children: ReactNode;
};

export const DialogRefProvider = ({ children }: DialogRefProviderProps) => {
  const dialogsDivRef = useRef<HTMLDivElement | null>(null);

  //
  const [openedDialogs, setOpenedDialogs] = useState<DialogRefType[]>([]);

  const openNewTopDialog = useCallback((dialogType: DialogRefType) => {
    setOpenedDialogs((prev) => [...prev, dialogType]);
  }, []);

  const closeTopDialog = useCallback(() => {
    const copy = [...openedDialogs];
    copy.pop();
    setOpenedDialogs(copy);
  }, [openedDialogs]);

  const closeAllDialogs = useCallback(() => {
    setOpenedDialogs([]);
  }, []);

  const openedTopDialog = useMemo(() => {
    if (openedDialogs.length === 0) {
      return null;
    }
    return openedDialogs[openedDialogs.length - 1];
  }, [openedDialogs]);

  // Helpers
  const isOverlayDialogOpen = useMemo(
    () => openedTopDialog === DialogRefType.OverlayDialog,
    [openedTopDialog]
  );

  const isSettingsDialogOpen = useMemo(
    () => openedTopDialog === DialogRefType.SettingsDialog,
    [openedTopDialog]
  );

  const isGlassMagnifierDialogOpen = useMemo(
    () => openedTopDialog === DialogRefType.GlassMagnifierDialog,
    [openedTopDialog]
  );

  const isAudioDialogOpen = useMemo(
    () => openedTopDialog === DialogRefType.AudioDialog,
    [openedTopDialog]
  );

  const isChaptersDialogOpen = useMemo(
    () => openedTopDialog === DialogRefType.ChaptersDialog,
    [openedTopDialog]
  );

  const isExpoInfoDialogOpen = useMemo(
    () => openedTopDialog === DialogRefType.ExpoInfoDialog,
    [openedTopDialog]
  );

  const isFilesDialogOpen = useMemo(
    () => openedTopDialog === DialogRefType.FilesDialog,
    [openedTopDialog]
  );

  const isWorksheetDialogOpen = useMemo(
    () => openedTopDialog === DialogRefType.WorksheetDialog,
    [openedTopDialog]
  );

  const isShareExpoDialogOpen = useMemo(
    () => openedTopDialog === DialogRefType.ShareExpoDialog,
    [openedTopDialog]
  );

  const isFinishAllFilesDialogOpen = useMemo(
    () => openedTopDialog === DialogRefType.FinishAllFilesDialog,
    [openedTopDialog]
  );

  const isFinishInfoDialogOpen = useMemo(
    () => openedTopDialog === DialogRefType.FinishInfoDialog,
    [openedTopDialog]
  );

  const isInformationDialogOpen = useMemo(
    () => openedTopDialog === DialogRefType.InformationDialog,
    [openedTopDialog]
  );

  const isRatingDialogOpen = useMemo(
    () => openedTopDialog === DialogRefType.RatingDialog,
    [openedTopDialog]
  );

  const isRegisterDialogOpen = useMemo(
    () => openedTopDialog === DialogRefType.RegisterDialog,
    [openedTopDialog]
  );

  const isLoginDialogOpen = useMemo(
    () => openedTopDialog === DialogRefType.LoginDialog,
    [openedTopDialog]
  );

  const isExpoAuthorsDialogOpen = useMemo(
    () => openedTopDialog === DialogRefType.ExpoAuthorsDialog,
    [openedTopDialog]
  );

  return (
    <DialogRefContext.Provider
      value={{
        dialogsDivRef: dialogsDivRef,
        openNewTopDialog,
        closeTopDialog,
        closeAllDialogs,
        openedTopDialog,
        // Helpers
        isOverlayDialogOpen,
        isSettingsDialogOpen,
        isGlassMagnifierDialogOpen,
        isAudioDialogOpen,
        isChaptersDialogOpen,
        isFilesDialogOpen,
        isWorksheetDialogOpen,
        isExpoInfoDialogOpen,
        isShareExpoDialogOpen,
        isFinishAllFilesDialogOpen,
        isFinishInfoDialogOpen,
        isRatingDialogOpen,
        isInformationDialogOpen,
        isRegisterDialogOpen,
        isLoginDialogOpen,
        isExpoAuthorsDialogOpen,
      }}
    >
      {children}
    </DialogRefContext.Provider>
  );
};

// - - -

export const useDialogRef = () => useContext(DialogRefContext);
