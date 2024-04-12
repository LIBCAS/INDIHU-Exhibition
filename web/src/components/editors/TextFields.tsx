import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store/store";

import TextField from "react-md/lib/TextFields";
import HelpIcon from "components/help-icon";
import CharacterCount from "./character-count";

import { updateScreenData } from "actions/expoActions";

// - -

type TitleTextFieldProps = { titleValue: string };

export const TitleTextField = ({ titleValue }: TitleTextFieldProps) => {
  const { t } = useTranslation("expo-editor");
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex-row-nowrap">
      <TextField
        id="editor-description-textfield-title"
        label={t("descFields.name")}
        defaultValue={titleValue}
        onChange={(newTitle: string) =>
          dispatch(updateScreenData({ title: newTitle }))
        }
      />
      <HelpIcon
        label={t("descFields.nameScreenTooltip")}
        id="editor-description-title"
      />
    </div>
  );
};

// - -

type TextTextFieldProps = { textValue: string };

export const TextTextField = ({ textValue }: TextTextFieldProps) => {
  const { t } = useTranslation("expo-editor");
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <div className="flex-row-nowrap">
        <TextField
          id="editor-description-textfield-text"
          label={t("descFields.text")}
          rows={5}
          defaultValue={textValue}
          onChange={(newText: string) =>
            dispatch(updateScreenData({ text: newText }))
          }
        />
        <HelpIcon
          label={t("descFields.textTooltip")}
          id="editor-description-text"
        />
      </div>

      <CharacterCount text={textValue} />
    </>
  );
};

// - -

type GameTitleTextFieldProps = { gameTitleValue: string };

export const GameTitleTextField = ({
  gameTitleValue,
}: GameTitleTextFieldProps) => {
  const { t } = useTranslation("expo-editor");
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex-row-nowrap">
      <TextField
        id="game-textfield-name"
        label={t("descFields.gameName")}
        defaultValue={gameTitleValue}
        onChange={(newTitle: string) =>
          dispatch(updateScreenData({ title: newTitle }))
        }
      />
      <HelpIcon
        label={t("descFields.gameNameTooltip")}
        id="editor-game-title"
      />
    </div>
  );
};

// - -

type GameTaskTextFieldProps = { taskValue: string; taskHelpIconLabel: string };

export const GameTaskTextField = ({
  taskValue,
  taskHelpIconLabel,
}: GameTaskTextFieldProps) => {
  const { t } = useTranslation("expo-editor", { keyPrefix: "descFields" });
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex-row-nowrap">
      <TextField
        id="game-textfield-task"
        label={t("gameTask")}
        defaultValue={taskValue}
        onChange={(newTask: string) =>
          dispatch(updateScreenData({ task: newTask }))
        }
      />
      <HelpIcon label={taskHelpIconLabel} id="editor-game-task" />
    </div>
  );
};

// - -

type GameResultTimeTextFieldProps = { resultTimeValue: number };

export const GameResultTimeTextField = ({
  resultTimeValue,
}: GameResultTimeTextFieldProps) => {
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", { keyPrefix: "descFields" });

  return (
    <div className="flex-row-nowrap">
      <div className="full-width">
        <div className="form-input form-input-with-suffix">
          <TextField
            id="game-textfield-result-time"
            label={t("gameResultTime")}
            type="number"
            defaultValue={resultTimeValue}
            onChange={(newResultTimeValue: number) => {
              const numberValue = Number(newResultTimeValue);
              const ok =
                !numberValue ||
                isNaN(numberValue) ||
                numberValue < 1 ||
                numberValue > 1000000;
              setError(ok ? "Zadejte číslo v rozsahu 1 až 1000000." : null);
              dispatch(
                updateScreenData({
                  resultTime: numberValue,
                })
              );
            }}
          />
          <span className="form-input-suffix">vteřin</span>
        </div>
        {error && (
          <div>
            <span className="invalid">{error}</span>
          </div>
        )}
      </div>
      <HelpIcon
        label={t("gameResultTimeTooltip")}
        id="editor-game-result-time"
      />
    </div>
  );
};
