import { Dispatch, SetStateAction } from "react";

import { useTranslation } from "react-i18next";

import { Tooltip } from "react-tooltip";

import SelectField from "react-md/lib/SelectFields";
import TextField from "react-md/lib/TextFields";
import FontIcon from "react-md/lib/FontIcons";
import Button from "react-md/lib/Buttons/Button";

import { ExpositionFilter, ExpositionSort } from "models";
import { ExpositionsFilterStateObj } from "./Expositions";

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
  const { t } = useTranslation("exhibitions-page");

  return (
    <div className="flex-header-actions gap-4">
      {/* 1. Filter for filter  */}
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

      {/* Filter for sort */}
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

      {/* Filter for order and search */}
      <div className="flex-header-row with-search">
        <div className="button-with-tooltip">
          <Button
            icon
            data-tooltip-id="filter-tooltip"
            data-tooltip-content={
              expositionsFilterState.order === "ASC"
                ? t("header.sortTooltipASC")
                : t("header.sortTooltipDESC")
            }
            onClick={async () => {
              const currOrder = expositionsFilterState.order;
              setExpositionsFilterState((prev) => ({
                ...prev,
                order: currOrder === "ASC" ? "DESC" : "ASC",
              }));
            }}
          >
            {expositionsFilterState.order === "ASC"
              ? "arrow_downward"
              : "arrow_upward"}
          </Button>
          <Tooltip
            id="filter-tooltip"
            className="infopoint-tooltip"
            variant="dark"
            float={false}
            place="bottom"
          />
        </div>

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
      </div>
    </div>
  );
};

export default Filter;
