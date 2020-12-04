import * as React from "react";
import {
  compose,
  withHandlers,
  mapProps,
  lifecycle,
  withState
} from "recompose";

const enhance = compose(
  withState("allowUpAndDown", "setAllowUpAndDown", true),
  withState("timeoutId", "setTimeoutId", null),
  withHandlers({
    manageKeyAction: ({
      onEnterButtonId,
      onUp,
      onDown,
      onDelete,
      allowUpAndDown,
      setAllowUpAndDown,
      setTimeoutId
    }) => async e => {
      if (e.type === "keydown") {
        // Enter
        if (e.keyCode === 13) {
          if (onEnterButtonId) {
            const button = document.getElementById(onEnterButtonId);

            if (button) {
              button.click();
            }
          }
          // Arrow Up
        } else if (e.keyCode === 38) {
          if (onUp && allowUpAndDown) {
            setAllowUpAndDown(false);
            onUp();
            setTimeoutId(setTimeout(() => setAllowUpAndDown(true), 30));
          }
          // Arrow Down
        } else if (e.keyCode === 40) {
          if (onDown && allowUpAndDown) {
            setAllowUpAndDown(false);
            onDown();
            setTimeoutId(setTimeout(() => setAllowUpAndDown(true), 30));
          }
          // Delete
        } else if (e.keyCode === 46) {
          if (onDelete) {
            onDelete();
          }
        }
      }
    }
  }),
  lifecycle({
    async componentWillMount() {
      const { manageKeyAction } = this.props;

      // bind event listeners
      document.addEventListener("keydown", manageKeyAction);
      document.addEventListener("keyup", manageKeyAction);
    },
    componentWillUnmount() {
      const { manageKeyAction, timeoutId } = this.props;

      // unbind event listeners
      document.removeEventListener("keydown", manageKeyAction);
      document.removeEventListener("keyup", manageKeyAction);

      clearTimeout(timeoutId);
    }
  }),
  mapProps(({ manageKeyActions, onEnterButtonId, ...rest }) => rest)
);

const WithKeyShortcuts = BaseComponent =>
  enhance(props => <BaseComponent {...props} />);

export default WithKeyShortcuts;
