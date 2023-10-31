import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import ExpoMenu from "./ExpoMenu";

import { ExpositionItem, ExpositionFilterObj } from "models";
import { AppDispatch } from "store/store";

import cx from "classnames";
import { formatDate, formatTime } from "utils";
import { setExpoFilter } from "actions/expoActions";
import { useTranslation } from "react-i18next";

type TableProps = {
  expositions: ExpositionItem[];
  filter: ExpositionFilterObj;
};

const Table = ({ expositions, filter }: TableProps) => {
  const { t } = useTranslation(["exhibitions-page", "expo"]);

  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();

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

          <td className="table-all-col actions">{t("expoTable.actions")}</td>
        </tr>
      </thead>

      {/* Table body as pther exposition rows */}
      <tbody>
        {expositions?.map((expoItem, idx) => (
          <tr
            key={idx}
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
            <td className="table-all-col select actions">
              <ExpoMenu key={idx} expositionItem={expoItem} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
