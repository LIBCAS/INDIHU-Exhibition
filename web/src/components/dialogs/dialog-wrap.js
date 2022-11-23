import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose, withProps } from "recompose";
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import CardActions from "react-md/lib/Cards/CardActions";
import MDButton from "react-md/lib/Buttons/Button";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import { closeDialog } from "../../actions/dialog-actions";
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
  large,
  style,
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
        className={classNames(`dialog ${className ? className : ""}`, {
          big,
          large,
        })}
      >
        {!noToolbar && (
          <div className="dialog-title-row">
            <CardText className="dialog-title">{title}</CardText>
            <Button
              iconBefore={<Icon name="close" />}
              onClick={() => {
                if (onClose) onClose();
                closeDialog();
              }}
            />
          </div>
        )}
        <CardText
          className={classNames("dialog-content", {
            "no-margin-bottom": noDialogMenu,
            "padding-big": noToolbar && noDialogMenu,
          })}
        >
          {children}
        </CardText>
        {!noDialogMenu && (
          <CardActions className="dialog-menu">
            {!noStornoButton && (
              <MDButton
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
              <MDButton
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
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default compose(
  connect(({ dialog: { name } }) => ({ active: name }), {
    closeDialog,
  }),
  withProps(({ name, active, noDialogMenu, noSubmitButton }) => ({
    onEnterButtonId:
      !noDialogMenu && !noSubmitButton && name === active
        ? `dialog-submit-button-${name}`
        : undefined,
  })),
  withKeyShortcuts
)(DialogWrap);
