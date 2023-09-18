import { useRef, useState, Dispatch, SetStateAction } from "react";
import { useSpring, animated } from "react-spring";

import ReactQuill from "react-quill";

import "react-quill/dist/quill.snow.css";
import "./custom-editor-styles.scss";

import CharacterCount from "../character-count";
import HelpIcon from "components/help-icon";

import { helpIconText } from "enums/text";
import { getTextFromHtml } from "./getTextFromHtml";

// - -

// https://quilljs.com/docs/modules/toolbar/
const modules = {
  toolbar: [
    [{ size: ["small", "", "large"] }], // possible to add 'huge'
    // [{ header: "1" }, { header: "2" }, { font: [] }],
    ["bold", "italic", "underline", "strike"],
    // [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    // ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    // ["link", "image", "video"],
    ["link"],
    ["clean"],
  ],
};

// https://quilljs.com/docs/formats/
const formats = [
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "script",
  "align",
  "list",
  // "bullet",
  "link",
];

// --

type ControlledWysiwygEditorProps = {
  controlType: "controlled";
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
};

type UncontrolledWysiwygEditorProps = {
  controlType: "uncontrolled";
  defaultValue: string;
  onChange: (content: string) => void;
};

type CommonWysiwygEditorProps = {
  label?: string;
  helpIconText?: string;
};

type WysiwygEditorProps =
  | (ControlledWysiwygEditorProps & CommonWysiwygEditorProps)
  | (UncontrolledWysiwygEditorProps & CommonWysiwygEditorProps);

const WysiwygEditor = (props: WysiwygEditorProps) => {
  const [isEditorFocused, setIsEditorFocused] = useState<boolean>(false);
  const quillRef = useRef<ReactQuill>(null);

  const widthSpring = useSpring({
    width: isEditorFocused ? "100%" : "0%",
  });

  return (
    <div className="mt-3 flex">
      <div className="grow flex flex-col gap-3">
        <label
          className="block font-['Work_Sans'] text-[12px] text-black/[.54]"
          style={{
            color: isEditorFocused ? "#083d77" : "rgba(0, 0, 0, 0.54)",
          }}
        >
          {props.label ?? "Text k tématu"}
        </label>

        <div className="flex flex-col gap-1">
          <div>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              defaultValue={
                props.controlType === "uncontrolled"
                  ? props.defaultValue
                  : undefined
              }
              // Optionally spreading value props if editor is controlled
              {...(props.controlType === "controlled"
                ? { value: props.value }
                : {})}
              onChange={(content) => {
                if (props.controlType === "controlled") {
                  props.setValue(content);
                }
                if (props.controlType === "uncontrolled") {
                  props.onChange(content);
                }
              }}
              onFocus={() => setIsEditorFocused(true)}
              onBlur={() => setIsEditorFocused(false)}
              //className, style applies to whole quill box containg toolbar + container
              modules={modules}
              formats={formats}
            />

            <animated.hr
              className="border-t-2 border-t-[#083d77]"
              style={widthSpring}
            />
          </div>
          <CharacterCount
            text={
              props.controlType === "controlled"
                ? getTextFromHtml(props.value) ?? ""
                : getTextFromHtml(props.defaultValue) ?? ""
            }
          />
        </div>
      </div>

      <HelpIcon
        label={props.helpIconText ?? helpIconText.EDITOR_DESCRIPTION_TEXT}
        id="editor-description-text"
      />
    </div>
  );
};

export default WysiwygEditor;
