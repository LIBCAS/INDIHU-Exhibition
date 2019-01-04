import React from "react";
import { connect } from "react-redux";
import { compose, withState, lifecycle, withHandlers } from "recompose";
import Button from "react-md/lib/Buttons/Button";

import { saveScreen } from "../../actions/expoActions";
import { setDialog } from "../../actions/dialogActions";
import { openViewer } from "../../utils";

const Footer = ({ save, openView }) =>
  <div className="flex-row flex-centered fixed-bottom-footer">
    <div className="inner padding flex-row flex-space-between">
      <Button raised label="Náhled" className="btn" onClick={openView} />
      <Button raised label="Uložit" className="btn" onClick={save} />
    </div>
  </div>;

export default compose(
  connect(null, { saveScreen, setDialog }),
  withState("ctrlKeyDown", "setCtrlKeyDown", false),
  withHandlers({
    save: ({
      noActions,
      noActionTitle,
      noActionText,
      activeScreen,
      rowNum,
      colNum,
      saveScreen,
      setDialog
    }) => async () => {
      if (noActions)
        setDialog("Info", {
          title: noActionTitle ? noActionTitle : "Ukončete prováděné akce!",
          text: noActionText
            ? noActionText
            : "Ukončete všechny prováděné akce než uložíte obrazovku!"
        });
      else {
        if (await saveScreen(activeScreen, rowNum, colNum)) {
          setDialog("Info", {
            title: "Obrazovka úspěšně uložena",
            text: "Obrazovka byla úspěšně uložena.",
            autoClose: true
          });
        } else {
          setDialog("Info", {
            title: "Obrazovka není uložena!",
            text: "Obrazovka nebyla uložena!"
          });
        }
      }
    },
    openView: ({
      activeExpo,
      activeScreen,
      rowNum,
      colNum,
      saveScreen,
      noActions,
      setDialog,
      type,
      noActionTitle,
      noActionText,
    }) => async () => {
      if (noActions)
        setDialog("Info", {
          title: noActionTitle ? noActionTitle : "Ukončete prováděné akce!",
          text: noActionText
            ? noActionText
            : "Ukončete všechny prováděné akce než otevřete náhled obrazovky!"
        });
      else {
        await saveScreen(activeScreen, rowNum, colNum);

        openViewer(
          type
            ? `/screen/${activeExpo.id}/${type}`
            : `/screen/${activeExpo.id}/${rowNum}/${colNum}`
        );
      }
    }
  }),
  withHandlers({
    manageKeyAction: ({
      save,
      openView,
      ctrlKeyDown,
      setCtrlKeyDown
    }) => async e => {
      if (e.keyCode === 17 && e.type === "keydown") {
        setCtrlKeyDown(true);
      } else if (ctrlKeyDown && e.keyCode === 83 && e.type === "keydown") {
        e.preventDefault();
        setCtrlKeyDown(false);
        save();
      } else if (ctrlKeyDown && e.keyCode === 80 && e.type === "keydown") {
        e.preventDefault();
        setCtrlKeyDown(false);
        openView();
      } else {
        setCtrlKeyDown(false);
      }
    }
  }),
  lifecycle({
    componentWillMount() {
      const { manageKeyAction } = this.props;

      document.addEventListener("keydown", manageKeyAction);
      document.addEventListener("keyup", manageKeyAction);
    },
    componentWillUnmount() {
      const { manageKeyAction } = this.props;

      document.removeEventListener("keydown", manageKeyAction);
      document.addEventListener("keyup", manageKeyAction);
    }
  })
)(Footer);
