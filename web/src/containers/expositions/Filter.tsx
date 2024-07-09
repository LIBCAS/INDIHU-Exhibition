import { Dispatch, SetStateAction } from "react";
import { ExpositionsFilterStateObj } from "./Expositions";

import FilterSelectField from "./filters/old/FilterSelectField";
import SortSelectField from "./filters/old/SortSelectField";
import SortButton from "./filters/SortButton";
import SearchTextField from "./filters/old/SearchTextField";

// - -

type FilterProps = {
  expositionsFilterState: ExpositionsFilterStateObj;
  setExpositionsFilterState: Dispatch<
    SetStateAction<ExpositionsFilterStateObj>
  >;
};

const Filter = ({
  expositionsFilterState,
  setExpositionsFilterState,
}: FilterProps) => {
  return (
    <div className="flex-header-actions gap-4">
      <FilterSelectField
        expositionsFilterState={expositionsFilterState}
        setExpositionsFilterState={setExpositionsFilterState}
      />

      <SortSelectField
        expositionsFilterState={expositionsFilterState}
        setExpositionsFilterState={setExpositionsFilterState}
      />

      <SortButton
        expositionsFilterState={expositionsFilterState}
        setExpositionsFilterState={setExpositionsFilterState}
      />

      <SearchTextField
        expositionsFilterState={expositionsFilterState}
        setExpositionsFilterState={setExpositionsFilterState}
      />
    </div>
  );
};

export default Filter;
