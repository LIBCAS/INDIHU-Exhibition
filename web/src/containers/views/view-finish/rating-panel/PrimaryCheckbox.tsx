import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

import { FormControlLabel, Checkbox } from "@mui/material";
import { Square as SquareIcon } from "@mui/icons-material";

type PrimaryCheckboxProps = {
  label: string;
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
};

const PrimaryCheckbox = ({
  label,
  isChecked,
  setIsChecked,
  disabled = false,
}: PrimaryCheckboxProps) => {
  const { isLightMode, palette } = useExpoDesignData();

  return (
    <FormControlLabel
      label={label}
      control={
        <Checkbox
          checkedIcon={<SquareIcon />}
          checked={isChecked}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setIsChecked(event.target.checked);
          }}
        />
      }
      disabled={disabled}
      sx={{
        "& .MuiSvgIcon-root": {
          fontSize: "22px",
          color: isLightMode ? undefined : palette["white"],
        },
        "& .Mui-checked": {
          "& .MuiSvgIcon-root": {
            color: palette["primary"],
            fontSize: "22px",
            padding: "4px",
            border: `1px solid ${palette.primary}`,
            borderRadius: "5%",
          },
        },
        "& .MuiTypography-root.Mui-disabled": {
          color: isLightMode ? undefined : palette["gray"],
        },
        "& .MuiButtonBase-root.MuiCheckbox-root.Mui-disabled": {
          "& .MuiSvgIcon-root": {
            color: isLightMode ? undefined : palette["gray"],
          },
        },
      }}
    />
  );
};

export default PrimaryCheckbox;
