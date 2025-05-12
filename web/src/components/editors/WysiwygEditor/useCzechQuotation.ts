import { MutableRefObject, useEffect } from "react";
import ReactQuill from "react-quill";

/**
 * A custom React hook that registers a click event handler to a custom toolbar button
 * (with id `custom-cz-quote-button`) in a ReactQuill editor. When clicked, the button
 * toggles Czech quotation marks („ and “) around the currently selected text in the editor.
 *
 * - If the selected text is already surrounded by Czech quotes, they will be removed.
 * - If the selected text is not quoted, the hook will wrap it with „ at the beginning and “ at the end.
 *
 * The hook automatically adds and cleans up the event listener when the component mounts/unmounts.
 */
export const useCzechQuotation = (
  quillRef: MutableRefObject<ReactQuill | null>
) => {
  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const button = document.getElementById("custom-cz-quote-button");
    if (!button) return;

    const handler = () => {
      const range = quill.getSelection();
      if (range && range.length > 0) {
        const text = quill.getText(range.index, range.length);

        const startsWith = text.startsWith("„");
        const endsWith = text.endsWith("“");

        if (startsWith && endsWith) {
          // Remove Czech quotes
          const unquoted = text.slice(1, -1); // remove first and last char
          quill.deleteText(range.index, range.length);
          quill.insertText(range.index, unquoted);
          quill.setSelection(range.index, unquoted.length);
        } else {
          // Add Czech quotes
          quill.deleteText(range.index, range.length);
          const quoted = `„${text}“`;
          quill.insertText(range.index, quoted);
          quill.setSelection(range.index, quoted.length);
        }
      }
    };

    button.addEventListener("click", handler);

    return () => {
      button.removeEventListener("click", handler);
    };
  }, [quillRef]);
};
