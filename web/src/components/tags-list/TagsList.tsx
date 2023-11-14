import { useMemo } from "react";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";
import { useTranslation } from "react-i18next";

import { TagValues } from "containers/expo-administration/expo-settings/tags/tags-options";
import {
  getTagLabelFromValue,
  sortTagValues,
} from "containers/expo-administration/expo-settings/tags/tags-utils";

import cx from "classnames";

// - - -

interface TagsListProps {
  tags: TagValues[];
}

const TagsList = ({ tags }: TagsListProps) => {
  const { t } = useTranslation("expo");
  const { expoDesignData, isLightMode } = useExpoDesignData();
  const sortedTags = useMemo(() => sortTagValues(tags), [tags]);

  return (
    <div className="flex flex-wrap gap-2">
      {sortedTags.map((tagValue) => (
        <div
          key={tagValue}
          className={cx("bg-black text-white px-2 py-1 rounded-md", {
            "bg-black": isLightMode,
            "bg-gray": !isLightMode,
          })}
          style={{ backgroundColor: expoDesignData?.tagsColor }}
        >
          {t(getTagLabelFromValue(tagValue) ?? "")}
        </div>
      ))}
    </div>
  );
};

export default TagsList;
