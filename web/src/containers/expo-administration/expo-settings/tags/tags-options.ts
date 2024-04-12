// NOTE: keep sorted by labels withing groups
export const tagsOptions = [
  {
    label: "tags.exhibitionTopicGroupLabel",
    value: "--",
    group: "--",
  },
  { label: "tags.historyAndPeople", value: "HISTORY_PEOPLE", group: "content" },
  { label: "tags.nature", value: "NATURE", group: "content" },
  { label: "tags.society", value: "SOCIETY", group: "content" },
  { label: "tags.art", value: "ART", group: "content" },
  {
    label: "tags.scienceAndTechnique",
    value: "SCIENCE_TECHNIQUE",
    group: "content",
  },

  {
    label: "tags.exhibitionFormalPropertyGroupLabel",
    value: "--",
    group: "--",
  },
  { label: "tags.englishFriendly", value: "ENGLISH_FRIENDLY", group: "formal" },
  { label: "tags.aesthetic", value: "AESTHETIC", group: "formal" },
  { label: "tags.informative", value: "INFORMATIVE", group: "formal" },
  { label: "tags.interactive", value: "INTERACTIVE", group: "formal" },
  { label: "tags.forMobiles", value: "FOR_MOBILES", group: "formal" },
  { label: "tags.educational", value: "EDUCATIONAL", group: "formal" },
  { label: "tags.funny", value: "FUNNY", group: "formal" },

  { label: "tags.exhibitionIntendedForGroupLabel", value: "--", group: "--" },
  { label: "tags.children", value: "CHILDREN", group: "target" },
  { label: "tags.adults", value: "ADULTS", group: "target" },
  { label: "tags.experts", value: "EXPERTS", group: "target" },
  { label: "tags.family", value: "FAMILY", group: "target" },
  { label: "tags.seniors", value: "SENIORS", group: "target" },
  { label: "tags.students", value: "STUDENTS", group: "target" },
  { label: "tags.teenagers", value: "TEENAGERS", group: "target" },
] as const;

// - - -

// 44 total values with '--'
type AllTagValues = typeof tagsOptions[number]["value"];
export type TagValues = Exclude<AllTagValues, "--">;

type AllTagGroups = typeof tagsOptions[number]["group"];
export type TagGroups = Exclude<AllTagGroups, "--">;
