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
}

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
    : never;

export type DialogProps<T extends DialogType> = {
  setDialog: () => void;
  closeDialog: () => void;
  dialogData: DialogDataProps<T> | null;
  addDialogData: <T extends DialogType>(
    name: T,
    data: Partial<DialogDataProps<T>>
  ) => void;
};
