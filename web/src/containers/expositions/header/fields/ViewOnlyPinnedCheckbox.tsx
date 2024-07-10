import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { ExpositionsFilterStateObj } from "containers/expositions/Expositions";
import { Checkbox, FormControlLabel } from "@mui/material";

type SortButtViewOnlyPinnedCheckboxProps = {
  expositionsFilterState: ExpositionsFilterStateObj;
  setExpositionsFilterState: Dispatch<
    SetStateAction<ExpositionsFilterStateObj>
  >;
};

const ViewOnlyPinnedCheckbox = ({
  expositionsFilterState,
  setExpositionsFilterState,
}: SortButtViewOnlyPinnedCheckboxProps) => {
  const { t } = useTranslation("exhibitions-page");

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={expositionsFilterState.showOnlyPinned}
          onChange={(e) => {
            const newValue = e.target.checked;
            setExpositionsFilterState((prev) => ({
              ...prev,
              showOnlyPinned: newValue,
            }));
          }}
        />
      }
      label={t("header.showOnlyPinnedLabel")}
    />
  );
};

export default ViewOnlyPinnedCheckbox;
