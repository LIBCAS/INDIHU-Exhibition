import { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
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
import Button from "react-md/lib/Buttons/Button";

// Models
import { ActiveExpo } from "models";
import { AppDispatch } from "store/store";

// Actions and utils
import { tagsOptions, TagValues } from "./tags-options";
import {
  getTagLabelFromValue,
  canSetNewTags,
  sortTagValues,
} from "./tags-utils";

import { updateExpo } from "actions/expoActions";
import { isEmpty } from "lodash";
import { useActiveExpoAccess } from "context/active-expo-access-provider/active-expo-access-provider";

// - - - - - - - -

type TagsSelectProps = {
  activeExpo: ActiveExpo;
};

const TagsSelect = ({ activeExpo }: TagsSelectProps) => {
  const { t } = useTranslation("expo");
  const dispatch = useDispatch<AppDispatch>();

  const { isReadWriteAccess } = useActiveExpoAccess();

  const [tags, setTags] = useState<TagValues[]>(() => activeExpo?.tags ?? []);
  const [tagsErrMsg, setTagsErrMsg] = useState<string>("");

  const ref = useRef<HTMLElement | null>(null);

  const sortedTags = useMemo(() => sortTagValues(tags), [tags]);

  // - -

  useEffect(() => {
    if (isEmpty(activeExpo)) {
      return;
    }
    if (activeExpo?.tags && activeExpo.tags.length > 0) {
      setTags(activeExpo.tags);
    }
  }, [activeExpo]);

  const saveTags = async () => {
    if (isEmpty(activeExpo)) {
      return;
    }

    const resp = await dispatch(updateExpo({ ...activeExpo, tags: tags }));
    if (!resp) {
      console.error("Failed to save the tags");
      setTagsErrMsg("Tagy se nepodařilo uložit");
    }
    if (resp) {
      setTagsErrMsg("");
    }
  };

  // - -

  return (
    <div className="flex flex-col gap-2">
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
          {t("settingsAndSharing.tagsInfoLabel")}
        </InputLabel>
        <Select
          inputRef={ref}
          labelId="tags-select-label"
          id="tags-selection"
          multiple
          value={sortedTags}
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
                    label={t(getTagLabelFromValue(tagValue) ?? "")}
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
            "& .MuiSelect-standard": {
              paddingBottom: "8px",
              paddingTop: "6px",
            },
            "& .MuiInput-input:focus": {
              backgroundColor: "transparent",
            },
            ":after": { borderBottomColor: "#083d77" },
          }}
          error={tagsErrMsg !== ""}
        >
          {tagsOptions.map((tagOption) => {
            if (tagOption.value === "--") {
              return (
                <ListSubheader key={tagOption.label}>
                  {t(tagOption.label)}
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
                {t(tagOption.label)}
              </MenuItem>
            );
          })}
        </Select>

        {tagsErrMsg !== "" && (
          <FormHelperText error={true}>{tagsErrMsg}</FormHelperText>
        )}
      </FormControl>

      {/* Save button */}
      <div className="flex justify-end items-center">
        <Button
          raised
          label={t("settingsAndSharing.saveLabel")}
          onClick={saveTags}
          disabled={!isReadWriteAccess}
        />
      </div>
    </div>
  );
};

export default TagsSelect;
