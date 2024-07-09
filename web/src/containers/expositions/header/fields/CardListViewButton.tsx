import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { ExpositionsFilterStateObj } from "containers/expositions/Expositions";
import { Button } from "components/button/button";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";

type CardListViewButtonProps = {
  setExpositionsFilterState: Dispatch<
    SetStateAction<ExpositionsFilterStateObj>
  >;
  isCardList: boolean;
};

const CardListViewButton = ({
  setExpositionsFilterState,
  isCardList,
}: CardListViewButtonProps) => {
  const { t } = useTranslation("exhibitions-page");

  return (
    <Button
      onClick={() => {
        setExpositionsFilterState((prev) => ({
          ...prev,
          isCardList: !isCardList,
          page: 0,
        })); // reset back to first page
      }}
      tooltip={{
        id: "expositions-filter-react-tooltip-order",
        content: isCardList ? t("header.tooltipList") : t("header.tooltipGrid"),
        variant: "dark",
        place: "bottom",
      }}
    >
      {isCardList ? (
        <ViewListIcon sx={{ fontSize: "24px", color: "rgba(0, 0, 0, 0.54)" }} />
      ) : (
        <ViewModuleIcon
          sx={{ fontSize: "24px", color: "rgba(0, 0, 0, 0.54)" }}
        />
      )}
    </Button>
  );
};

export default CardListViewButton;
