import { Screen, StartScreen, FinishScreen } from "./screen";
import { Folder } from "./file";
import { TagValues } from "containers/expo-administration/expo-settings/tags-options";
import { ThemeFormDataProcessed } from "containers/expo-administration/expo-theme/models";

export type ExpositionState = "PREPARE" | "OPENED" | "ENDED";

export type AuthorObj = {
  id: string;
  firstName: string;
  surname: string;
  username: string;
  institution: string;
  email: string;
};

export type CollaboratorObj = {
  collaborationType: "READ_ONLY" | "EDIT";
  collaborator: AuthorObj;
  id: string;
  since: string;
  userEmail: string;
};

export type ExpoStructure = {
  files: Folder[];
  finish: FinishScreen;
  screens: Screen[][];
  start: StartScreen;
};

export type ExpositionDesignDataObj = ThemeFormDataProcessed;
export type Theme = ExpositionDesignDataObj["theme"];

export type ViewExpo = {
  id: string;
  state: ExpositionState;
  author: AuthorObj;
  title: string;
  url: string;
  structure: ExpoStructure;
  tags: TagValues[];
  organization?: string;
  expositionDesignData?: ExpositionDesignDataObj;
  collaborators?: CollaboratorObj[];
  closedUrl?: string; // closed stuff set in administration, in settings where the state is being also set
  closedPicture?: string;
  closedCaption?: string;
  filesTotal?: number;
  audioFilesTotal?: number;
  videoFilesTotal?: number;
  filesLoaded?: number;
  audioFilesLoaded?: number;
  videoFilesLoaded?: number;
};

export type ActiveExpo = {
  author: AuthorObj;
  collaborators: CollaboratorObj[];
  created: string;
  expoFiles: { id: string; name: string }[];
  id: string;
  isEditing: string;
  organization: string;
  state: ExpositionState;
  structure: ExpoStructure;
  tags: TagValues[];
  title: string;
  updated: string;
  url: string;
  urls: { id: string; url: string }[];
  expositionDesignData?: ExpositionDesignDataObj;
};

export type ExpositionItem = {
  id: string;
  title: string;
  url: string;
  inProgress: boolean;
  canEdit: boolean;
  canDelete: boolean;
  lastEdit: string;
  created: string;
  isEditing: string;
  state: string;
};

export type ExpoRates = Record<ViewExpo["id"], boolean>;
