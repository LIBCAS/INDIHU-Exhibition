import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import TextField from "react-md/lib/TextFields";
import HelpIcon from "components/help-icon";
import SelectField from "react-md/lib/SelectFields";

import { SignpostScreen, SignpostReferenceType } from "models";
import { AppDispatch } from "store/store";

import { updateScreenData } from "actions/expoActions";
import { SignpostReferenceEnum } from "enums/administration-screens";

// - - -

type HeaderTextFieldProps = { activeScreen: SignpostScreen };

export const HeaderTextField = ({ activeScreen }: HeaderTextFieldProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.signpostScreen",
  });

  return (
    <div className="flex">
      <TextField
        id="screen-signpost-header-textfield"
        label={t("headerLabel")}
        lineDirection="center"
        defaultValue={activeScreen.header ?? ""}
        onChange={(newHeaderValue: string) =>
          dispatch(updateScreenData({ header: newHeaderValue }))
        }
        style={{ width: "100%" }}
      />
      <div className="self-center">
        <HelpIcon
          id="screen-signpost-header-helpIcon"
          label={t("headerTooltip")}
        />
      </div>
    </div>
  );
};

// - - -

type SubheaderTextFieldProps = { activeScreen: SignpostScreen };

export const SubheaderTextField = ({
  activeScreen,
}: SubheaderTextFieldProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.signpostScreen",
  });

  return (
    <div className="flex">
      <TextField
        id="screen-signpost-subheader-textfield"
        label={t("subheaderLabel")}
        lineDirection="center"
        defaultValue={activeScreen.subheader ?? ""}
        onChange={(newSubHeaderValue: string) =>
          dispatch(updateScreenData({ subheader: newSubHeaderValue }))
        }
        style={{ width: "100%" }}
      />
      <div className="self-center">
        <HelpIcon
          id="screen-signpost-subheader-helpIcon"
          label={t("subheaderTooltip")}
        />
      </div>
    </div>
  );
};

// - - -

type ReferenceTypeSelectProps = { activeScreen: SignpostScreen };

export const ReferenceTypeSelect = ({
  activeScreen,
}: ReferenceTypeSelectProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.signpostScreen",
  });

  return (
    <SelectField
      menuItems={[
        {
          label: t("onlyTextOption"),
          value: SignpostReferenceEnum.ONLY_TEXT,
        },
        {
          label: t("onlyImageOption"),
          value: SignpostReferenceEnum.ONLY_IMAGES,
        },
        {
          label: t("bothTextImageOption"),
          value: SignpostReferenceEnum.TEXT_IMAGES,
        },
      ]}
      itemLabel={"label"}
      itemValue={"value"}
      label={t("referenceTypeLabel")}
      position="below"
      id="screen-signpost-referenceType-selectfield"
      defaultValue={activeScreen.referenceType ?? "TEXT_IMAGES"}
      onChange={(newReferenceType: SignpostReferenceType) => {
        dispatch(updateScreenData({ referenceType: newReferenceType }));
      }}
      fullWidth
    />
  );
};
