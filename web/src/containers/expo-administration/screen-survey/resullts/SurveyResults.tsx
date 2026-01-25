import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// Hooks
import useFetchSurveyAnswers from "../hooks/useFetchSurveyAnswers";
import useDeleteSurveyAnswers from "../hooks/useDeleteSurveyAnswers";

// Components
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

import { Spinner } from "components/loaders/spinner";
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

// Types
import { SurveyScreen } from "models";
import {
  SurveyChoiceAnswer,
  SurveyChoiseAnswerItem,
  SurveyFreeAnswerItem,
} from "../typings";

// Utils
import { formatDate } from "utils";
import { palette } from "palette";

// - - - - - -

const answerTypeToIdxTranslator = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
};

// - - - - - -

type SurveyResultsProps = {
  activeExpoId: string;
  activeScreen: SurveyScreen;
};

const SurveyResults = ({ activeExpoId, activeScreen }: SurveyResultsProps) => {
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.surveyScreen",
  });

  // - - - Hooks - - -

  const {
    answerItems,
    isFetchingAnswers,
    fetchAnswersErrMsg,
    handleClearSurveyAnswers,
  } = useFetchSurveyAnswers({
    activeExpoId: activeExpoId,
    activeScreenId: activeScreen.id,
  });

  const { isDeleting, deleteErrMsg, handleDeleteAnswers } =
    useDeleteSurveyAnswers({
      activeExpoId: activeExpoId,
      activeScreenId: activeScreen.id,
      handleClearSurveyAnswers: handleClearSurveyAnswers,
    });

  // - - - Derived variables - - -

  const surveyAnswers = useMemo(
    () => activeScreen.surveyAnswers,
    [activeScreen.surveyAnswers]
  );

  const answerItemsStats = useMemo(() => {
    // 1)
    if (answerItems === undefined) {
      return undefined;
    }
    if (surveyAnswers === undefined) {
      return undefined;
    }

    // 2)
    const choiceAnswers: SurveyChoiseAnswerItem[] = [];
    const freeAnswers: SurveyFreeAnswerItem[] = [];

    for (const item of answerItems) {
      if (item.answerType === "CHOICE") {
        choiceAnswers.push(item);
      } else if (item.answerType === "FREE") {
        freeAnswers.push(item);
      } else {
        // pass
      }
    }

    const numberOfAllAnswers = answerItems.length;
    const numberOfFreeAnswers = freeAnswers.length;
    const numberOfChoiseAnswers = choiceAnswers.length;

    // 3)
    const choiceCounts: Record<SurveyChoiceAnswer["answer"], number> = {
      a: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      f: 0,
      g: 0,
      h: 0,
    };

    for (const item of choiceAnswers) {
      choiceCounts[item.answer] += 1;
    }

    // 4)
    type SingleChoiceAnswerData = {
      answerCount: number;
      answerLabel: string;
      answerText: string;
      answerPercentage: string;
    };

    type ChoiceAnswersData = Partial<
      Record<SurveyChoiceAnswer["answer"], SingleChoiceAnswerData>
    >;

    const choiceData: ChoiceAnswersData = {};

    for (const item of Object.entries(choiceCounts)) {
      const [answerType, answerCount] = item;
      const answerTypeTyped = answerType as SurveyChoiceAnswer["answer"];

      const idx = answerTypeToIdxTranslator[answerTypeTyped];
      const surveyAnswerAdministration = surveyAnswers?.[idx];

      // NOTE: This can easily happen - when not all 8 answer items are used in administration
      if (surveyAnswerAdministration === undefined) {
        continue;
      }

      const customUserLabel = surveyAnswerAdministration?.customUserLabel;
      const text = surveyAnswerAdministration?.text;

      const answerRatio =
        numberOfChoiseAnswers === 0 ? 0 : answerCount / numberOfChoiseAnswers;
      const answerPercentage = isNaN(answerRatio)
        ? "-"
        : `${(answerRatio * 100).toFixed(2)}%`;

      const newObj: SingleChoiceAnswerData = {
        answerCount: answerCount,
        answerLabel: customUserLabel ?? answerTypeTyped,
        answerText: text ?? "N/A",
        answerPercentage: answerPercentage,
      };

      choiceData[answerTypeTyped] = newObj;
    }

    return {
      answerItems,
      choiceAnswers,
      freeAnswers,

      numberOfAllAnswers,
      numberOfChoiseAnswers,
      numberOfFreeAnswers,

      choiceData,
    };
  }, [answerItems, surveyAnswers]);

  // - - - GUI - - -

  if (surveyAnswers === undefined) {
    return (
      <div className="container container-tabMenu flex justify-center items-center">
        <div className="mb-16">
          <div className="text-xl">
            Neboli ešte vytvorené žiadne odpovede pre túto obrazovku varianty.
          </div>
        </div>
      </div>
    );
  }

  if (fetchAnswersErrMsg !== "") {
    return (
      <div className="container container-tabMenu flex justify-center items-center">
        <div className="mb-16">
          <div className="text-xl text-danger">{fetchAnswersErrMsg}</div>
        </div>
      </div>
    );
  }

  if (isFetchingAnswers || answerItemsStats === undefined) {
    return (
      <div className="container container-tabMenu flex justify-center items-center">
        <div className="mb-16 flex-col justify-start items-center gap-2">
          <Spinner />
          <div>Načitávam odpovedi zo serveru ...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="font-bold underline text-xl">Výsledky ankety:</div>

        <div className="mt-4">
          <div className="flex justify-start items-center gap-2">
            <div className="text-lg">Celkový počet všetkých odpovedí: </div>
            <div className="text-lg">{answerItemsStats.numberOfAllAnswers}</div>
          </div>

          <div className="mt-2">
            <div className="flex flex-col gap-2">
              <div className="flex justify-start items-center gap-4">
                <Button
                  color="secondary"
                  type="contained"
                  big
                  shadow
                  disabled={isDeleting}
                  iconBefore={<Icon name="delete" />}
                  onClick={handleDeleteAnswers}
                >
                  Vymazat všetky odpovědi
                </Button>

                {isDeleting && (
                  <div>
                    <Spinner className="w-8 h-8 border-x-secondary border-t-secondary" />
                  </div>
                )}
              </div>

              {deleteErrMsg !== "" && (
                <div className="text-danger text-start">{deleteErrMsg}</div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="text-lg underline">Varianta odpovede:</div>

          <div className="mt-2 mb-2">
            <div className="flex justify-start items-center gap-2">
              <div className="text-lg">Celkový počet odpovedí varianty: </div>
              <div className="text-lg">
                {answerItemsStats.numberOfChoiseAnswers}
              </div>
            </div>
          </div>

          <TableContainer>
            <Table
              aria-label="survey-results-table"
              sx={{
                "& .MuiTableRow-root": {
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    backgroundColor: "#ececec",
                  },
                },
                "& .MuiTableCell-root": {},
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell align="left">x</TableCell>
                  <TableCell align="left">Označenie odpovede</TableCell>
                  <TableCell align="left">Textácia odpovede</TableCell>
                  <TableCell align="left">Celkový počet odpovedí</TableCell>
                  <TableCell align="left">Procento z celku</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {Object.entries(answerItemsStats.choiceData).map(
                  (
                    [
                      _answerType,
                      {
                        answerCount,
                        answerLabel,
                        answerText,
                        answerPercentage,
                      },
                    ],
                    idx
                  ) => (
                    <TableRow key={idx + 1}>
                      <TableCell align="left">{idx + 1}</TableCell>
                      <TableCell align="left">{answerLabel}</TableCell>
                      <TableCell align="left">{answerText}</TableCell>
                      <TableCell align="left">{answerCount}</TableCell>
                      <TableCell align="left">{answerPercentage}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div className="mt-12">
          <div className="text-lg underline">Voľné odpovede:</div>

          <div className="mt-2 mb-2">
            <div className="flex justify-start items-center gap-2">
              <div className="text-lg">Celkový počet voľných odpovedí: </div>
              <div className="text-lg">
                {answerItemsStats.numberOfFreeAnswers}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {answerItemsStats.freeAnswers.map((answer, idx) => {
              return (
                <div
                  key={`${answer.id}-${idx}`}
                  className="px-4 py-3 flex flex-col gap-3 border-solid border-2 rounded-md"
                  style={{
                    borderColor: palette["medium-gray"],
                    backgroundColor: palette["light-gray"],
                  }}
                >
                  <div className="text-base">{answer.answer}</div>

                  <div className="flex flex-col justify-end items-end gap-1 md:flex-row md:items-center md:gap-3">
                    <div className="flex gap-1 items-center text-sm italic">
                      <div>Vytvořeno: </div>
                      <div>{formatDate(answer.created)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyResults;
