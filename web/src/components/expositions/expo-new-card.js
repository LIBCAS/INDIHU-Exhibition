import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";

import { connect } from "react-redux";
import { setDialog } from "../../actions/dialog-actions";

const ExpoNewCard = ({ setDialog }) => (
  <div className="expo-card">
    <Card raise onClick={() => setDialog("ExpoNew")}>
      <CardText className="expo-new">
        <i className="material-icons">add</i>
        <p> Vytvořit novou výstavu </p>
      </CardText>
    </Card>
  </div>
);

export default connect(null, { setDialog })(ExpoNewCard);
