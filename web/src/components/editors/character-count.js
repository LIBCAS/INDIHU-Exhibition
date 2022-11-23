import { secondsToFormatedTime } from "../../utils";

const CharacterCount = ({ text }) => (
  <p>{`${
    text ? text.length : "0"
  } znaků, předpokládaná délka mluveného slova: ${
    text
      ? (text.split(" ").length / 100) * 60 < 1
        ? "1 s"
        : secondsToFormatedTime((text.split(" ").length / 100) * 60)
      : "0 min"
  }`}</p>
);

export default CharacterCount;
