import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import TextField from "react-md/lib/TextFields";
import HelpIcon from "components/help-icon";

// Models
import { AppDispatch } from "store/store";

// Actions and utils
import { updateScreenData } from "actions/expoActions";

// - - - -

type NumberOfPinsFieldProps = {
  numberOfPinsValue: number;
};

export const NumberOfPinsField = ({
  numberOfPinsValue,
}: NumberOfPinsFieldProps) => {
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.gameFindScreen",
  });

  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex-row-nowrap">
      <div className="full-width">
        <div className="form-input">
          <TextField
            id="game-find-number-of-pins-field"
            label={t("numberOfPinsLabel")}
            type="number"
            defaultValue={numberOfPinsValue}
            onChange={(newNumberOfPinsValue: number) => {
              const numberValue = Number(newNumberOfPinsValue);
              const ok =
                !numberValue ||
                isNaN(numberValue) ||
                numberValue < 1 ||
                numberValue > 10;
              setError(ok ? "Zadejte číslo v rozsahu 1 až 10." : null);

              if (!ok) {
                dispatch(
                  updateScreenData({
                    numberOfPins: numberValue,
                  })
                );
              }
            }}
          />
        </div>

        {error && (
          <div>
            <span className="invalid">{error}</span>
          </div>
        )}
      </div>

      <HelpIcon
        label={t("numberOfPinsTooltip")}
        id="game-find-number-of-pins-help"
      />
    </div>
  );
};
