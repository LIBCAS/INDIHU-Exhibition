import { secondsToFormatedTime } from "../../utils";

type CharacterCountProps = { text?: string };

const CharacterCount = ({ text = "" }: CharacterCountProps) => {
  const textLength = text.length;
  const calculation = (text.split(" ").length / 100) * 60;
  const expectedLength =
    calculation < 1 ? "1 s" : secondsToFormatedTime(calculation);

  return (
    <p>
      {textLength} znaků, předpokládaná délka mluveného slova: {expectedLength}
    </p>
  );
};

export default CharacterCount;

// return (
//   <p>{`${
//     text ? text.length : "0"
//   } znaků, předpokládaná délka mluveného slova: ${
//     text
//       ? (text.split(" ").length / 100) * 60 < 1
//         ? "1 s"
//         : secondsToFormatedTime((text.split(" ").length / 100) * 60)
//       : "0 min"
//   }`}</p>
// );
