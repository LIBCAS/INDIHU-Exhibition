import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import SelectField from "react-md/lib/SelectFields";
import { ExpositionFilter } from "models";
import { ExpositionsFilterStateObj } from "containers/expositions/Expositions";

type FilterSelectFieldProps = {
  expositionsFilterState: ExpositionsFilterStateObj;
  setExpositionsFilterState: Dispatch<
    SetStateAction<ExpositionsFilterStateObj>
  >;
};

const FilterSelectField = ({
  expositionsFilterState,
  setExpositionsFilterState,
}: FilterSelectFieldProps) => {
  const { t } = useTranslation("exhibitions-page");

  return (
    <div className="flex-header-row">
      <p className="flex-header-text">{t("header.filterLabel")}</p>
      <SelectField
        id="expositions-selectfield-filter"
        className="flex-header-select"
        menuItems={[
          { label: t("header.filterOptions.all"), value: "ALL" },
          {
            label: t("header.filterOptions.authorship"),
            value: "AUTHORSHIP",
          },
          { label: t("header.filterOptions.readOnly"), value: "READ_ONLY" },
          { label: t("header.filterOptions.readWrite"), value: "READ_WRITE" },
        ]}
        itemLabel="label"
        itemValue="value"
        position="below"
        value={expositionsFilterState.filter}
        onChange={async (newFilterValue: ExpositionFilter) => {
          setExpositionsFilterState((prev) => ({
            ...prev,
            filter: newFilterValue,
            page: 0,
            pageSize: 10,
          }));
        }}
      />
    </div>
  );
};

export default FilterSelectField;
