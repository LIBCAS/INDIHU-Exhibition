import { useDispatch } from "react-redux";

import WysiwygEditor from "components/editors/WysiwygEditor/WysiwygEditor";
// import { TextEditor } from "components/text-editor/text-editor";

import { AppDispatch } from "store/store";
import { TextScreen } from "models";

import { updateScreenData } from "actions/expoActions";
import { helpIconText } from "enums/text";

type TextProps = {
  activeScreen: TextScreen;
};

const Text = ({ activeScreen }: TextProps) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <WysiwygEditor
          controlType="uncontrolled"
          defaultValue={activeScreen.mainText ?? ""}
          onChange={(newContent: string) => {
            dispatch(updateScreenData({ mainText: newContent }));
          }}
          label="Text"
          helpIconText={helpIconText.EDITOR_TEXT_TEXT}
          //id="screen-start-textfield-maintext"
          //maxLength={300}
        />
      </div>
    </div>
  );
};

export default Text;
