import { ExpositionsFilterStateObj } from "containers/expositions/Expositions";
import {
  File as IndihuFile,
  Document,
  AuthorObj,
  ExpositionState,
  ActiveExpo,
} from "models";

// All possible dialog names (important when calling setDialog action)
export enum DialogType {
  // Others
  ScreenFileChoose = "ScreenFileChoose",
  ConfirmDialog = "ConfirmDialog",
  InfoDialog = "Info",
  FileNewFolder = "FileNewFolder",
  FileRenameFolder = "FileRenameFolder",
  FileDeleteFolder = "FileDeleteFolder",
  FilesManagerMenu = "FilesManagerMenu",
  ScreenDocumentNew = "ScreenDocumentNew",
  ScreenDocumentChange = "ScreenDocumentChange",
  ExpoShare = "ExpoShare",
  ExpoShareChangeOwner = "ExpoShareChangeOwner",
  ExpoShareRemoveCollaborator = "ExpoShareRemoveCollaborator",
  ExpoNew = "ExpoNew",
  ExpositionMenu = "ExpositionMenu",
  DeleteAccount = "DeleteAccount",
  ScreenAuthorsChange = "ScreenAuthorsChange",
  ScreenAuthorsAdd = "ScreenAuthorsAdd",
  PasswordReset = "PasswordReset",
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
  onSubmit: (() => void) | (() => Promise<void>);
};

type InfoDialogDataProps = {
  title?: string;
  content?: React.ReactNode; // either content or text as body
  text?: string;
  noStornoButton?: boolean;
  noDialogMenu?: boolean;
  large?: boolean;
};

type FileNewFolderDataProps = Record<string, never>;
type FileRenameFolderDataProps = { name: any };
type FileDeleteFolderDataProps = { name: any };

type FilesManagerMenuDataProps = Record<string, any>;

type ScreenDocumentNewDataProps = Record<string, never>;
type ScreenDocumentChangeDataProps = Document;

type ExpoShareDataProps = { expoId: string; author: AuthorObj };
type ExpoShareChangeOwnerDataProps = Record<string, never>;
type ExpoShareRemoveCollaboratorDataProps = {
  id: string;
  name: string | null | undefined;
};

type ExpoNewDataProps = Record<string, never>;
type ExpositionMenuDataProps = {
  id: string;
  title: string;
  url: string;
  canEdit: boolean;
  canDelete: boolean;
  state: ExpositionState;
  inProgress: boolean;
  activeExpo: ActiveExpo;
  expositions: any;
  expositionsFilterState: ExpositionsFilterStateObj;
};

type DeleteAccountDataProps = Record<string, never>;

type ScreenAuthorsChangeDataProps = {
  role: string;
  text: string;
};

type ScreenAuthorsAddDataProps = Record<string, never>;

type PasswordResetDataProps = Record<string, never>;

// Each dialog has built-in DialogProps: setDialog, closeDialog, dialogData, addDialogData
// Each dialog has its own custom DialogDataProps --> type definition for dialog.dialogData
// custom DialogDataProps - those who are supplied when setDialog(DialogType.Name, { ...dialogData })
export type DialogDataProps<T extends DialogType> =
  T extends DialogType.ScreenFileChoose
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
    : T extends DialogType.ScreenDocumentNew
    ? ScreenDocumentNewDataProps
    : T extends DialogType.ScreenDocumentChange
    ? ScreenDocumentChangeDataProps
    : T extends DialogType.ExpoShare
    ? ExpoShareDataProps
    : T extends DialogType.ExpoShareChangeOwner
    ? ExpoShareChangeOwnerDataProps
    : T extends DialogType.ExpoShareRemoveCollaborator
    ? ExpoShareRemoveCollaboratorDataProps
    : T extends DialogType.ExpoNew
    ? ExpoNewDataProps
    : T extends DialogType.ExpositionMenu
    ? ExpositionMenuDataProps
    : T extends DialogType.DeleteAccount
    ? DeleteAccountDataProps
    : T extends DialogType.ScreenAuthorsChange
    ? ScreenAuthorsChangeDataProps
    : T extends DialogType.ScreenAuthorsAdd
    ? ScreenAuthorsAddDataProps
    : T extends DialogType.PasswordReset
    ? PasswordResetDataProps
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
