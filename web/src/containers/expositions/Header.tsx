import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { Button, FontIcon } from "react-md";
import { Tooltip } from "react-tooltip";
import Filter from "./Filter";

import { ExpositionPagerObj } from "models";
import { AppDispatch } from "store/store";

import { changeExpositionsViewType, setExpoPager } from "actions/expoActions";
import { setDialog } from "actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";

// - -

type HeaderProps = {
  cardsList: boolean; // if true cards in grid, if false table
  pager: ExpositionPagerObj;
};

const Header = ({ cardsList, pager }: HeaderProps) => {
  const { t } = useTranslation("exhibitions-page");
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex-header">
      <h2 className="flex-header-title">{t("header.title")}</h2>
      <Filter />

      {/* New expo button if table + Cardslist icon button */}
      <div className="flex-row flex-space-between flex-center">
        {!cardsList && (
          <Button
            raised={true}
            label={t("expoTable.createNewExpo")}
            onClick={() => dispatch(setDialog(DialogType.ExpoNew, {}))}
          >
            <FontIcon>add</FontIcon>
          </Button>
        )}

        {cardsList && <div />}

        <Button
          icon
          onClick={() => {
            dispatch(changeExpositionsViewType(!cardsList));
            dispatch(setExpoPager(0, pager.pageSize)); // reset back to first page
          }}
          data-tooltip-id="expositions-filter-react-tooltip-order"
          data-tooltip-content={
            cardsList ? t("header.tooltipList") : t("header.tooltipGrid")
          }
        >
          {cardsList ? "view_list" : "view_module"}
        </Button>
        <Tooltip
          id="expositions-filter-react-tooltip-order"
          className="infopoint-tooltip"
          variant="dark"
          float={false}
          place="bottom"
        />
      </div>
    </div>
  );
};

export default Header;
