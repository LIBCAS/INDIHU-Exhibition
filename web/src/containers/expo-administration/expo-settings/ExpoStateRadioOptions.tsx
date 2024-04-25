import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
import HelpIcon from "components/help-icon";

import { ActiveExpo } from "models";
import { AppDispatch } from "store/store";

import { changeStateExpo } from "actions/expoActions";
import { expoState } from "enums/expo-state";

// - -

type ExpoStateRadioOptionsProps = {
  activeExpo: ActiveExpo;
};

const ExpoStateRadioOptions = ({ activeExpo }: ExpoStateRadioOptionsProps) => {
  const { t } = useTranslation("expo");
  const dispatch = useDispatch<AppDispatch>();

  const handleExpoStateRadioGroupChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const expoState = e.target.value;
    dispatch(changeStateExpo(activeExpo.id, expoState));
  };

  return (
    <RadioGroup
      name="expo-state-options-radio-group"
      value={activeExpo.state}
      onChange={handleExpoStateRadioGroupChange}
      row={false}
    >
      <FormControlLabel
        value={expoState.PREPARE}
        control={<Radio />}
        label={
          <RadioLabel
            radioLabel={t("expoState.prepare")}
            helpIconLabel={t("expoState.prepareTooltip")}
            helpIconId="state-options-prepare"
          />
        }
      />

      <FormControlLabel
        value={expoState.OPENED}
        control={<Radio />}
        label={
          <RadioLabel
            radioLabel={t("expoState.opened")}
            helpIconLabel={t("expoState.openedTooltip")}
            helpIconId="state-options-opened"
          />
        }
      />

      <FormControlLabel
        value={expoState.ENDED}
        control={<Radio />}
        label={
          <RadioLabel
            radioLabel={t("expoState.ended")}
            helpIconLabel={t("expoState.endedTooltip")}
            helpIconId="state-options-ended"
          />
        }
      />
    </RadioGroup>
  );
};

export default ExpoStateRadioOptions;

// - -

type RadioLabelProps = {
  radioLabel: string;
  helpIconLabel: string;
  helpIconId: string;
};

const RadioLabel = ({
  radioLabel,
  helpIconLabel,
  helpIconId,
}: RadioLabelProps) => {
  return (
    <div className="flex items-center">
      <div>{radioLabel}</div>
      <HelpIcon label={helpIconLabel} id={helpIconId} place="right" />
    </div>
  );
};
