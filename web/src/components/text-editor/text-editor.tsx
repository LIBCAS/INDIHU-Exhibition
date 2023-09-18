import { useEffect } from "react";
import {
  $getRoot,
  $getSelection,
  EditorState,
  EditorThemeClasses,
  FORMAT_TEXT_COMMAND,
} from "lexical";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { TOGGLE_LINK_COMMAND, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

const theme: EditorThemeClasses = {
  link: "text-sky-500",
  text: {
    underline: "underline",
  },
};

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
const onChange = (editorState: EditorState) => {
  console.log({ editorState });
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const root = $getRoot();
    const selection = $getSelection();

    console.log(root, selection);
  });
};

const MyCustomAutoFocusPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
};

export const TextEditor = () => {
  return (
    <LexicalComposer
      initialConfig={{
        namespace: "TextEditor",
        theme,
        onError: () => null,
        nodes: [LinkNode],
      }}
    >
      <div className="border rounded-sm border-black border-opacity-10">
        {/* Toolbar */}
        <Toolbar />

        <div className="relative m-2">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="relative outline-none" />
            }
            placeholder={
              <p className="absolute top-0 left-0 text-gray">
                Enter some text...
              </p>
            }
          />
        </div>
        <OnChangePlugin onChange={onChange} />
        <HistoryPlugin />
        <MyCustomAutoFocusPlugin />
        <LinkPlugin />
      </div>
    </LexicalComposer>
  );
};

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="flex items-center border-b border-b-black border-opacity-10 bg-black bg-opacity-5">
      <Button
        iconBefore={<Icon name="format_bold" />}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      />
      <Button
        iconBefore={<Icon name="format_italic" />}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      />
      <Button
        iconBefore={<Icon name="format_underline" />}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
      />
      <Button
        iconBefore={<Icon name="format_link" />}
        onClick={() => editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://")}
      />
    </div>
  );
};
