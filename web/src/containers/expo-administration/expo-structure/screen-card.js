import { useTranslation } from "react-i18next";

import classNames from "classnames";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import { get } from "lodash";
import { Tooltip as ReactTooltip } from "react-tooltip";

import ScreenCardMenu from "./screen-card-menu";
import ScreenCardActions from "./screen-card-actions";
import {
  screenTypeIcon,
  screenUrl,
  mapScreenTypeValuesToKeys,
} from "../../../enums/screen-type";

const ScreenCard = ({
  rows,
  cols,
  rowNum,
  colNum,
  data,
  activeExpo,
  history,
  menuPosition,
  onClickEnabled,
  isDragged,
}) => {
  const { t } = useTranslation("expo");

  const number = `${rowNum + 1}${colNum > 0 ? `.${colNum}` : ""} `;
  const header = `${
    data.title ||
    t(
      `structure.screenLabels.${mapScreenTypeValuesToKeys[
        data.type
      ].toLowerCase()}`
    )
  }`;

  const cardType = data.type !== "START" && data.type !== "FINISH";
  const position = cardType
    ? `${rowNum}-${colNum}`
    : screenUrl[mapScreenTypeValuesToKeys[data.type]];
  const editUrl = `/expo/${activeExpo.id}/screen/${
    screenUrl[mapScreenTypeValuesToKeys[data.type]]
  }/${position}/description`;

  return activeExpo ? (
    <div className="card-background">
      <Card
        raise
        id={`expo-structure-screen-card-${rowNum}-${colNum}`}
        className={classNames("card", {
          green: get(data, "screenCompleted"),
          dragged: isDragged,
        })}
      >
        <i
          className={`structure-screen-card-icon fa ${
            screenTypeIcon[mapScreenTypeValuesToKeys[data.type]]
          }`}
          data-tooltip-id="expo-structure-screen-new-tooltip"
          data-tooltip-content={t(
            `structure.screenLabels.${mapScreenTypeValuesToKeys[
              data.type
            ].toLowerCase()}`
          )}
        />
        <ScreenCardMenu
          name={header}
          type={data.type}
          rowNum={rowNum}
          colNum={colNum}
          cardType={cardType}
          viewUrl={activeExpo.url}
          editUrl={editUrl}
          expoId={activeExpo.id}
          aloneScreen={data.aloneScreen}
          position={menuPosition}
        />
        <CardText
          className="card-screen"
          onClick={() => onClickEnabled && history.push(editUrl)}
          data-tooltip-id="expo-structure-screen-new-tooltip"
          data-tooltip-content={t(
            `structure.screenLabels.${mapScreenTypeValuesToKeys[
              data.type
            ].toLowerCase()}`
          )}
        >
          <p style={{ wordWrap: "break-word" }}>
            {number}
            {header}
          </p>
        </CardText>
        <ScreenCardActions
          rows={rows}
          cols={cols}
          rowNum={rowNum}
          colNum={colNum}
        />
      </Card>
      <ReactTooltip
        variant="dark"
        float={false}
        id={`screen-card-${rowNum}-${colNum}-tooltip`}
        className="help-icon-react-tooltip"
      />
    </div>
  ) : (
    <div />
  );
};

export default withRouter(
  connect(({ expo: { activeExpo } }) => ({ activeExpo }), null)(ScreenCard)
);
