import React from "react";
import classNames from "classnames";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import { get } from "lodash";
import ReactTooltip from "react-tooltip";

import ScreenCardMenu from "./ScreenCardMenu";
import ScreenCardActions from "./ScreenCardActions";
import {
  screenTypeText,
  screenTypeIcon,
  screenUrl
} from "../../../enums/screenType";

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
  isDragged
}) => {
  const number = `${rowNum + 1}${colNum > 0 ? `.${colNum}` : ""} `;
  const header = `${data.title || screenTypeText[data.type]}`;

  const cardType = data.type !== "START" && data.type !== "FINISH";
  const position = cardType ? `${rowNum}-${colNum}` : screenUrl[data.type];
  const editUrl = `/expo/${activeExpo.id}/screen/${
    screenUrl[data.type]
  }/${position}/description`;

  return activeExpo ? (
    <div className="card-background">
      <Card
        raise
        id={`expo-structure-screen-card-${rowNum}-${colNum}`}
        className={classNames("card", {
          green: get(data, "screenCompleted"),
          dragged: isDragged
        })}
      >
        <i
          className={`structure-screen-card-icon fa ${
            screenTypeIcon[data.type]
          }`}
          data-tip={get(screenTypeText, data.type)}
          data-for="expo-structure-screen-new-tooltip"
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
          data-tip={get(screenTypeText, data.type)}
          data-for="expo-structure-screen-new-tooltip"
        >
          <p>
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
        type="dark"
        effect="solid"
        id={`screen-card-${rowNum}-${colNum}-tooltip`}
        className="help-icon-react-tooltip"
      />
    </div>
  ) : (
    <div />
  );
};

export default withRouter(
  connect(
    ({ expo: { activeExpo } }) => ({ activeExpo }),
    null
  )(ScreenCard)
);
