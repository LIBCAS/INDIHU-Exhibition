import React from "react";
import TextField from "react-md/lib/TextFields";

import HelpIcon from "../../HelpIcon";

import { helpIconText } from "../../../enums/text";

const Text = ({ activeScreen, updateScreenData }) =>
  <div className="container container-tabMenu">
    <div className="screen">
      <div className="flex-row-nowrap">
        <TextField
          id="screen-start-textfield-maintext"
          label="Text"
          maxLength={300}
          defaultValue={activeScreen.mainText}
          onChange={value => updateScreenData({ mainText: value })}
          rows={3}
        />
        <HelpIcon
          {...{ label: helpIconText.EDITOR_TEXT_TEXT, id: "editor-text-text" }}
        />
      </div>
    </div>
  </div>;

export default Text;
