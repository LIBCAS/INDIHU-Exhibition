import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import CardActions from "react-md/lib/Cards/CardActions";
import FontIcon from "react-md/lib/FontIcons";
import Button from "react-md/lib/Buttons/Button";

import { closeDialog } from "../../actions/dialogActions";

const DialogWrap = ({
  name,
  active,
  title,
  closeDialog,
  handleSubmit,
  onClose,
  submitLabel,
  children,
  className,
  noStornoButton,
  noSubmitButton,
  noDialogMenu,
  big,
  style
}) => {
  if (name === active) {
    document.body.style.overflow = "hidden";
  }

  return (
    <div className={classNames({ hidden: name !== active })}>
      <div className="dialog-background" />
      <Card
        raise
        style={style}
        className={classNames(`dialog ${className}`, { big })}
      >
        <FontIcon
          className="dialog-close"
          onClick={() => {
            if (onClose) onClose();
            closeDialog();
          }}
        >
          close
        </FontIcon>
        <CardText className="dialog-title">
          {title}
        </CardText>
        <CardText
          className={classNames("dialog-content", {
            "no-margin-bottom": noDialogMenu
          })}
        >
          {children}
        </CardText>
        {!noDialogMenu &&
          <CardActions className="dialog-menu">
            {!noStornoButton &&
              <Button
                flat
                secondary
                label="Storno"
                onClick={() => {
                  if (onClose) onClose();
                  closeDialog();
                }}
                className="margin-right-small"
              />}
            {!noSubmitButton &&
              <Button
                flat
                primary
                label={submitLabel}
                onClick={() => {
                  handleSubmit();
                }}
                className="margin-right-small"
              />}
          </CardActions>}
      </Card>
    </div>
  );
};

DialogWrap.propTypes = {
  name: PropTypes.string,
  active: PropTypes.string,
  title: PropTypes.string,
  closeDialog: PropTypes.func,
  handleSubmit: PropTypes.func,
  submitLabel: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

export default connect(({ dialog: { name } }) => ({ active: name }), {
  closeDialog
})(DialogWrap);
