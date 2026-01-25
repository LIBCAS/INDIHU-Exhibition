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

// Utils
import { formatDate } from "utils";
import { palette } from "palette";
import { processSurveyAnswersFromServer } from "../utils";

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

  const { isDeleting, deleteErrMsg, handleDeleteAnswersDialog } =
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
    return processSurveyAnswersFromServer(answerItems, surveyAnswers);
  }, [answerItems, surveyAnswers]);

  // - - - GUI - - -

  if (surveyAnswers === undefined) {
    return (
      <div className="container container-tabMenu flex justify-center items-center">
        <div className="mb-16">
          <div className="text-xl">{t("noAdminSurveyAnswersYet")}</div>
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
          <div>{t("loadingSurveyAnswersServer")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="font-bold underline text-xl">{t("surveyResults")}</div>

        <div className="mt-4">
          <div className="flex justify-start items-center gap-2">
            <div className="text-lg">{t("totalNumberOfAnswers")}</div>
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
                  onClick={handleDeleteAnswersDialog}
                >
                  {t("deleteAllAnswersBtnLabel")}
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
          <div className="text-lg underline">{t("choiceAnswersTitle")}</div>

          <div className="mt-2 mb-2">
            <div className="flex justify-start items-center gap-2">
              <div className="text-lg">{t("totalNumberOfChoiceAnswers")}</div>
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
                  <TableCell align="left">{t("answerLabel")}</TableCell>
                  <TableCell align="left">{t("answerText")}</TableCell>
                  <TableCell align="left">{t("answerCount")}</TableCell>
                  <TableCell align="left">{t("answerPercentage")}</TableCell>
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
          <div className="text-lg underline">{t("freeAnswersTitle")}</div>

          <div className="mt-2 mb-2">
            <div className="flex justify-start items-center gap-2">
              <div className="text-lg">{t("totalNumberOfFreeAnswers")}</div>
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
                      <div>{t("answerCreatedAt")}</div>
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
