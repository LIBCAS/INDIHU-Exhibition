import classNames from "classnames";
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";

import ScreenNew from "./screen-new";

const ScreenDraggedCardTargetLocation = ({ last, col }) => {
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
          <p>Nová pozice</p>
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
