import classNames from "classnames";
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";

import ScreenNew from "./screen-new";
import { useTranslation } from "react-i18next";

const ScreenDraggedCardTargetLocation = ({ last, col }) => {
  const { t } = useTranslation("expo", { keyPrefix: "structure" });

  return (
    <div
      id="screen-dragged-card-target-location"
      className={classNames("dragged-card-target-location", { col })}
    >
      {last && (
        <div className="dragged-card-target-location-inner">
          <div
            className={classNames("dragged-card-target-location-row-line")}
          />
          <ScreenNew />
        </div>
      )}
      <Card className={classNames("card")}>
        <CardText className="card-text">
          <p>{t("newPosition")}</p>
        </CardText>
      </Card>
      {!col && (
        <div className="dragged-card-target-location-inner">
          <div
            className={classNames("dragged-card-target-location-row-line", {
              last,
            })}
          />
          <ScreenNew />
        </div>
      )}
      {col && <ScreenNew />}
    </div>
  );
};

export default ScreenDraggedCardTargetLocation;
