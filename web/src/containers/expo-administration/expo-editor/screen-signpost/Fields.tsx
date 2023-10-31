import { useDispatch } from "react-redux";

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

  return (
    <div className="flex">
      <TextField
        id="screen-signpost-header-textfield"
        label="Hlavička rozcestníku"
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
          label="Test header help icon label"
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

  return (
    <div className="flex">
      <TextField
        id="screen-signpost-subheader-textfield"
        label="Sub hlavička rozcestníku"
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
          label="Test sub header help icon label"
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

  return (
    <SelectField
      menuItems={[
        {
          label: "Iba text",
          value: SignpostReferenceEnum.ONLY_TEXT,
        },
        {
          label: "Iba obrázok",
          value: SignpostReferenceEnum.ONLY_IMAGES,
        },
        {
          label: "Aj obrázok aj text",
          value: SignpostReferenceEnum.TEXT_IMAGES,
        },
      ]}
      itemLabel={"label"}
      itemValue={"value"}
      label="Vyberte formu odkazov"
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
