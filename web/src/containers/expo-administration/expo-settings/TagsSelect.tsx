import { useRef, Dispatch, SetStateAction } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  MenuItem,
  SelectChangeEvent,
  ListSubheader,
  Box,
  Chip,
} from "@mui/material";

import {
  tagsOptions,
  TagValues,
  canSetNewTags,
  getTagLabelFromValue,
} from "./tags-options";

// - - - - - - - -

interface TagsSelectProps {
  tags: TagValues[];
  setTags: Dispatch<SetStateAction<TagValues[]>>;
  tagsErrorMsg: string;
}

const TagsSelect = ({ tags, setTags, tagsErrorMsg }: TagsSelectProps) => {
  const ref = useRef<HTMLElement | null>(null);

  return (
    <FormControl variant="standard" fullWidth>
      <InputLabel
        id="tags-select-label"
        sx={{
          color: "rgba(0, 0, 0, 0.54)",
          fontSize: "13px",
          fontFamily: "Work Sans",
          "&.MuiInputLabel-shrink": {
            color: "rgba(0, 0, 0, 0.54)",
            fontSize: "15px",
          },
          "&.Mui-focused": {
            color: "#083d77",
            fontSize: "15px",
          },
        }}
      >
        Zvolené tagy pro výstavu
      </InputLabel>
      <Select
        inputRef={ref}
        labelId="tags-select-label"
        id="tags-selection"
        multiple
        value={tags}
        onChange={(event: SelectChangeEvent<typeof tags>) => {
          const newTags = event.target.value; // new selected value is part of array
          const can = canSetNewTags(newTags);
          if (can === false) {
            return;
          }

          setTags(
            typeof newTags === "string"
              ? (newTags.split(",") as TagValues[])
              : newTags
          );
        }}
        renderValue={(selectedTags) => {
          return (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selectedTags.map((tagValue) => (
                <Chip
                  key={tagValue}
                  label={getTagLabelFromValue(tagValue) ?? tagValue}
                  variant="outlined"
                  onDelete={() => {
                    const newTags = tags.filter((tag) => tag !== tagValue);
                    setTags(newTags);
                    ref.current?.focus();
                  }}
                  // in order to onDelete handler works properly
                  onMouseDown={(event) => {
                    event.stopPropagation();
                  }}
                />
              ))}
            </Box>
          );
        }}
        MenuProps={{ style: { maxHeight: "50vh" } }}
        sx={{
          "& .MuiSelect-standard": { paddingBottom: "8px", paddingTop: "6px" },
          "& .MuiInput-input:focus": {
            backgroundColor: "transparent",
          },
          ":after": { borderBottomColor: "#083d77" },
        }}
        error={tagsErrorMsg !== ""}
      >
        {tagsOptions.map((tagOption) => {
          if (tagOption.value === "--") {
            return (
              <ListSubheader key={tagOption.label}>
                {tagOption.label}
              </ListSubheader>
            );
          }
          return (
            <MenuItem
              key={tagOption.value}
              value={tagOption.value}
              style={{
                fontWeight:
                  tags.indexOf(tagOption.value) === -1 ? undefined : 700,
              }}
            >
              {tagOption.label}
            </MenuItem>
          );
        })}
      </Select>

      {tagsErrorMsg !== "" && (
        <FormHelperText error={true}>{tagsErrorMsg}</FormHelperText>
      )}
    </FormControl>
  );
};

export default TagsSelect;
