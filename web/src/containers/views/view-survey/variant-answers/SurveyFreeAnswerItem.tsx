import { useState, ChangeEvent, useMemo } from "react";

// Hooks
import { useTranslation } from "react-i18next";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

//  Components
import { Grid } from "@mui/material";
import { TextField } from "@mui/material";

// Utils
import cx from "classnames";

// - - - - - -

const SURVEY_FREE_ANSWER_MAX_LENGTH = 150;

// - - - - -

type SurveyFreeAnswerItemProps = {
  isGameFinished: boolean;
  isAnswerMarked: boolean;
  handleMarkThisAnswer: () => void;
};

const SurveyFreeAnswerItem = ({
  isGameFinished,
  isAnswerMarked,
  handleMarkThisAnswer,
}: SurveyFreeAnswerItemProps) => {
  const { t } = useTranslation("view-screen", { keyPrefix: "surveyScreen" });
  const { isLightMode, palette } = useExpoDesignData();

  // - - - States - - -

  const [freeAnswerText, setFreeAnswerText] = useState<string>("");

  // - - - Derived variables - - -

  const isTextTooLong = useMemo<boolean>(
    () => freeAnswerText.length > SURVEY_FREE_ANSWER_MAX_LENGTH,
    [freeAnswerText.length]
  );

  // - - - GUI - - -

  return (
    <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
      <div
        onClick={() => handleMarkThisAnswer()}
        className={cx(
          "relative h-full flex flex-col gap-0 self-stretch p-4 md:p-10 border-4 border-solid border-transparent rounded-md bg-transparent hover:bg-light-gray/10 cursor-pointer",
          {
            "p-2": true,
            "border-gray": !isAnswerMarked && !isGameFinished,
            "border-blue !bg-[#3d7eca4d]": isAnswerMarked && !isGameFinished,
          }
        )}
      >
        <TextField
          variant="filled"
          multiline
          rows={8}
          minRows={undefined}
          maxRows={undefined}
          placeholder={t("freeAnswerPlaceholder")}
          fullWidth={true}
          disabled={false}
          sx={{
            "& .MuiInputBase-root": {
              borderRadius: "0px",
              padding: "16px 16px",
              backgroundColor: isLightMode
                ? palette["light-gray"]
                : palette["medium-gray"],
              "&.Mui-focused": {
                backgroundColor: isLightMode
                  ? palette["light-gray"]
                  : palette["medium-gray"],
              },
              "&:hover": {
                backgroundColor: isLightMode
                  ? palette["light-gray"]
                  : palette["medium-gray"],
              },
            },
            "& .MuiInputBase-inputMultiline": {
              fontSize: "16px",
            },
            "& .MuiFilledInput-underline:after": {
              borderBottom: "none",
            },
          }}
          value={freeAnswerText}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setFreeAnswerText(event.target.value);
          }}
        />

        <div className="mt-1 mx-1 flex justify-between items-center gap-4">
          <div className="text-sm text-warning">
            {isTextTooLong ? t("freeAnswerTooLongMsg") : ""}
          </div>

          <div
            className="text-right text-base"
            style={{
              color: isLightMode
                ? palette["light-gray"]
                : palette["medium-gray"],
            }}
          >
            {freeAnswerText.length}/{SURVEY_FREE_ANSWER_MAX_LENGTH}
          </div>
        </div>
      </div>
    </Grid>
  );
};

export default SurveyFreeAnswerItem;
