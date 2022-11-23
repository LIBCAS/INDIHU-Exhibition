import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import CardActions from "react-md/lib/Cards/CardActions";
import Divider from "react-md/lib/Dividers";

import ExpoCardActions from "./expo-card-actions";
import { formatTime } from "../../utils";
import { expoStateText } from "../../enums/expo-state";

const ExpoCard = ({
  title,
  state,
  created,
  lastEdit,
  isEditing,
  inProgress,
  id,
  canEdit,
  canDelete,
  url,
  history,
}) => (
  <div className="expo-card">
    <Card
      raise
      onClick={() =>
        canEdit &&
        state !== "ENDED" &&
        !inProgress &&
        history.push(`/expo/${id}/structure`)
      }
    >
      <CardText className="expo-card-text">
        <div className="md-grid">
          <p>{title}</p>
        </div>
        <Divider />
        <div className="md-grid">
          <div className="md-cell--left">
            <p>Stav:</p>
          </div>
          <div className="md-cell--right">
            <p>{expoStateText[state]}</p>
          </div>
        </div>
        <div className="md-grid">
          <div className="md-cell--left">
            <p>Vytvořeno:</p>
          </div>
          <div className="md-cell--right">
            <p>{formatTime(created)}</p>
          </div>
        </div>
        <div className="md-grid">
          <div className="md-cell--left">
            <p>Poslední editace:</p>
          </div>
          <div className="md-cell--right">
            <p>{formatTime(lastEdit)}</p>
          </div>
        </div>
        {isEditing && (
          <div className="md-grid">
            <div className="md-cell--left">
              <p>Naposledy upravováno:</p>
            </div>
            <div className="md-cell--right">
              <p>{isEditing}</p>
            </div>
          </div>
        )}
      </CardText>
      <CardActions className="md-divider-border md-divider-border--top expo-actions">
        <ExpoCardActions {...{ id, title, canEdit, canDelete, url, state }} />
      </CardActions>
    </Card>
  </div>
);

export default ExpoCard;
