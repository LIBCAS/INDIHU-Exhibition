export const tagsOptions = [
  {
    label: "Vyberte 1 téma, ktorým se vaše výstava zabýva",
    value: "--",
    group: "--",
  },
  { label: "Umění", value: "ART", group: "content" },
  { label: "Historie", value: "HISTORY", group: "content" },
  { label: "Příroda", value: "NATURE", group: "content" },
  { label: "Technika", value: "TECHNIQUE", group: "content" },
  { label: "Průmysl", value: "INDUSTRY", group: "content" },
  { label: "Design", value: "DESIGN", group: "content" },
  { label: "Věda", value: "SCIENCE", group: "content" },
  { label: "Společnost", value: "SOCIETY", group: "content" },
  { label: "Osobnosti", value: "PERSONALITIES", group: "content" },
  { label: "Lidé", value: "PEOPLE", group: "content" },
  { label: "Kultura", value: "CULTURE", group: "content" },
  { label: "Psychologie", value: "PSYCHOLOGY", group: "content" },
  { label: "LGBT+", value: "LGBT+", group: "content" },
  { label: "Minority", value: "MINORITY", group: "content" },
  { label: "Ekologie", value: "ECOLOGY", group: "content" },
  { label: "Knihovníctví", value: "LIBRARIANSHIP", group: "content" },
  { label: "Sport", value: "SPORT", group: "content" },
  { label: "Cestování", value: "TRAVELLING", group: "content" },
  { label: "Hudba", value: "MUSIC", group: "content" },
  { label: "Literatura", value: "LITERATURE", group: "content" },
  { label: "Architektura", value: "ARCHITECTURE", group: "content" },
  { label: "Film", value: "MOVIE", group: "content" },
  { label: "Divadlo", value: "THEATER", group: "content" },
  { label: "Tanec", value: "DANCE", group: "content" },
  { label: "Náboženství", value: "RELIGION", group: "content" },
  { label: "Obchod", value: "STORE", group: "content" },
  { label: "Zvířata", value: "ANIMALS", group: "content" },
  { label: "Rostliny", value: "PLANTS", group: "content" },
  { label: "Technologie", value: "TECHNOLOGIES", group: "content" },
  {
    label: "Vyberte max. 2 formální vlastnosti vaší výstavy",
    value: "--",
    group: "--",
  },
  { label: "Informatívní", value: "INFORMATIVE", group: "formal" },
  { label: "Zábavná", value: "FUNNY", group: "formal" },
  { label: "Estetická", value: "AESTHETIC", group: "formal" },
  { label: "Interaktivní", value: "INTERACTIVE", group: "formal" },
  { label: "Vzdělávací", value: "EDUCATIONAL", group: "formal" },
  { label: "English friendly", value: "ENGLISH_FRIENDLY", group: "formal" },
  { label: "Pro mobily", value: "FOR_MOBILES", group: "formal" },
  { label: "Vyberte pro koho je výstava určena", value: "--", group: "--" },
  { label: "Dospělí", value: "ADULTS", group: "target" },
  { label: "Senioří", value: "SENIORS", group: "target" },
  { label: "Děti", value: "CHILDREN", group: "target" },
  { label: "Teenageři", value: "TEENAGERS", group: "target" },
  { label: "Studenti", value: "STUDENTS", group: "target" },
  { label: "Odborníci", value: "EXPERTS", group: "target" },
  { label: "Rodina", value: "FAMILY", group: "target" },
] as const;

// - - -

// 44 total values with '--'
type AllTagValues = typeof tagsOptions[number]["value"];
export type TagValues = Exclude<AllTagValues, "--">;

type AllTagGroups = typeof tagsOptions[number]["group"];
export type TagGroups = Exclude<AllTagGroups, "--">;

// - - -

export const getTagLabelFromValue = (tagValue: TagValues) => {
  const found = tagsOptions.find((tagOption) => tagOption.value === tagValue);
  if (!found) {
    return null;
  }
  return found.label;
};

const getTagGroupFromValue = (tagValue: TagValues) => {
  const found = tagsOptions.find((tagOption) => tagOption.value === tagValue);
  if (!found) {
    return null;
  }
  return found.group;
};

export const canSetNewTags = (selectedTagsValues: TagValues[] | string) => {
  if (typeof selectedTagsValues === "string") {
    return true;
  }

  const length = selectedTagsValues.length;
  if (length === 0) {
    return true;
  }

  const lastItemValue = selectedTagsValues[length - 1];
  const lastItemGroup = getTagGroupFromValue(lastItemValue);
  if (!lastItemGroup || lastItemGroup === "--") {
    return false;
  }

  // Check for maximum 1 content tag
  if (lastItemGroup === "content") {
    const filteredContent = selectedTagsValues.filter((tagValue) => {
      const tagGroup = getTagGroupFromValue(tagValue);
      return tagGroup === "content";
    });

    const contentLength = filteredContent.length;

    if (contentLength > 1) {
      return false;
    }
  }

  // Check for maximum 2 formal tags
  if (lastItemGroup === "formal") {
    const formalLength = selectedTagsValues.filter((tagValue) => {
      const tagGroup = getTagGroupFromValue(tagValue);
      return tagGroup === "formal";
    }).length;

    if (formalLength > 2) {
      return false;
    }
  }

  return true;
};
