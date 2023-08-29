import { useDispatch } from "react-redux";

import {
  GameQuizAnswersTypeSelect,
  GameQuizTypeSelect,
} from "./QuizSelectFields";
import AnswerItem from "./AnswerItem";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import { ScreenGameQuizProps } from "../Description";
import { AppDispatch } from "store/store";
import { File as IndihuFile } from "models";

import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions";

const Answers = (props: ScreenGameQuizProps) => {
  const { activeScreen } = props;
  const dispatch = useDispatch<AppDispatch>();

  const areAnswersFull = activeScreen.answers.length >= 8;

  return (
    <div className="container-big container-tabMenu">
      <div className="screen">
        <div className="w-fit m-auto mb-16 flex flex-col gap-2 items-start xl:flex-row xl:w-auto xl:justify-center xl:gap-8">
          <GameQuizAnswersTypeSelect activeScreen={activeScreen} />
          <GameQuizTypeSelect activeScreen={activeScreen} />
        </div>

        <div className="max-w-full flex flex-col gap-2">
          {activeScreen.answers?.map((currAnswer, currAnswerIndex) => {
            const currAnswerImageId =
              activeScreen?.answers?.[currAnswerIndex]?.image;

            const currAnswerImageFile = dispatch(
              getFileById(currAnswerImageId)
            );

            const setCurrAnswerImage = (image: IndihuFile) => {
              dispatch(
                updateScreenData({
                  answers: activeScreen?.answers?.map((currAns, idx) =>
                    currAnswerIndex === idx
                      ? { ...currAns, image: image.id, infopoints: [] }
                      : currAns
                  ),
                })
              );
            };

            return (
              <AnswerItem
                key={currAnswerIndex}
                currAnswer={currAnswer}
                currAnswerIndex={currAnswerIndex}
                activeScreen={activeScreen}
                currAnswerImage={currAnswerImageFile}
                setCurrAnswerImage={setCurrAnswerImage}
              />
            );
          })}

          {/* Add New Option Button */}
          {!areAnswersFull && (
            <div className="w-full flex justify-center items-center mt-6">
              <Button
                color="secondary"
                iconBefore={<Icon name="add" />}
                onClick={() => {
                  dispatch(
                    updateScreenData({
                      answers: [
                        ...activeScreen.answers,
                        { correct: false, text: "", image: null },
                      ],
                    })
                  );
                }}
              >
                Pridat novú možnosť
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Answers;
