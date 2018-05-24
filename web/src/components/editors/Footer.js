import React from "react";
import { connect } from "react-redux";
import Button from "react-md/lib/Buttons/Button";

import { saveScreen } from "../../actions/expoActions";
import { setDialog } from "../../actions/dialogActions";
import { openViewer } from "../../utils";

const Footer = ({
  activeExpo,
  activeScreen,
  rowNum,
  colNum,
  saveScreen,
  noActions,
  setDialog,
  url,
  type,
  noActionTitle,
  noActionText
}) =>
  <div className="flex-row flex-centered fixed-bottom-footer">
    <div className="inner padding flex-row flex-space-between">
      <Button
        raised
        label="Uložit"
        className="btn"
        onClick={async () => {
          if (noActions)
            setDialog("Info", {
              title: noActionTitle ? noActionTitle : "Ukončete prováděné akce!",
              text: noActionText
                ? noActionText
                : "Ukončete všechny prováděné akce než uložíte obrazovku!"
            });
          else {
            if (await saveScreen(activeScreen, rowNum, colNum))
              setDialog("Info", {
                title: "Obrazovka úspěšně uložena",
                text: "Obrazovka byla úspěšně uložena.",
                autoClose: true
              });
            else
              setDialog("Info", {
                title: "Obrazovka není uložena!",
                text: "Obrazovka nebyla uložena!"
              });
          }
        }}
      />
      <Button
        raised
        label="Náhled"
        className="btn"
        onClick={async () => {
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
        }}
      />
    </div>
  </div>;

export default connect(null, { saveScreen, setDialog })(Footer);
