import React from "react";
import { compose, withProps } from "recompose";
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import CardActions from "react-md/lib/Cards/CardActions";
import Button from "react-md/lib/Buttons/Button";

import { withKeyShortcuts } from "../hoc";

const WarningDialog = ({ content, onClose }) => {
  return content ? (
    <div>
      <div className="dialog-background warning" />
      <Card raise className="dialog warning">
        <CardText className="dialog-title">Varování</CardText>
        <CardText className="dialog-content">
          <div style={{ fontSize: "1.15em" }}>
            <strong>{content}</strong>
          </div>
        </CardText>
        <CardActions className="dialog-menu">
          <Button
            id="dialog-submit-button-warning"
            raised
            primary
            label="OK"
            onClick={onClose}
            className="margin-right-small"
          />
        </CardActions>
      </Card>
    </div>
  ) : (
    <div />
  );
};

export default compose(
  withProps(({ content }) => ({
    onEnterButtonId: content ? "dialog-submit-button-warning" : undefined,
  })),
  withKeyShortcuts
)(WarningDialog);
