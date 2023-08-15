import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

import {
  TagValues,
  getTagLabelFromValue,
} from "containers/expo-administration/expo-settings/tags-options";

import cx from "classnames";

// - - -

interface TagsListProps {
  tags: TagValues[];
}

const TagsList = ({ tags }: TagsListProps) => {
  const { expoDesignData, isLightMode } = useExpoDesignData();

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tagValue) => (
        <div
          key={tagValue}
          className={cx("bg-black text-white px-2 py-1 rounded-md", {
            "bg-black": isLightMode,
            "bg-gray": !isLightMode,
          })}
          style={{ backgroundColor: expoDesignData?.tagsColor }}
        >
          {getTagLabelFromValue(tagValue)}
        </div>
      ))}
    </div>
  );
};

export default TagsList;
