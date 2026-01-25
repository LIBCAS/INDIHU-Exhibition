import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

// Types
import { SurveyAnswer } from "containers/views/view-survey/view-survey";

// Utils
import { fetcher } from "utils/fetcher";

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

type Props = {
  activeExpoId: string; // NOTE: uuid
  activeScreenId: string; // NOTE: uuid
};

/**
 * Hook responsible for fetching survey answers for single particular screen
 */
const useFetchSurveyAnswers = ({ activeExpoId, activeScreenId }: Props) => {
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.surveyScreen",
  });

  // - - - States - - -

  const [answerItems, setAnswerItems] = useState<
    SurveyAnswerItem[] | undefined
  >(undefined);

  const [isFetchingAnswers, setIsFetchingAnswers] = useState<boolean>(true);
  const [fetchAnswersErrMsg, setFetchAnswersErrMsg] = useState<string>("");

  // - - - Callbacks - - -

  /**
   *
   */
  const handleFetchSurveyAnswers = useCallback(async () => {
    try {
      setFetchAnswersErrMsg("");
      setIsFetchingAnswers(true);

      const url = `/api/survey/answers/${activeExpoId}/${activeScreenId}`;
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
  }, [activeExpoId, activeScreenId]);

  /**
   *
   */
  const handleClearSurveyAnswers = useCallback(() => {
    setAnswerItems([]);
  }, []);

  // - - - Effects - - -

  /**
   * Effect responsible for fetching survey answers after the component has been mounted
   */
  useEffect(() => {
    handleFetchSurveyAnswers();
  }, [handleFetchSurveyAnswers]);

  // - - - Return Value - - -

  return {
    answerItems,
    isFetchingAnswers,
    fetchAnswersErrMsg,
    handleFetchSurveyAnswers,
    handleClearSurveyAnswers,
  };
};

export default useFetchSurveyAnswers;
