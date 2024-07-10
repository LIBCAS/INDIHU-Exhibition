import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import SelectField from "react-md/lib/SelectFields";
import { ExpositionSort } from "models";
import { ExpositionsFilterStateObj } from "containers/expositions/Expositions";

type SortSelectFieldProps = {
  expositionsFilterState: ExpositionsFilterStateObj;
  setExpositionsFilterState: Dispatch<
    SetStateAction<ExpositionsFilterStateObj>
  >;
};

const SortSelectField = ({
  expositionsFilterState,
  setExpositionsFilterState,
}: SortSelectFieldProps) => {
  const { t } = useTranslation("exhibitions-page");

  return (
    <div className="flex-header-row">
      <p className="flex-header-text">{t("header.sortLabel")}</p>
      <SelectField
        id="expositions-selectfield-filter2"
        className="flex-header-select"
        menuItems={[
          { label: t("header.sortOptions.title"), value: "title" },
          { label: t("header.sortOptions.state"), value: "state" },
          { label: t("header.sortOptions.created"), value: "created" },
          { label: t("header.sortOptions.edited"), value: "edited" },
          { label: t("header.sortOptions.isEditing"), value: "isEditing" },
        ]}
        itemLabel="label"
        itemValue="value"
        position="below"
        value={expositionsFilterState.sort}
        onChange={async (newSortValue: ExpositionSort) => {
          setExpositionsFilterState((prev) => ({
            ...prev,
            sort: newSortValue,
          }));
        }}
      />
    </div>
  );
};

export default SortSelectField;
