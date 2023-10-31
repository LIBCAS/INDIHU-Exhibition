import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import { IconButton, FormControl, Select, MenuItem } from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";

// Models
import { ExpositionPagerObj } from "models";
import { AppDispatch } from "store/store";

// Actions and utils
import { setExpoPager } from "actions/expoActions";

// - -

const pageSizeOptions = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
  // { label: "1000", value: 1000 },
];

// - -

type PagerProps = {
  expositionsCount: number;
  pager: ExpositionPagerObj;
};

const Pager = ({ expositionsCount, pager }: PagerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("exhibitions-page");

  const pgFrom = pager.page * pager.pageSize + 1;
  const currPgUpperBound = pgFrom + pager.pageSize - 1;
  const pgTo =
    expositionsCount < currPgUpperBound ? expositionsCount : currPgUpperBound;

  return (
    <div className="mt-2 p-4 w-full flex justify-center md:justify-end items-center">
      <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-5">
        <div className="flex gap-3">
          <div className="self-center">{t("pager.entriesPerPage")}</div>
          <PageSizeSelectField pager={pager} />
        </div>

        <div className="flex items-center gap-3">
          <div>
            {expositionsCount === 0
              ? "0"
              : `${pgFrom}-${pgTo} z ${expositionsCount}`}
          </div>
          <IconButton
            disabled={pager.page <= 0}
            onClick={() => {
              if (pager.page > 0) {
                dispatch(setExpoPager(pager.page - 1, pager.pageSize));
              }
            }}
          >
            <NavigateBefore sx={{ fontSize: "28px" }} />
          </IconButton>

          <IconButton
            disabled={(pager.page + 1) * pager.pageSize >= expositionsCount}
            onClick={() => {
              dispatch(setExpoPager(pager.page + 1, pager.pageSize));
            }}
          >
            <NavigateNext sx={{ fontSize: "28px" }} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Pager;

// - - -

type PageSizeSelectFieldProps = {
  pager: ExpositionPagerObj;
};

const PageSizeSelectField = ({ pager }: PageSizeSelectFieldProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const inputRef = useRef<HTMLElement | null>(null);

  return (
    <FormControl
      variant="standard"
      sx={{
        minWidth: 70,
        "& .MuiInputBase-root:before": {
          borderBottomWidth: "0px",
        },
        "& .MuiInputBase-root:after": {
          borderBottomColor: "#083d77",
        },
        "& .MuiSelect-select": {
          textAlign: "left",
          paddingLeft: "4px",
        },
        "& .MuiSelect-select.MuiInputBase-input.MuiInput-input": {
          backgroundColor: "transparent",
        },
      }}
    >
      <Select
        inputRef={inputRef}
        id="page-size-select"
        // label and labelId
        value={pager.pageSize}
        onChange={(e) => {
          const newPageSizeValue = e.target.value; // should be directly number
          if (typeof newPageSizeValue === "number") {
            dispatch(setExpoPager(pager.page, newPageSizeValue));
            inputRef.current?.focus();
          }
        }}
      >
        {pageSizeOptions.map((pageSizeOption) => (
          <MenuItem key={pageSizeOption.value} value={pageSizeOption.value}>
            {pageSizeOption.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
