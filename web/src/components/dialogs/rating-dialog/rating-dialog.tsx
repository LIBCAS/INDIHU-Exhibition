import { useState, useMemo } from "react";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

import DialogWrap from "../dialog-wrap-noredux-typed";

// Components
import { StarRating, PrimaryCheckbox, TextArea } from "components/form/mui";
import { Icon } from "components/icon/icon";

// Models
import { ExpoRates } from "models";

// Utils
import cx from "classnames";
import { submitRate } from "./submit-rate";
import { Spinner } from "components/loaders/spinner";

// - - - - - - - -

// Type meaning of "empty object"
export type RatingDialogProps = {
  closeThisDialog: () => void;
  openInformationFailDialog: () => void;
  setExpoRates: (
    value: ExpoRates | ((prevValue: ExpoRates) => ExpoRates)
  ) => void;
  expoId: string;
};

export const RatingDialog = ({
  closeThisDialog,
  openInformationFailDialog,
  setExpoRates,
  expoId,
}: RatingDialogProps) => {
  const [ratingValue, setRatingValue] = useState<number | null>(null);
  const [textValue, setTextValue] = useState<string>("");
  const [isTopicChecked, setIsTopicChecked] = useState<boolean>(false);
  const [isMediaChecked, setIsMediaChecked] = useState<boolean>(false);
  const [isTextChecked, setIsTextChecked] = useState<boolean>(false);
  const [isGameChecked, setIsGameChecked] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const numberOfCheckedCheckboxes = useMemo(() => {
    let counter = 0;
    if (isTopicChecked) counter++;
    if (isMediaChecked) counter++;
    if (isTextChecked) counter++;
    if (isGameChecked) counter++;
    return counter;
  }, [isGameChecked, isMediaChecked, isTextChecked, isTopicChecked]);

  const onSubmit = async () => {
    if (!expoId || !ratingValue) {
      return;
    }

    setIsSubmitting(true);
    const rateFormData = {
      rating: ratingValue,
      text: textValue,
      preferences: {
        topic: isTopicChecked,
        media: isMediaChecked,
        text: isTextChecked,
        game: isGameChecked,
      },
    };

    // Submit
    const isSuccess = await submitRate(rateFormData, expoId);
    setIsSubmitting(false);
    if (!isSuccess) {
      openInformationFailDialog();
      return;
    }
    // After successful submit, close Rating dialog
    closeThisDialog();

    // Mark this exposition as marked, do not show this rating dialog again
    if (setExpoRates && expoId) {
      setExpoRates((prev) => ({ ...prev, [expoId]: true }));
    }
  };

  return (
    <DialogWrap
      closeThisDialog={closeThisDialog}
      title={
        <div className="text-2xl font-medium">Jak se vám líbila výstava?</div>
      }
      big
      noDialogMenu
      closeOnEsc
      applyTheming
    >
      <div className="px-8 py-4 flex flex-col items-center gap-5">
        {/* Rating Box */}
        <div className="flex flex-col gap-3 w-full items-center">
          <div className="text-xl font-bold">Celkové hodnocení</div>
          <StarRating value={ratingValue} setValue={setRatingValue} />
        </div>

        {/* Checkbox section */}
        <div className="flex flex-col gap-3 w-full items-center">
          <div className="text-xl font-bold">
            Co se vám nejvíce líbilo?{" "}
            <span className="text-lg">(max. 2 možnosti)</span>
          </div>

          <div className="flex flex-row w-full justify-center gap-4">
            <PrimaryCheckbox
              label="Téma"
              isChecked={isTopicChecked}
              setIsChecked={setIsTopicChecked}
              disabled={numberOfCheckedCheckboxes >= 2 && !isTopicChecked}
            />
            <PrimaryCheckbox
              label="Obrázky a videa"
              isChecked={isMediaChecked}
              setIsChecked={setIsMediaChecked}
              disabled={numberOfCheckedCheckboxes >= 2 && !isMediaChecked}
            />
            <PrimaryCheckbox
              label="Texty"
              isChecked={isTextChecked}
              setIsChecked={setIsTextChecked}
              disabled={numberOfCheckedCheckboxes >= 2 && !isTextChecked}
            />
            <PrimaryCheckbox
              label="Hry"
              isChecked={isGameChecked}
              setIsChecked={setIsGameChecked}
              disabled={numberOfCheckedCheckboxes >= 2 && !isGameChecked}
            />
          </div>
        </div>

        {/* TextArea section */}
        <div className="flex flex-col gap-3 w-full items-center">
          <div className="text-xl font-bold">Vzkaz tvůrci</div>
          <TextArea
            value={textValue}
            setValue={setTextValue}
            placeholder="V případe záujmu o odpoveď zanechte ve vzkazu svuj e-mail."
            fullWidth
            rows={4}
          />
        </div>

        {/* Send Button */}
        <div className="mt-2">
          <SendButton
            disabled={
              ratingValue === null ||
              numberOfCheckedCheckboxes === 0 ||
              isSubmitting
            }
            onClick={onSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </DialogWrap>
  );
};

// - - - - - - - - -

type SendButtonProps = {
  disabled?: boolean;
  onClick?: () => void;
  isSubmitting: boolean;
};

const SendButton = ({ disabled, onClick, isSubmitting }: SendButtonProps) => {
  const { isLightMode } = useExpoDesignData();

  return (
    <button
      className={cx(
        "p-4 bg-black text-white font-bold text-xl flex items-center gap-4",
        {
          "!text-disabled-dark !bg-disabled-light": disabled && isLightMode,
          "!text-gray !bg-dark-gray": disabled && !isLightMode,
        }
      )}
      disabled={disabled}
      onClick={onClick}
    >
      Odeslat
      {!isSubmitting && (
        <Icon name="send" useMaterialUiIcon style={{ fontSize: "24px" }} />
      )}
      {isSubmitting && (
        <Spinner
          scale={1}
          style={{ width: "24px", height: "24px", fontSize: "24px" }}
        />
      )}
    </button>
  );
};
