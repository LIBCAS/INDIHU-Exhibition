import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

// Components
import StarRating from "./StarRating";
import PrimaryCheckbox from "./PrimaryCheckbox";
import TextArea from "./TextArea";
import AuthorEmailTextField from "./AuthorEmailTextField";
import SendButton from "./SendButton";

import { FormControlLabel, Checkbox } from "@mui/material";

// Models
import { ExpoRates } from "models";

// Utils
import cx from "classnames";
import { submitRate } from "./submit-rate";

// - -

type RatingPanelProps = {
  expoId: string | undefined;
  openInformationFailDialog: () => void;
  setExpoRates: (
    value: ExpoRates | ((prevValue: ExpoRates) => ExpoRates)
  ) => void;
  closeRatingDialog?: () => void;
};

const RatingPanel = ({
  expoId,
  openInformationFailDialog,
  setExpoRates,
  closeRatingDialog,
}: RatingPanelProps) => {
  const { t } = useTranslation("view-screen", { keyPrefix: "rating" });
  const { isLightMode, palette } = useExpoDesignData();

  const [ratingValue, setRatingValue] = useState<number | null>(null);
  const [isTopicChecked, setIsTopicChecked] = useState<boolean>(false);
  const [isMediaChecked, setIsMediaChecked] = useState<boolean>(false);
  const [isTextChecked, setIsTextChecked] = useState<boolean>(false);
  const [isGameChecked, setIsGameChecked] = useState<boolean>(false);
  const [textValue, setTextValue] = useState<string>("");
  const [reviewerEmail, setReviewerEmail] = useState<string>("");
  const [isWithoutRatingChecked, setIsWithoutRatingChecked] =
    useState<boolean>(false);

  //
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  //
  const numberOfCheckedCheckboxes = useMemo(() => {
    let counter = 0;
    if (isTopicChecked) counter++;
    if (isMediaChecked) counter++;
    if (isTextChecked) counter++;
    if (isGameChecked) counter++;
    return counter;
  }, [isGameChecked, isMediaChecked, isTextChecked, isTopicChecked]);

  //
  const canRatingBeSubmitted = useMemo(() => {
    // With checkbox -> text (vzkaz) is mandatory, contactEmail is optional, other fields are ignored
    if (isWithoutRatingChecked) {
      return textValue.length !== 0;
    }

    // Without checkbox -> rating, checkboxes and text are mandatory (text can be empty string but cannot be null)
    // contactEmail is optional
    return (
      ratingValue !== null &&
      (numberOfCheckedCheckboxes === 1 || numberOfCheckedCheckboxes === 2)
    );
  }, [
    isWithoutRatingChecked,
    numberOfCheckedCheckboxes,
    ratingValue,
    textValue.length,
  ]);

  const onSubmit = async () => {
    if (!canRatingBeSubmitted) {
      return;
    }
    if (!expoId) {
      return;
    }

    setIsSubmitting(true);

    const rateFormData = {
      rating: ratingValue,
      preferences: {
        topic: isTopicChecked,
        media: isMediaChecked,
        text: isTextChecked,
        game: isGameChecked,
      },
      text: textValue,
      reviewerContactEmail: reviewerEmail,
      isSendWithoutRating: isWithoutRatingChecked,
    };

    // Submit
    const isSuccess = await submitRate(rateFormData, expoId);
    setIsSubmitting(false);
    if (!isSuccess) {
      closeRatingDialog?.();
      openInformationFailDialog();
      return;
    }

    // If in dialog, close it after successful rate
    closeRatingDialog?.();

    // Mark this exposition as marked, do not show this rating panel again
    if (setExpoRates && expoId) {
      setExpoRates((prev) => ({ ...prev, [expoId]: true }));
    }
  };

  return (
    <div
      className={cx("flex flex-col items-center gap-5", {
        "p-0 mt-6": !closeRatingDialog, // if not in dialog, inside panel
        "px-8 py-4": closeRatingDialog, // if in dialog
      })}
    >
      {/* Rating Box */}
      <div className="flex flex-col gap-3 w-full items-center">
        <div className="text-xl font-bold">{t("overallRating")}</div>
        <StarRating value={ratingValue} setValue={setRatingValue} />
      </div>

      {/* Checkbox section */}
      <div className="flex flex-col gap-3 w-full items-center">
        <div className="text-xl font-bold">
          {t("whatYouLikedMost")}{" "}
          <span className="text-lg">{t("max2Options")}</span>
        </div>

        <div className="flex flex-row w-full justify-center gap-4">
          <PrimaryCheckbox
            label={t("topicOption")}
            isChecked={isTopicChecked}
            setIsChecked={setIsTopicChecked}
            disabled={numberOfCheckedCheckboxes >= 2 && !isTopicChecked}
          />
          <PrimaryCheckbox
            label={t("mediaOption")}
            isChecked={isMediaChecked}
            setIsChecked={setIsMediaChecked}
            disabled={numberOfCheckedCheckboxes >= 2 && !isMediaChecked}
          />
          <PrimaryCheckbox
            label={t("textOption")}
            isChecked={isTextChecked}
            setIsChecked={setIsTextChecked}
            disabled={numberOfCheckedCheckboxes >= 2 && !isTextChecked}
          />
          <PrimaryCheckbox
            label={t("gameOption")}
            isChecked={isGameChecked}
            setIsChecked={setIsGameChecked}
            disabled={numberOfCheckedCheckboxes >= 2 && !isGameChecked}
          />
        </div>
      </div>

      {/* TextArea section */}
      <div className="flex flex-col gap-3 w-full items-center">
        <div className="text-xl font-bold">{t("messageToTheExpoCreator")}</div>
        <TextArea
          value={textValue}
          setValue={setTextValue}
          placeholder={t("messageToTheExpoCreatorPlaceholder")}
          fullWidth
          rows={4}
        />
      </div>

      {/* Reviewer can leave reference to him */}
      <div className="flex flex-col gap-3 w-full items-center">
        <div className="text-xl font-bold">{t("linkToReviewer")}</div>
        <div className="w-full">
          <AuthorEmailTextField
            reviewerEmail={reviewerEmail}
            setReviewerEmail={setReviewerEmail}
          />
        </div>
      </div>

      <div>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={isWithoutRatingChecked}
              onChange={(e) => setIsWithoutRatingChecked(e.target.checked)}
              sx={{
                "& .MuiSvgIcon-root": {
                  color: isLightMode ? undefined : palette["white"],
                },
              }}
            />
          }
          label={t("sendWithoutRatingCheckboxLabel")}
        />
      </div>

      {/* Send Button */}
      <div className="mt-2">
        <SendButton
          disabled={!canRatingBeSubmitted || isSubmitting}
          onClick={onSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default RatingPanel;
