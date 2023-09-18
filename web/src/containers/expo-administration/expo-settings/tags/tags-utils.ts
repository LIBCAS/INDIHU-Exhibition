import { tagsOptions, TagValues, TagGroups } from "./tags-options";

// - -

export const getTagLabelFromValue = (tagValue: TagValues) => {
  const found = tagsOptions.find((tagOption) => tagOption.value === tagValue);
  if (!found) {
    return null;
  }
  return found.label;
};

export const getTagGroupFromValue = (tagValue: TagValues) => {
  const found = tagsOptions.find((tagOption) => tagOption.value === tagValue);
  if (!found) {
    return null;
  }
  return found.group;
};

// - -

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

// - -

const tagsGroupOrder: Record<TagGroups, number> = {
  content: 1,
  formal: 2,
  target: 3,
};

export const sortTagValues = (tagValues: TagValues[]) => {
  const tags = tagValues.map((tag) => ({
    label: getTagLabelFromValue(tag) as string,
    value: tag,
    group: getTagGroupFromValue(tag) as TagGroups,
  }));

  // In-place stable sorting, sorted tag labels within groups
  const collator = new Intl.Collator("cs");
  tags.sort((obj1, obj2) => collator.compare(obj1.label, obj2.label));
  tags.sort(
    (obj1, obj2) => tagsGroupOrder[obj1.group] - tagsGroupOrder[obj2.group]
  );

  // const sortedTags = sortBy(tags, [
  //   (t) => tagsGroupOrder[t.group],
  //   (t) => t.label,
  // ]);

  const extractedValues = tags.map((t) => t.value);
  return extractedValues;
};
