import { useMemo, Dispatch, SetStateAction } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Components
import ExpoMenu from "./ExpoMenu";
import { Rating } from "@mui/material";

// Models
import { ExpositionItem } from "models";
import { ExpositionsFilterStateObj } from "./Expositions";

// Utils
import cx from "classnames";
import { formatDate, formatTime } from "utils";
import { getPreferenceText } from "./utils";

// - -

type TableProps = {
  expositions: ExpositionItem[];
  expositionsFilterState: ExpositionsFilterStateObj;
  setExpositionsFilterState: Dispatch<
    SetStateAction<ExpositionsFilterStateObj>
  >;
};

const Table = ({
  expositions,
  expositionsFilterState,
  setExpositionsFilterState,
}: TableProps) => {
  const { t } = useTranslation(["exhibitions-page", "expo"]);

  return (
    <table className="table-all">
      {/* Table header */}
      <thead>
        <tr className="table-all-row header">
          <td
            className={cx("table-all-col sort", {
              active: expositionsFilterState.sort === "title",
            })}
            onClick={() => {
              setExpositionsFilterState((prev) => ({ ...prev, sort: "title" }));
            }}
          >
            {t("expoTable.name")}
          </td>

          <td
            className={cx("table-all-col sort", {
              active: expositionsFilterState.sort === "state",
            })}
            onClick={() => {
              setExpositionsFilterState((prev) => ({ ...prev, sort: "state" }));
            }}
          >
            {t("expoTable.state")}
          </td>

          <td
            className={cx("table-all-col sort", {
              active: expositionsFilterState.sort === "created",
            })}
            onClick={() => {
              setExpositionsFilterState((prev) => ({
                ...prev,
                sort: "created",
              }));
            }}
          >
            {t("expoTable.created")}
          </td>

          <td>{t("expoTable.author")}</td>

          <td
            className={cx("table-all-col sort", {
              active: expositionsFilterState.sort === "edited",
            })}
            onClick={() => {
              setExpositionsFilterState((prev) => ({
                ...prev,
                sort: "edited",
              }));
            }}
          >
            {t("expoTable.updated")}
          </td>

          <td
            className={cx("table-all-col sort", {
              active: expositionsFilterState.sort === "isEditing",
            })}
            onClick={() => {
              setExpositionsFilterState((prev) => ({
                ...prev,
                sort: "isEditing",
              }));
            }}
          >
            {t("expoTable.lastEditedBy")}
          </td>

          <td className="table-all-col">{t("expoTable.averageRating")}</td>
          <td className="table-all-col">{t("expoTable.commentsCount")}</td>
          <td className="table-all-col">
            {t("expoTable.bestRatedPreference")}
          </td>

          <td className="table-all-col actions">{t("expoTable.actions")}</td>
        </tr>
      </thead>

      {/* Table body as other exposition rows */}
      <tbody>
        {expositions?.map((expoItem, idx) => (
          <ExpoItemTableRow
            key={idx}
            expoItem={expoItem}
            expoItemIndex={idx}
            expositionsFilterState={expositionsFilterState}
          />
        ))}
      </tbody>
    </table>
  );
};

export default Table;

// - - -

type ExpoItemTableRowProps = {
  expoItem: ExpositionItem;
  expoItemIndex: number;
  expositionsFilterState: ExpositionsFilterStateObj;
};

const ExpoItemTableRow = ({
  expoItem,
  expoItemIndex,
  expositionsFilterState,
}: ExpoItemTableRowProps) => {
  const { t } = useTranslation(["exhibitions-page", "expo"]);
  const history = useHistory();

  const prefText = useMemo(
    () => getPreferenceText(expoItem.preferences, t),
    [expoItem.preferences, t]
  );

  return (
    <tr
      className="table-all-row"
      onClick={() => {
        if (expoItem.state !== "ENDED" && expoItem.canEdit) {
          history.push(`/expo/${expoItem.id}/structure`);
        }
      }}
    >
      <td className="table-all-col">{expoItem.title ?? "title"}</td>
      <td className="table-all-col">
        {t(`expoState.${expoItem.state.toLowerCase()}`, { ns: "expo" })}
      </td>
      <td className="table-all-col">{formatDate(expoItem.created)}</td>
      <td className="table-all-col">{expoItem.authorUsername}</td>
      <td className="table-all-col">{formatTime(expoItem.lastEdit)}</td>
      <td className="table-all-col">{expoItem.isEditing}</td>
      <td className="table-all-col">
        {expoItem.rating ? (
          <Rating defaultValue={expoItem.rating} precision={0.1} readOnly />
        ) : (
          <div className="italic">{t("expoCard.noAverageRatingYet")}</div>
        )}
      </td>
      <td className="table-all-col">{expoItem.messageCount ?? 0}</td>
      <td className={cx("table-all-col", { italic: !prefText })}>
        {prefText ?? t("expoCard.noBestRatedPreferenceYet")}
      </td>
      <td className="table-all-col select actions">
        <ExpoMenu
          key={expoItemIndex}
          expositionItem={expoItem}
          expositionsFilterState={expositionsFilterState}
        />
      </td>
    </tr>
  );
};
