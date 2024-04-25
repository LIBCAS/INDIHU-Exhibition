import {
  CSSProperties,
  ReactNode,
  useCallback,
  FC,
  PropsWithChildren,
} from "react";

import { createSelector } from "reselect";
import { useSelector, useDispatch } from "react-redux";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

// Components
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import CardActions from "react-md/lib/Cards/CardActions";
import MDButton from "react-md/lib/Buttons/Button";
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

// Models
import { AppDispatch, AppState } from "store/store";

// Actions
import { closeDialog } from "actions/dialog-actions";

// Utils
import cx from "classnames";

// - - - - - - - -

const stateSelector = createSelector(
  ({ dialog }: AppState) => dialog.name,
  (name) => ({
    activeName: name,
  })
);

type DialogWrapProps = {
  name: string;
  title: string | ReactNode;
  submitLabel?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  handleSubmit?: Function;
  onClose?: () => void;
  style?: CSSProperties;
  className?: string;
  big?: boolean;
  large?: boolean;
  noToolbar?: boolean;
  noDialogMenu?: boolean;
  noStornoButton?: boolean;
  noSubmitButton?: boolean;
  //noOverflowScrollOnClose?: boolean; // not used
};

const DialogWrap: FC<PropsWithChildren<DialogWrapProps>> = ({
  name,
  title,
  submitLabel,
  handleSubmit,
  onClose,
  style,
  className,
  big,
  large,
  noToolbar,
  noDialogMenu,
  noStornoButton,
  noSubmitButton,
  children,
}) => {
  const { activeName } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();

  const { isLightMode } = useExpoDesignData();

  const closeThisDialog = useCallback(
    () => dispatch(closeDialog()),
    [dispatch]
  );

  if (name === activeName) {
    document.body.style.overflow = "hidden";
  }

  return (
    <div className={cx({ hidden: name !== activeName })}>
      <div className="dialog-background" />
      <Card
        raise
        style={style}
        className={cx(`dialog`, {
          big,
          large,
          "!bg-light-mode-b !text-light-mode-f": isLightMode,
          "!bg-dark-mode-b !text-dark-mode-f": !isLightMode,
          className,
        })}
      >
        {/* 1.) Toolbar with the title and close button */}
        {!noToolbar && (
          <div
            className="dialog-title-row"
            style={{
              borderBottomColor: isLightMode
                ? undefined
                : "rgba(255, 255, 255, 0.15)",
            }}
          >
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
            {/* A) Storno button*/}
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
            {/* B) Submit button */}
            {!noSubmitButton && (
              <MDButton
                id={`dialog-submit-button-${name}`}
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
