import TextField from "react-md/lib/TextFields";

import HelpIcon from "../../help-icon";

import { helpIconText } from "../../../enums/text";

const ExternalData = ({ activeScreen, updateScreenData }) => (
  <div className="container container-tabMenu">
    <div className="screen">
      <div className="flex-row-nowrap">
        <TextField
          id="screen-start-textfield-externaldata"
          label="Kód vložený do stránky"
          defaultValue={activeScreen.externalData}
          onChange={(value) => updateScreenData({ externalData: value })}
          rows={5}
        />
        <HelpIcon
          {...{
            label: helpIconText.EDITOR_EXTERNAL_EXTERNALDATA,
            id: "editor-external-externaldata",
          }}
        />
      </div>
    </div>
  </div>
);

export default ExternalData;
