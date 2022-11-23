import { ChaptersDialogData } from "./chapters-dialog/chapters-dialog";
import { ExpoInfoDialogData } from "./expo-info-dialog/expo-info-dialog";
import { FilesDialogData } from "./files-dialog/files-dialog";
import { FinishInfoDialogData } from "./finish-info-dialog/finish-info-dialog";
import { ShareExpoDialogData } from "./share-expo-dialog/share-expo-dialog";

export enum DialogType {
  ChaptersDialog = "ChaptersDialog",
  FilesDialog = "FilesDialog",
  ExpoInfoDialog = "ExpoInfoDialog",
  ShareExpoDialog = "ShareExpoDialog",
  FinishInfoDialog = "FinishInfoDialog",
}

export type DialogDataType<T extends DialogType> =
  T extends DialogType.ChaptersDialog
    ? ChaptersDialogData
    : T extends DialogType.FilesDialog
    ? FilesDialogData
    : T extends DialogType.ExpoInfoDialog
    ? ExpoInfoDialogData
    : T extends DialogType.ShareExpoDialog
    ? ShareExpoDialogData
    : T extends DialogType.FinishInfoDialog
    ? FinishInfoDialogData
    : never;

export type DialogProps<T extends DialogType> = {
  setDialog: () => void;
  closeDialog: () => void;
  addDialogData: <T extends DialogType>(
    name: T,
    data: Partial<DialogDataType<T>>
  ) => void;
  dialogData: DialogDataType<T> | null;
};
