import { SurveyAnswer, SurveyAnswerItem } from "./typings";
import { fetcher } from "utils/fetcher";

// - - - - - -

export const fetchSurveyAnswersApi = async (
  expoId: string,
  screenId: string
) => {
  const resp = await fetcher(`/api/survey/answers/${expoId}/${screenId}`, {
    method: "GET",
  });

  const respStatus = resp.status;
  if (respStatus !== 200) {
    throw Error(`Kód chyby: ${respStatus}`);
  }

  const respBody = await resp.json();
  const surveyAnswerItems = respBody as SurveyAnswerItem[];
  return surveyAnswerItems;
};

// - - - - - -

export const postSurveyAnswerApi = async (surveyAnswer: SurveyAnswer) => {
  const resp = await fetcher(`/api/survey/answer`, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(surveyAnswer),
  });

  const respStatus = resp.status;
  if (respStatus !== 200) {
    throw Error(`Kód chyby: ${respStatus}`);
  }
};

// - - - - - -

export const deleteSurveyAnswersApi = async (
  expoId: string,
  screenId: string
) => {
  const resp = await fetcher(`/api/survey/${expoId}/${screenId}`, {
    method: "DELETE",
  });

  const respStatus = resp.status;
  if (respStatus !== 200) {
    throw Error(`Kód chyby: ${respStatus}`);
  }
};
