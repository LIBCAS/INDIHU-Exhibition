import React from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import FontIcon from "react-md/lib/FontIcons";
import Button from "react-md/lib/Buttons/Button";

import HelpIcon from "../../HelpIcon";

import { setDialog } from "../../../actions/dialogActions";
import { removeScreenCollaborators } from "../../../actions/expoActions";

import { helpIconText } from "../../../enums/text";

const Authors = ({ activeScreen, setDialog, removeScreenCollaborators }) =>
  <div className="container container-tabMenu">
    <div className="screen">
      {activeScreen &&
        !isEmpty(activeScreen.collaborators) &&
        <div className="flex-row-nowrap">
          <div className="table margin-bottom">
            <div className="table-row header">
              <div className="table-col">Nadpis</div>
              <div className="table-col">Osoby nebo text</div>
              <div className="table-col" />
            </div>
            {activeScreen.collaborators.map((item, i) =>
              <div className="table-row" key={i}>
                <div className="table-col">
                  {item.role}
                </div>
                <div className="table-col">
                  {item.text}
                </div>
                <div className="table-col flex-right">
                  <FontIcon
                    onClick={() => setDialog("ScreenAuthorsChange", item)}
                  >
                    mode_edit
                  </FontIcon>
                  <FontIcon onClick={() => removeScreenCollaborators(item)}>
                    delete
                  </FontIcon>
                </div>
              </div>
            )}
          </div>
          <HelpIcon {...{ label: helpIconText.EDITOR_START_AUTHORS }} />
        </div>}
      <Button icon onClick={() => setDialog("ScreenAuthorsAdd")}>
        add
      </Button>
    </div>
  </div>;

export default connect(null, { setDialog, removeScreenCollaborators })(Authors);
