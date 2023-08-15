import {
  useEffect,
  useCallback,
  CSSProperties,
  ReactNode,
  FC,
  PropsWithChildren,
} from "react";

// Components
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import CardActions from "react-md/lib/Cards/CardActions";
import MDButton from "react-md/lib/Buttons/Button";
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

// Utils
import cx from "classnames";

// - - - - - - - -

/**
 * closeThisDialog as mandatory function which tells the wrapper of how to close the dialog
 * onClose is optional function, additional things to do before the dialog is closed
 * handleSubmit is optional function, what actions should be done when clicking submit label
 * closeAfterSubmit, if false, submit action will not close the dialog, if yes, onClose and then close dialog
 */
type DialogWrapProps = {
  closeThisDialog: () => void;
  title: string | ReactNode;
  // eslint-disable-next-line @typescript-eslint/ban-types
  handleSubmit?: Function;
  submitLabel?: string;
  onClose?: () => void;
  isSubmitSuccessful?: boolean;
  closeAfterSuccessfulSubmit?: boolean;
  closeOnEsc?: boolean;
  className?: string;
  style?: CSSProperties;
  big?: boolean;
  large?: boolean;
  noToolbar?: boolean;
  noDialogMenu?: boolean;
  noStornoButton?: boolean;
  noSubmitButton?: boolean;
};

const DialogWrap: FC<PropsWithChildren<DialogWrapProps>> = ({
  closeThisDialog,
  title,
  submitLabel,
  handleSubmit,
  isSubmitSuccessful = false,
  closeAfterSuccessfulSubmit,
  closeOnEsc,
  onClose,
  className,
  style,
  big,
  large,
  noToolbar,
  noDialogMenu,
  noStornoButton,
  noSubmitButton,
  children,
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const onKeydownAction = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEsc) {
        if (onClose) onClose();
        closeThisDialog();
      }
    },
    [closeOnEsc, closeThisDialog, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeydownAction);
    return () => {
      window.removeEventListener("keydown", onKeydownAction);
    };
  }, [onKeydownAction]);

  // Close dialog after successful submission if required
  useEffect(() => {
    if (closeAfterSuccessfulSubmit && isSubmitSuccessful) {
      if (onClose) onClose();
      closeThisDialog();
    }
  }, [
    closeAfterSuccessfulSubmit,
    isSubmitSuccessful,
    onClose,
    closeThisDialog,
  ]);

  return (
    <div>
      <div className="dialog-background" />

      {/* Dialog itself as Card component */}
      <Card
        raise
        style={style}
        className={cx("dialog", className, {
          big,
          large,
        })}
      >
        {/* 1.) Toolbar with title and close button */}
        {!noToolbar && (
          <div className="dialog-title-row">
            <CardText className="dialog-title">{title}</CardText>
            <Button
              iconAfter={<Icon name="close" />}
              onClick={() => {
                if (onClose) {
                  onClose();
                }
                closeThisDialog();
              }}
            />
          </div>
        )}

        {/* 2.) Dialog Custom Body, section with content */}
        <CardText
          className={cx("dialog-content", {
            "no-margin-bottom": noDialogMenu,
            "padding-big": noToolbar && noDialogMenu,
          })}
        >
          {children}
        </CardText>

        {/* 3.) DialogMenu with the dialog action buttons - storno and submit buttons */}
        {!noDialogMenu && (
          <CardActions className="dialog-menu">
            {/* Storno button */}
            {!noStornoButton && (
              <MDButton
                flat
                secondary
                label="Storno"
                className="margin-right-small"
                onClick={() => {
                  if (onClose) {
                    onClose();
                  }
                  closeThisDialog();
                }}
              />
            )}

            {/* Submit button */}
            {!noSubmitButton && (
              <MDButton
                id={`dialog-submit-button`}
                raised
                primary
                label={submitLabel ?? "Potvrdit"}
                className="margin-right-small"
                onClick={() => {
                  if (handleSubmit) {
                    handleSubmit();
                  }
                }}
              />
            )}
          </CardActions>
        )}
      </Card>
    </div>
  );
};

export default DialogWrap;
