import { useTranslation } from "react-i18next";

import classNames from "classnames";
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";

import {
  screenTypeIcon,
  mapScreenTypeValuesToKeys,
} from "../../../enums/screen-type";

const ScreenDraggedCard = ({ rowNum, colNum, data, onClickEnabled }) => {
  const { t } = useTranslation("expo");

  const number =
    rowNum === null || colNum === null
      ? ""
      : ` ${rowNum + 1}${colNum > 0 ? `.${colNum} ` : " "}`;
  const header = data
    ? `${
        data.title ||
        t(
          `structure.screenLabels.${mapScreenTypeValuesToKeys[
            data.type
          ].toLowerCase()}`
        )
      }`
    : "";

  return (
    <Card
      id="expo-structure-dragged-card"
      style={{ cursor: "move" }}
      className={classNames("card dragged-card", {
        green: data && data.screenCompleted,
        animate: !onClickEnabled,
      })}
    >
      {data && (
        <i
          className={`structure-screen-card-icon fa ${
            screenTypeIcon[mapScreenTypeValuesToKeys[data.type]]
          }`}
        />
      )}
      <CardText className="card-screen">
        <p style={{ wordWrap: "break-word" }}>
          {number}
          {header}
        </p>
      </CardText>
    </Card>
  );
};

export default ScreenDraggedCard;
