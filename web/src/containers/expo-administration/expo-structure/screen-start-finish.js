import { useTranslation } from "react-i18next";

import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import { get } from "lodash";
import { withRouter } from "react-router-dom";
import classNames from "classnames";

import ScreenCardMenu from "./screen-card-menu";

const ScreenCard = ({ activeExpo, type, history }) => {
  const { t } = useTranslation("expo");

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
          {t(`structure.screenLabels.${type.toLowerCase()}`)}
        </p>
      </CardText>
    </Card>
  );
};

export default withRouter(ScreenCard);
