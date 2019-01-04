import React from "react";
import { forEach, get, isEmpty, escapeRegExp } from "lodash";

const tagToComponent = {
  b: ({ content }) =>
    <b>
      {content}
    </b>,
  i: ({ content }) =>
    <i>
      {content}
    </i>
};

const parseNewLines = (text, baseKey) => {
  let currentText = text;
  const componentArray = [];

  let key = 0;
  while (currentText !== "") {
    let part = "";
    let newLine = false;

    forEach(currentText, char => {
      if (char === "\n") {
        newLine = true;
        return false;
      }
      part += char;
      return true;
    });

    if (part !== "") {
      componentArray.push(
        <span {...{ key: `${baseKey}/${key}` }}>
          {part}
        </span>
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

export const parseText = text => {
  let currentText = text;
  let componentArray = [];

  let key = 0;
  while (currentText !== "") {
    const part = get(currentText.match(/^([^<]*)/), "[0]");
    const withTag = get(
      currentText.match(/(^<b>(.*?)<\/b>)|(^<i>(.*?)<\/i>)/),
      "[0]"
    );

    if (!isEmpty(part)) {
      componentArray = [...componentArray, ...parseNewLines(part, key)];
      currentText = currentText.replace(
        new RegExp("^" + escapeRegExp(part)),
        ""
      );
    } else if (withTag) {
      const tag = get(withTag.match(/^<[^>]+>/), "[0]").replace(/(<|>)/g, "");
      const content = withTag.replace(/((^<[^<>]+>)|(<[^<>]+>$))/g, "");
      const Tag = get(tagToComponent, tag);
      componentArray = [
        ...componentArray,
        <Tag {...{ key, content: parseText(content) }} />
      ];
      currentText = currentText.replace(
        new RegExp("^" + escapeRegExp(withTag)),
        ""
      );
    } else {
      const char = currentText[0];
      componentArray = [
        ...componentArray,
        <span {...{ key }}>
          {char}
        </span>
      ];
      currentText = currentText.replace(
        new RegExp("^" + escapeRegExp(char)),
        ""
      );
    }

    key++;
  }

  return componentArray;
};
