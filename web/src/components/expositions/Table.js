import React from "react";
import { connect } from "react-redux";
import { map, get } from "lodash";
import classNames from "classnames";

import ExpoMenu from "./ExpoMenu";

import { changeCollaboratorType } from "../../actions/expoActions";

import { formatTime } from "../../utils";

import { expoStateText } from "../../enums/expoState";

const Table = ({
  expositions,
  history,
  filter,
  setExpoFilter,
  getExpositions
}) => (
  <table className="table-all">
    <tr className="table-all-row header">
      <td
        className={classNames("table-all-col sort", {
          active: filter.sort === "title"
        })}
        onClick={() => {
          setExpoFilter(filter.filter, "title", filter.search, filter.order);
          getExpositions(true);
        }}
      >
        Název
      </td>
      <td
        className={classNames("table-all-col sort", {
          active: filter.sort === "state"
        })}
        onClick={() => {
          setExpoFilter(filter.filter, "state", filter.search, filter.order);
          getExpositions(true);
        }}
      >
        Stav
      </td>
      <td
        className={classNames("table-all-col sort", {
          active: filter.sort === "created"
        })}
        onClick={() => {
          setExpoFilter(filter.filter, "created", filter.search, filter.order);
          getExpositions(true);
        }}
      >
        Vytvořeno
      </td>
      <td
        className={classNames("table-all-col sort", {
          active: filter.sort === "updated"
        })}
        onClick={() => {
          setExpoFilter(filter.filter, "updated", filter.search, filter.order);
          getExpositions(true);
        }}
      >
        Poslední editace
      </td>
      <td
        className={classNames("table-all-col sort", {
          active: filter.sort === "isEditing"
        })}
        onClick={() => {
          setExpoFilter(
            filter.filter,
            "isEditing",
            filter.search,
            filter.order
          );
          getExpositions(true);
        }}
      >
        Pravě upravováno
      </td>
      <td className="table-all-col actions">Akce</td>
    </tr>
    {map(expositions, (item, i) => (
      <tr
        className="table-all-row"
        key={i}
        onClick={() =>
          item.canEdit &&
          item.state !== "ENDED" &&
          history.push(`/expo/${item.id}/structure`)
        }
      >
        <td className="table-all-col">{get(item, "title")}</td>
        <td className="table-all-col">{expoStateText[get(item, "state")]}</td>
        <td className="table-all-col">{formatTime(get(item, "created"))}</td>
        <td className="table-all-col">{formatTime(get(item, "lastEdit"))}</td>
        <td className="table-all-col">{get(item, "isEditing")}</td>
        <td className="table-all-col select actions">
          <ExpoMenu
            id={item.id}
            title={item.title}
            canEdit={item.canEdit}
            canDelete={item.canDelete}
            url={item.url}
            state={item.state}
            inProgress={item.inProgress}
            history={history}
          />
        </td>
      </tr>
    ))}
  </table>
);

export default connect(
  null,
  { changeCollaboratorType }
)(Table);
