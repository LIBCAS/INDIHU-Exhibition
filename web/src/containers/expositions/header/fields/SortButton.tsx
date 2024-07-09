import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { ExpositionsFilterStateObj } from "containers/expositions/Expositions";
import { Button } from "components/button/button";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

type SortButtonProps = {
  expositionsFilterState: ExpositionsFilterStateObj;
  setExpositionsFilterState: Dispatch<
    SetStateAction<ExpositionsFilterStateObj>
  >;
};

const SortButton = ({
  expositionsFilterState,
  setExpositionsFilterState,
}: SortButtonProps) => {
  const { t } = useTranslation("exhibitions-page");

  return (
    <Button
      onClick={async () => {
        const currOrder = expositionsFilterState.order;
        setExpositionsFilterState((prev) => ({
          ...prev,
          order: currOrder === "ASC" ? "DESC" : "ASC",
        }));
      }}
      tooltip={{
        id: "filter-tooltip",
        content:
          expositionsFilterState.order === "ASC"
            ? t("header.sortTooltipASC")
            : t("header.sortTooltipDESC"),
        variant: "dark",
        place: "bottom",
      }}
    >
      {expositionsFilterState.order === "ASC" ? (
        <ArrowDownwardIcon
          sx={{ fontSize: "24px", color: "rgba(0, 0, 0, 0.54)" }}
        />
      ) : (
        <ArrowUpwardIcon
          sx={{ fontSize: "24px", color: "rgba(0, 0, 0, 0.54)" }}
        />
      )}
    </Button>
  );
};

export default SortButton;
