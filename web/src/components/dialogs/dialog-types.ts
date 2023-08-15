// START screen
import { ChaptersDialogDataProps } from "./chapters-dialog/chapters-dialog";
import { ExpoInfoDialogDataProps } from "./expo-info-dialog/expo-info-dialog";
import { FilesDialogDataProps } from "./files-dialog/files-dialog";
import { WorksheetsDialogDataProps } from "./worksheets-dialog/worksheets-dialog";
// FINISH screen
import { ShareExpoDialogDataProps } from "./share-expo-dialog/share-expo-dialog";
import { FinishAllFilesDialogDataProps } from "./finish-all-files-dialog/finish-all-files-dialog";
import { FinishInfoDialogDataProps } from "./finish-info-dialog/finish-info-dialog";
import { RatingDialogDataProps } from "./rating-dialog/rating-dialog";
// Control panel
import { AudioDialogDataProps } from "./audio-dialog/audio-dialog";
import { SettingsDialogDataProps } from "./settings-dialog/settings-dialog";

import { File as IndihuFile } from "models";

// All possible dialog names (important when calling setDialog action)
export enum DialogType {
  ChaptersDialog = "ChaptersDialog",
  ExpoInfoDialog = "ExpoInfoDialog",
  FilesDialog = "FilesDialog",
  WorksheetsDialog = "WorksheetsDialog",
  ShareExpoDialog = "ShareExpoDialog",
  FinishInfoDialog = "FinishInfoDialog",
  FinishAllFilesDialog = "FinishAllFilesDialog",
  RatingDialog = "RatingDialog",
  AudioDialog = "AudioDialog",
  SettingsDialog = "SettingsDialog",
  // Others
  ScreenFileChoose = "ScreenFileChoose",
  ConfirmDialog = "ConfirmDialog",
  InfoDialog = "Info",
  FileNewFolder = "FileNewFolder",
  FileRenameFolder = "FileRenameFolder",
  FileDeleteFolder = "FileDeleteFolder",
  FilesManagerMenu = "FilesManagerMenu",
}

type ScreenFileChooseDialogDataProps = {
  onChoose: (file: IndihuFile) => void;
  typeMatch?: RegExp;
  accept?: string;
  className?: string;
  style?: React.CSSProperties;
};

type ConfirmDialogDataProps = {
  title?: React.ReactNode | string;
  text?: string;
  onSubmit: () => void;
};

type InfoDialogDataProps = {
  title?: string;
  content?: React.ReactNode; // either content or text as body
  text?: string;
  noStornoButton?: boolean;
};

type FileNewFolderDataProps = Record<string, never>;
type FileRenameFolderDataProps = { name: any };
type FileDeleteFolderDataProps = { name: any };

type FilesManagerMenuDataProps = Record<string, any>;

// Each dialog has built-in DialogProps: setDialog, closeDialog, dialogData, addDialogData
// Each dialog has its own custom DialogDataProps --> type definition for dialog.dialogData
// custom DialogDataProps - those who are supplied when setDialog(DialogType.Name, { ...dialogData })
export type DialogDataProps<T extends DialogType> =
  T extends DialogType.ChaptersDialog
    ? ChaptersDialogDataProps
    : T extends DialogType.ExpoInfoDialog
    ? ExpoInfoDialogDataProps
    : T extends DialogType.FilesDialog
    ? FilesDialogDataProps
    : T extends DialogType.WorksheetsDialog
    ? WorksheetsDialogDataProps
    : T extends DialogType.ShareExpoDialog
    ? ShareExpoDialogDataProps
    : T extends DialogType.FinishAllFilesDialog
    ? FinishAllFilesDialogDataProps
    : T extends DialogType.FinishInfoDialog
    ? FinishInfoDialogDataProps
    : T extends DialogType.RatingDialog
    ? RatingDialogDataProps
    : T extends DialogType.AudioDialog
    ? AudioDialogDataProps
    : T extends DialogType.SettingsDialog
    ? SettingsDialogDataProps
    : T extends DialogType.ScreenFileChoose
    ? ScreenFileChooseDialogDataProps
    : T extends DialogType.ConfirmDialog
    ? ConfirmDialogDataProps
    : T extends DialogType.InfoDialog
    ? InfoDialogDataProps
    : T extends DialogType.FileNewFolder
    ? FileNewFolderDataProps
    : T extends DialogType.FileRenameFolder
    ? FileRenameFolderDataProps
    : T extends DialogType.FileDeleteFolder
    ? FileDeleteFolderDataProps
    : T extends DialogType.FilesManagerMenu
    ? FilesManagerMenuDataProps
    : never;

export type DialogProps<T extends DialogType> = {
  setDialog: () => void; // Typing here
  closeDialog: () => void;
  name: string; // One of the name of all the dialogs..
  dialogData: DialogDataProps<T> | null;
  addDialogData: <T extends DialogType>(
    name: T,
    data: Partial<DialogDataProps<T>>
  ) => void;
  dialogs: { name: string; data: any }[];
};
