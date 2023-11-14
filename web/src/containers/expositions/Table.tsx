import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import ExpoMenu from "./ExpoMenu";

import { ExpositionItem, ExpositionFilterObj } from "models";
import { AppDispatch } from "store/store";

import cx from "classnames";
import { formatDate, formatTime } from "utils";
import { setExpoFilter } from "actions/expoActions";
import { useTranslation } from "react-i18next";
import { Rating } from "@mui/material";
import { getPreferenceText } from "./utils";

type TableProps = {
  expositions: ExpositionItem[];
  filter: ExpositionFilterObj;
};

const Table = ({ expositions, filter }: TableProps) => {
  const { t } = useTranslation(["exhibitions-page", "expo"]);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <table className="table-all">
      {/* Table header */}
      <thead>
        <tr className="table-all-row header">
          <td
            className={cx("table-all-col sort", {
              active: filter.sort === "title",
            })}
            onClick={() => {
              dispatch(
                setExpoFilter(
                  filter.filter,
                  "title",
                  filter.search,
                  filter.order
                )
              );
            }}
          >
            {t("expoTable.name")}
          </td>

          <td
            className={cx("table-all-col sort", {
              active: filter.sort === "state",
            })}
            onClick={() => {
              dispatch(
                setExpoFilter(
                  filter.filter,
                  "state",
                  filter.search,
                  filter.order
                )
              );
            }}
          >
            {t("expoTable.state")}
          </td>

          <td
            className={cx("table-all-col sort", {
              active: filter.sort === "created",
            })}
            onClick={() => {
              dispatch(
                setExpoFilter(
                  filter.filter,
                  "created",
                  filter.search,
                  filter.order
                )
              );
            }}
          >
            {t("expoTable.created")}
          </td>

          <td>{t("expoTable.author")}</td>

          <td
            className={cx("table-all-col sort", {
              active: filter.sort === "updated",
            })}
            onClick={() => {
              dispatch(
                setExpoFilter(
                  filter.filter,
                  "updated",
                  filter.search,
                  filter.order
                )
              );
            }}
          >
            {t("expoTable.updated")}
          </td>

          <td
            className={cx("table-all-col sort", {
              active: filter.sort === "isEditing",
            })}
            onClick={() => {
              dispatch(
                setExpoFilter(
                  filter.filter,
                  "isEditing",
                  filter.search,
                  filter.order
                )
              );
            }}
          >
            {t("expoTable.lastEditedBy")}
          </td>

          <td>{t("expoTable.averageRating")}</td>
          <td>{t("expoTable.commentsCount")}</td>
          <td>{t("expoTable.bestRatedPreference")}</td>

          <td className="table-all-col actions">{t("expoTable.actions")}</td>
        </tr>
      </thead>

      {/* Table body as other exposition rows */}
      <tbody>
        {expositions?.map((expoItem, idx) => (
          <ExpoItemTableRow key={idx} expoItem={expoItem} expoItemIndex={idx} />
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
};

const ExpoItemTableRow = ({
  expoItem,
  expoItemIndex,
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
        <ExpoMenu key={expoItemIndex} expositionItem={expoItem} />
      </td>
    </tr>
  );
};
