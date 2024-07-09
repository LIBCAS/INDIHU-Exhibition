import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { ExpositionsFilterStateObj } from "./Expositions";

import FilterSelectField from "./filters/old/FilterSelectField";
import SortSelectField from "./filters/old/SortSelectField";
import SortButton from "./filters/SortButton";
import SearchTextField from "./filters/old/SearchTextField";

import { Checkbox, FormControlLabel } from "@mui/material";

import CardListViewButton from "./filters/CardListViewButton";
import NewExpoButton from "./filters/NewExpoButton";

// - -

type HeaderProps = {
  expositionsFilterState: ExpositionsFilterStateObj;
  setExpositionsFilterState: Dispatch<
    SetStateAction<ExpositionsFilterStateObj>
  >;
};

const Header = ({
  expositionsFilterState,
  setExpositionsFilterState,
}: HeaderProps) => {
  const { t } = useTranslation("exhibitions-page");

  const isCardList = expositionsFilterState.isCardList; // if true cards in grid, if false table
  const showOnlyPinned = expositionsFilterState.showOnlyPinned; // if true, do not display filtration header, since it is not possible to filtrate pinned expos in BE currently

  return (
    <div className="flex-header">
      <h2 className="flex-header-title">{t("header.title")}</h2>
      {!showOnlyPinned && (
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
      )}

      {/* New expo button if table + Cardslist icon button */}
      <div className="flex-row flex-space-between flex-center">
        <NewExpoButton isCardList={isCardList} />

        <div className="flex items-center gap-2">
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

          <CardListViewButton
            setExpositionsFilterState={setExpositionsFilterState}
            isCardList={isCardList}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
