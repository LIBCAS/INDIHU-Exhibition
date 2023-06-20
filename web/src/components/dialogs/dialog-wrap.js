import { compose, withProps } from "recompose";
import { connect } from "react-redux";
import { withKeyShortcuts } from "../hoc"; // ! HOC - High Order Component, enhancing this component

// Components
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import CardActions from "react-md/lib/Cards/CardActions";
import MDButton from "react-md/lib/Buttons/Button";
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

// Utils
import classNames from "classnames";
import PropTypes from "prop-types";

// Actions
import { closeDialog } from "../../actions/dialog-actions";

// - - - - - - - -

const DialogWrap = ({
  name,
  title,
  submitLabel,
  handleSubmit,
  onClose,
  style, // nowhere used
  className,
  big,
  large,
  noDialogMenu,
  noStornoButton,
  noSubmitButton,
  noToolbar,
  // noOverflowScrollOnClose  missing
  children,
  ...otherProps
}) => {
  const { activeName, closeDialog } = otherProps; // connect HOC

  if (name === activeName) {
    document.body.style.overflow = "hidden";
  }

  return (
    <div className={classNames({ hidden: name !== activeName })}>
      <div className="dialog-background" />
      <Card
        raise
        style={style}
        className={classNames(`dialog ${className ? className : ""}`, {
          big,
          large,
        })}
      >
        {/* Title */}
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

        {/* Section with content */}
        <CardText
          className={classNames("dialog-content", {
            "no-margin-bottom": noDialogMenu,
            "padding-big": noToolbar && noDialogMenu,
          })}
        >
          {children}
        </CardText>

        {/* Footer of dialog with buttons */}
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
  activeName: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  closeDialog: PropTypes.func,
  handleSubmit: PropTypes.func,
  submitLabel: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default compose(
  connect(({ dialog: { name } }) => ({ activeName: name }), {
    closeDialog,
  }),
  withProps(({ name, activeName, noDialogMenu, noSubmitButton }) => ({
    onEnterButtonId:
      !noDialogMenu && !noSubmitButton && name === activeName
        ? `dialog-submit-button-${name}`
        : undefined,
  })),
  withKeyShortcuts
)(DialogWrap);
