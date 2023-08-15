import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import { get } from "lodash";
import { withRouter } from "react-router-dom";
import classNames from "classnames";

import ScreenCardMenu from "./screen-card-menu";
import {
  mapScreenTypeValuesToKeys,
  screenTypeText,
} from "../../../enums/screen-type";

const ScreenCard = ({ activeExpo, type, history }) => {
  const editUrl = get(activeExpo, "id")
    ? `/expo/${activeExpo.id}/screen/${type}/description`
    : "";

  return (
    <Card
      raise
      className={classNames(type, {
        green: get(activeExpo.structure, `${type}.screenCompleted`),
      })}
    >
      <ScreenCardMenu
        type={type.toUpperCase()}
        editUrl={editUrl}
        viewUrl={activeExpo.url}
      />
      <CardText
        className="card-screen-start-finish"
        onClick={() => history.push(editUrl)}
      >
        <p style={{ wordWrap: "break-word" }}>
          {screenTypeText[mapScreenTypeValuesToKeys[type.toUpperCase()]]}
        </p>
      </CardText>
    </Card>
  );
};

export default withRouter(ScreenCard);
