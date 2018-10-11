import React from "react";
import classNames from "classnames";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";

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
  isFilled,
  activeExpo,
  history
}) => {
  const number = ` ${rowNum + 1}${colNum > 0 ? `.${colNum} ` : " "}`;
  const header = `${data.title || screenTypeText[data.type]}`;

  const cardType = data.type !== "START" && data.type !== "FINISH";
  const position = cardType ? `${rowNum}-${colNum}` : screenUrl[data.type];
  const editUrl = `/expo/${activeExpo.id}/screen/${screenUrl[
    data.type
  ]}/${position}/description`;

  return activeExpo
    ? <Card raise className={classNames("card", { green: isFilled })}>
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
        />
        <CardText className="card-screen">
          <p onClick={() => history.push(editUrl)}>
            <i className={`fa ${screenTypeIcon[data.type]}`} />
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
    : <div />;
};

export default withRouter(
  connect(({ expo: { activeExpo } }) => ({ activeExpo }), null)(ScreenCard)
);
