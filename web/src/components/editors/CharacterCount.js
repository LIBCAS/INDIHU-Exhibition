import React from "react";

import { secondsToFormatedTime } from "../../utils";

const CharacterCount = ({ text }) =>
  <p>{`${text
    ? text.length
    : "0"} znaků, předpokládaná délka mluveného slova: ${text
    ? text.split(" ").length / 130 * 60 < 1
      ? "1 s"
      : secondsToFormatedTime(text.split(" ").length / 130 * 60)
    : "0 min"}`}</p>;

export default CharacterCount;
