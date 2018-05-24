import React from "react";
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import { get } from "lodash";
import { withRouter } from "react-router-dom";
import classNames from "classnames";

import ScreenCardMenu from "./ScreenCardMenu";
import { screenTypeText } from "../../../enums/screenType";

const ScreenCard = ({ activeExpo, type, history }) => {
  const editUrl = get(activeExpo, "id")
    ? `/expo/${activeExpo.id}/screen/${type}/description`
    : "";

  return (
    <Card
      raise
      className={classNames(type, {
        green: get(activeExpo.structure, `${type}.screenCompleted`)
      })}
    >
      <ScreenCardMenu
        type={type.toUpperCase()}
        editUrl={editUrl}
        viewUrl={activeExpo.url}
      />
      <CardText className="card-screen-start-finish">
        <p onClick={() => history.push(editUrl)}>
          {screenTypeText[type.toUpperCase()]}
        </p>
      </CardText>
    </Card>
  );
};

export default withRouter(ScreenCard);
