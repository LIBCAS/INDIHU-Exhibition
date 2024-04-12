import { Screen, StartScreen, FinishScreen } from "./screen";
import { Folder } from "./file";
import { TagValues } from "containers/expo-administration/expo-settings/tags/tags-options";
import { ThemeFormDataProcessed } from "containers/expo-administration/expo-theme/models";

export type ExpositionState = "PREPARE" | "OPENED" | "ENDED";

export type ExpositionsObj = { items: ExpositionItem[]; count: number };

export type ExpositionFilter =
  | "ALL"
  | "AUTHORSHIP"
  | "READ_ONLY"
  | "READ_WRITE";
export type ExpositionSort =
  | "title"
  | "state"
  | "created"
  | "edited"
  | "isEditing";
export type ExpositionOrder = "ASC" | "DESC";

export type ExpositionFilterObj = {
  filter: ExpositionFilter;
  sort: ExpositionSort;
  order: ExpositionOrder;
  search: string;
};

export type ExpositionPagerObj = {
  page: number;
  pageSize: number;
};

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
  collaborator?: AuthorObj; // could missing, e.g when collaborator added through email invitation
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

export type ExpositionRatingObj = {
  id: string;
  ratingCount: number; // number of people who have rated the exposition
  average: number; // average 'star' rating
  gameCount: number; // number of checkboxes clicked
  mediaCount: number;
  textCount: number;
  topicCount: number;
};

// Text field from rating dialog
export type MessageObj = {
  id: string;
  created: string;
  updated: string;
  rating?: number; // number of stars in this message
  text?: string; // undefined if user did not write anything to the textfield
  contactEmail?: string;
};

export type PreferenceObj = {
  game: boolean;
  media: boolean;
  text: boolean;
  topic: boolean;
};

// - -

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
  canEdit: boolean;
  closedUrl?: string; // closed stuff set in administration, in settings where the state is being also set
  closedPicture?: string;
  closedCaption?: string;
  expositionDesignData?: ExpositionDesignDataObj;
  expositionRating?: ExpositionRatingObj;
  messages?: MessageObj[];
  viewCounter: number;
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
  state: ExpositionState;
  authorUsername: string;
  rating?: number; // avg rating, undefined if no rating yet
  ratingCount?: number;
  messageCount?: number;
  preferences: PreferenceObj;
  viewCount?: number;
  pinned: boolean;
};

export type ExpoRates = Record<ViewExpo["id"], boolean>;
