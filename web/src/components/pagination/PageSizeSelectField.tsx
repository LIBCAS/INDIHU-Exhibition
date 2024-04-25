import { useRef } from "react";

// Components
import { FormControl, Select, MenuItem } from "@mui/material";

// - -

const pageSizeOptions = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
  // { label: "1000", value: 1000 },
];

// - - -

// Currently as only "controlled" mode
type PageSizeSelectFieldProps = {
  value: number;
  onChange: (newValue: number) => void;
  id: string;
  label?: string;
};

export const PageSizeSelectField = ({
  value,
  onChange,
  id,
  label,
}: PageSizeSelectFieldProps) => {
  const inputRef = useRef<HTMLElement | null>(null);

  return (
    <div className="flex gap-3">
      {label && <div className="self-center">{label}</div>}

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
          id={id}
          label={label}
          value={value}
          onChange={(e) => {
            const newPageSizeValue = e.target.value; // should be directly number
            if (typeof newPageSizeValue === "number") {
              onChange(newPageSizeValue);
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
    </div>
  );
};
