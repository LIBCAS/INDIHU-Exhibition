// NOTE: keep sorted by labels withing groups
export const tagsOptions = [
  {
    label: "Vyberte 1 téma, ktorým se vaše výstava zabýva",
    value: "--",
    group: "--",
  },
  { label: "Dějiny a lidé", value: "HISTORY_PEOPLE", group: "content" },
  { label: "Příroda", value: "NATURE", group: "content" },
  { label: "Společnost", value: "SOCIETY", group: "content" },
  { label: "Umění", value: "ART", group: "content" },
  { label: "Věda a technika", value: "SCIENCE_TECHNIQUE", group: "content" },

  {
    label: "Vyberte max. 2 formální vlastnosti vaší výstavy",
    value: "--",
    group: "--",
  },
  { label: "English friendly", value: "ENGLISH_FRIENDLY", group: "formal" },
  { label: "Estetická", value: "AESTHETIC", group: "formal" },
  { label: "Informatívní", value: "INFORMATIVE", group: "formal" },
  { label: "Interaktivní", value: "INTERACTIVE", group: "formal" },
  { label: "Pro mobily", value: "FOR_MOBILES", group: "formal" },
  { label: "Vzdělávací", value: "EDUCATIONAL", group: "formal" },
  { label: "Zábavná", value: "FUNNY", group: "formal" },

  { label: "Vyberte pro koho je výstava určena", value: "--", group: "--" },
  { label: "Děti", value: "CHILDREN", group: "target" },
  { label: "Dospělí", value: "ADULTS", group: "target" },
  { label: "Odborníci", value: "EXPERTS", group: "target" },
  { label: "Rodina", value: "FAMILY", group: "target" },
  { label: "Senioří", value: "SENIORS", group: "target" },
  { label: "Studenti", value: "STUDENTS", group: "target" },
  { label: "Teenageři", value: "TEENAGERS", group: "target" },
] as const;

// - - -

// 44 total values with '--'
type AllTagValues = typeof tagsOptions[number]["value"];
export type TagValues = Exclude<AllTagValues, "--">;

type AllTagGroups = typeof tagsOptions[number]["group"];
export type TagGroups = Exclude<AllTagGroups, "--">;
