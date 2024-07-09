import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { ExpositionsFilterStateObj } from "containers/expositions/Expositions";
import TextField from "react-md/lib/TextFields";
import FontIcon from "react-md/lib/FontIcons";

type SearchTextFieldProps = {
  expositionsFilterState: ExpositionsFilterStateObj;
  setExpositionsFilterState: Dispatch<
    SetStateAction<ExpositionsFilterStateObj>
  >;
};

const SearchTextField = ({
  expositionsFilterState,
  setExpositionsFilterState,
}: SearchTextFieldProps) => {
  const { t } = useTranslation("exhibitions-page");
  return (
    <div className="search">
      <TextField
        id="expositions-filter-textfield-search"
        placeholder={t("header.searchPlaceholder")}
        className="search-input"
        defaultValue={expositionsFilterState.search}
        onChange={async (newSearchValue: string) => {
          setExpositionsFilterState((prev) => ({
            ...prev,
            search: newSearchValue,
            page: 0,
            pageSize: 10,
          }));
        }}
      />
      <FontIcon className="search-icon">search</FontIcon>
    </div>
  );
};

export default SearchTextField;
