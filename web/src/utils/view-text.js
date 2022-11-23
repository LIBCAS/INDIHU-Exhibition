import { forEach, get, isEmpty, escapeRegExp } from "lodash";

const tagToComponent = {
  b: ({ content }) => <b>{content}</b>,
  i: ({ content }) => <i>{content}</i>,
};

/**
 * Transforms string to span components with new lines replaced with <br /> tag
 */
const parseNewLines = (text, baseKey) => {
  let currentText = text;
  const componentArray = [];

  let key = 0;
  while (currentText !== "") {
    let part = "";
    let newLine = false;

    forEach(currentText, (char) => {
      if (char === "\n") {
        newLine = true;
        return false;
      }
      part += char;
      return true;
    });

    if (part !== "") {
      componentArray.push(
        <span {...{ key: `${baseKey}/${key}` }}>{part}</span>
      );
      key++;
    }

    if (newLine) {
      componentArray.push(<br {...{ key: `${baseKey}/${key}` }} />);
      key++;
    }

    const toReplace = newLine ? part + "\n" : part;

    currentText = currentText.replace(
      new RegExp("^" + escapeRegExp(toReplace)),
      ""
    );
  }

  return componentArray;
};

/**
 * Parsing text for text screen
 *
 * Supported tags and markdown:
 * <b>bold</b>
 * **bold**
 * __bold__
 * <i>italic</i>
 * *italic*
 * _italic_
 *
 * New lines replaced with <br /> tag.
 *
 * @param {*} text string
 * @returns array of parsed components
 */
export const parseText = (text) => {
  let currentText = text;
  let componentArray = [];

  let key = 0;
  while (currentText !== "") {
    const part = get(currentText.match(/^([^<*_\\]*)/), "[0]");
    const escaped = get(currentText.match(/(^\\\*)|(^\\_)/), "[0]");
    const withTag = get(
      currentText.match(/(^<b>(.*?)<\/b>)|(^<i>(.*?)<\/i>)/),
      "[0]"
    );
    const markdown = get(
      currentText.match(
        /(^[^\\]?\*\*(.*?)[^\\]\*\*)|(^[^\\]?__(.*?)[^\\]__)|(^[^\\]?\*(.*?)[^\\]\*)|(^[^\\]?_(.*?)[^\\]_)/
      ),
      "[0]"
    );

    if (!isEmpty(part)) {
      componentArray = [...componentArray, ...parseNewLines(part, key)];
      currentText = currentText.replace(
        new RegExp("^" + escapeRegExp(part)),
        ""
      );
    } else if (escaped) {
      const char = escaped[1];
      componentArray = [...componentArray, <span key={key}>{char}</span>];
      currentText = currentText.replace(
        new RegExp("^" + escapeRegExp(escaped)),
        ""
      );
    } else if (withTag) {
      const tag = get(withTag.match(/^<[^>]+>/), "[0]").replace(/(<|>)/g, "");
      const content = withTag.replace(/((^<[^<>]+>)|(<[^<>]+>$))/g, "");
      const Tag = get(tagToComponent, tag);
      componentArray = [
        ...componentArray,
        <Tag key={key} {...{ content: parseText(content) }} />,
      ];
      currentText = currentText.replace(
        new RegExp("^" + escapeRegExp(withTag)),
        ""
      );
    } else if (markdown) {
      const isBold =
        (get(markdown, "[0]") === "*" &&
          get(markdown, "[1]") === "*" &&
          get(markdown, `[${markdown.length - 1}]`) === "*" &&
          get(markdown, `[${markdown.length - 2}]`) === "*") ||
        (get(markdown, "[0]") === "_" &&
          get(markdown, "[1]") === "_" &&
          get(markdown, `[${markdown.length - 1}]`) === "_" &&
          get(markdown, `[${markdown.length - 2}]`) === "_");

      const tag = isBold ? "b" : "i";
      const content = isBold
        ? markdown.replace(/(^..)|(..$)/, "")
        : markdown.replace(/(^.)|(.$)/, "");
      const Tag = get(tagToComponent, tag);
      componentArray = [
        ...componentArray,
        <Tag key={key} {...{ content: parseText(content) }} />,
      ];
      currentText = currentText.replace(
        new RegExp("^" + escapeRegExp(markdown)),
        ""
      );
    } else {
      const char = currentText[0];
      componentArray = [...componentArray, <span key={key}>{char}</span>];
      currentText = currentText.replace(
        new RegExp("^" + escapeRegExp(char)),
        ""
      );
    }

    key++;
  }

  return componentArray;
};
