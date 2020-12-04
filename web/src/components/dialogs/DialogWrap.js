import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose, withProps } from "recompose";
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import CardActions from "react-md/lib/Cards/CardActions";
import FontIcon from "react-md/lib/FontIcons";
import Button from "react-md/lib/Buttons/Button";

import { closeDialog } from "../../actions/dialogActions";
import { withKeyShortcuts } from "../hoc";

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
  noToolbar,
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
        {!noToolbar && (
          <FontIcon
            className="dialog-close"
            onClick={() => {
              if (onClose) onClose();
              closeDialog();
            }}
          >
            close
          </FontIcon>
        )}
        {!noToolbar && <CardText className="dialog-title">{title}</CardText>}
        <CardText
          className={classNames("dialog-content", {
            "no-margin-bottom": noDialogMenu,
            "padding-big": noToolbar && noDialogMenu
          })}
        >
          {children}
        </CardText>
        {!noDialogMenu && (
          <CardActions className="dialog-menu">
            {!noStornoButton && (
              <Button
                flat
                secondary
                label="Storno"
                onClick={() => {
                  if (onClose) onClose();
                  closeDialog();
                }}
                className="margin-right-small"
              />
            )}
            {!noSubmitButton && (
              <Button
                id={`dialog-submit-button-${name}`}
                raised
                primary
                label={submitLabel}
                onClick={() => {
                  handleSubmit();
                }}
                className="margin-right-small"
              />
            )}
          </CardActions>
        )}
      </Card>
    </div>
  );
};

DialogWrap.propTypes = {
  name: PropTypes.string,
  active: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  closeDialog: PropTypes.func,
  handleSubmit: PropTypes.func,
  submitLabel: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

export default compose(
  connect(
    ({ dialog: { name } }) => ({ active: name }),
    {
      closeDialog
    }
  ),
  withProps(({ name, active, noDialogMenu, noSubmitButton }) => ({
    onEnterButtonId:
      !noDialogMenu && !noSubmitButton && name === active
        ? `dialog-submit-button-${name}`
        : undefined
  })),
  withKeyShortcuts
)(DialogWrap);
