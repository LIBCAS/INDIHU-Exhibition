import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

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
import { DialogType } from "components/dialogs/dialog-types";

// Types
import { AppDispatch } from "store/store";
import { SurveyScreen } from "models";
import {
  SurveyAnswer,
  SurveyChoiceAnswer,
} from "containers/views/view-survey/view-survey";

// Redux actions
import { setDialog } from "actions/dialog-actions";

// Utils
import { formatDate } from "utils";
import { palette } from "palette";
import { fetcher } from "utils/fetcher";

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

type SurveyAnswerItem = SurveyAnswer & {
  id: string;
  created: string;
  updated: string;
};

// - - - - - -

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// - - - - - -

type SurveyResultsProps = {
  activeExpoId: string;
  activeScreen: SurveyScreen;
};

const SurveyResults = ({ activeExpoId, activeScreen }: SurveyResultsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.surveyScreen",
  });

  // - - - States - - -

  const [answerItems, setAnswerItems] = useState<
    SurveyAnswerItem[] | undefined
  >(undefined);

  const [isFetchingAnswers, setIsFetchingAnswers] = useState<boolean>(true);
  const [fetchAnswersErrMsg, setFetchAnswersErrMsg] = useState<string>("");

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteErrMsg, setDeleteErrMsg] = useState<string>("");

  // - - - Derived variables - - -

  const surveyAnswers = useMemo(
    () => activeScreen.surveyAnswers,
    [activeScreen.surveyAnswers]
  );

  const answerItemsStats = useMemo(() => {
    if (answerItems === undefined) {
      return null;
    }

    const numberOfAllAnswers = answerItems.length;
    let numberOfChoiseAnswers = 0;

    const freeAnswers: SurveyAnswerItem[] = [];

    // Count answers for CHOICE type
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

    for (const item of answerItems) {
      if (item.answerType === "CHOICE") {
        choiceCounts[item.answer] += 1;
        numberOfChoiseAnswers += 1;
      } else if (item.answerType === "FREE") {
        freeAnswers.push(item);
      } else {
        // pass
      }
    }

    const numberOfFreeAnswers = freeAnswers.length;

    return {
      numberOfAllAnswers,
      numberOfChoiseAnswers,
      numberOfFreeAnswers,
      choiceCounts,
      freeAnswers,
    };
  }, [answerItems]);

  // - - - Callbacks (delete) - - -

  /**
   *
   */
  const handleDeleteAnswersOnServer = useCallback(async () => {
    try {
      setDeleteErrMsg("");
      setIsDeleting(true);

      const expoId = activeExpoId;
      const screenId = activeScreen.id;

      await sleep(1000);
      const resp = await fetcher(`/api/survey/${expoId}/${screenId}`, {
        method: "DELETE",
      });

      const respStatus = resp.status;
      if (respStatus !== 200) {
        throw Error(`Kód chyby: ${respStatus}`);
      }

      // NOTE:
      setAnswerItems([]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const errMsg = `Behom vymazávania odpovedí došlo k nasledujúcej chybe: ${msg}`;
      setDeleteErrMsg(errMsg);
      console.error("[handleDeleteAnswersOnServer]: ", err);
    } finally {
      setIsDeleting(false);
    }
  }, [activeScreen.id, activeExpoId]);

  /**
   *
   */
  const handleDeleteAnswers = useCallback(async () => {
    dispatch(
      setDialog(DialogType.ConfirmDialog, {
        title: <div className="font-bold">Vymazanie všetkých odpovedí</div>,
        text: "Ste si opravdu istý, že chcete vymazať všetky aktuálne zozbierané výsledky pre túto obrazovku ankety?",
        onSubmit: async () => await handleDeleteAnswersOnServer(),
        closeBefore: true,
      })
    );
  }, [dispatch, handleDeleteAnswersOnServer]);

  // - - - Callbacks (fetch) - - -

  const handleFetchSurveyAnswers = useCallback(async () => {
    try {
      setFetchAnswersErrMsg("");
      setIsFetchingAnswers(true);

      const url = `/api/survey/answers/${activeExpoId}/${activeScreen.id}`;
      await sleep(500);
      const response = await fetcher(url, { method: "GET" });
      const respStatus = response.status;
      if (respStatus !== 200) {
        throw Error(`Kód chyby: ${respStatus}`);
      }

      const respBody = (await response.json()) as SurveyAnswerItem[];
      setAnswerItems(respBody);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const errMsg = `Behom získania odpovedí zo serveru došlo k nasledujúcej chybe: ${msg}`;
      setFetchAnswersErrMsg(errMsg);
      console.error(errMsg);
    } finally {
      setIsFetchingAnswers(false);
    }
  }, [activeScreen.id, activeExpoId]);

  // - - - Effects - - -

  /**
   * Effect responsible for fetching survey answers after the component has been mounted
   */
  useEffect(() => {
    handleFetchSurveyAnswers();
  }, [handleFetchSurveyAnswers]);

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

  if (isFetchingAnswers || answerItemsStats === null) {
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
                {Object.entries(answerItemsStats.choiceCounts).map(
                  ([answerType, answerCount], idx) => {
                    const answerTyped =
                      answerType as SurveyChoiceAnswer["answer"];
                    const answerIdx = answerTypeToIdxTranslator[answerTyped];

                    console.log("answerTyped: ", answerTyped);
                    console.log("answerIdx: ", answerIdx);

                    const answerItemAdmin = surveyAnswers[answerIdx];
                    console.log("answerItemAdmin: ", answerItemAdmin);

                    if (answerItemAdmin === undefined) {
                      return null;
                    }

                    return (
                      <TableRow key={idx + 1}>
                        <TableCell align="left">{idx + 1}</TableCell>
                        <TableCell align="left">
                          {answerItemAdmin.customUserLabel ?? answerType}
                        </TableCell>
                        <TableCell align="left">
                          {answerItemAdmin.text ?? "N/A"}
                        </TableCell>
                        <TableCell align="left">{answerCount}</TableCell>
                        <TableCell align="left">
                          {(
                            (answerCount /
                              answerItemsStats.numberOfChoiseAnswers) *
                            100
                          ).toFixed(2)}
                          %
                        </TableCell>
                      </TableRow>
                    );
                  }
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
