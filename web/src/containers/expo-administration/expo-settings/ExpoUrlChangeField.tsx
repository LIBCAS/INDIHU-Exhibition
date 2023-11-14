import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import Snackbar from "components/snackbar/Snackbar";
import Button from "react-md/lib/Buttons/Button";
import TextField from "react-md/lib/TextFields";

import { AppDispatch } from "store/store";

import { setDialog } from "actions/dialog-actions";
import { checkExpoURL } from "actions/expoActions";
import { DialogType } from "components/dialogs/dialog-types";

// - -

const testUrlValid = (urlValue: string) => {
  if (urlValue === "") {
    return "*URL nemôže byť prázdny text";
  }
  if (!/^[a-z0-9-]*$/i.test(urlValue)) {
    return "*URL může obsahovat jenom znaky abecedy, čísla a pomlčku";
  }
  return "";
};

// - -

type ExpoUrlChangeFieldProps = { expoUrl: string };

const ExpoUrlChangeField = ({ expoUrl }: ExpoUrlChangeFieldProps) => {
  const { t } = useTranslation("expo");
  const dispatch = useDispatch<AppDispatch>();

  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);

  const [urlValue, setUrlValue] = useState<string>(expoUrl);
  const [urlValueErrMsg, setUrlValueErrMsg] = useState<string>("");

  useEffect(() => {
    setUrlValueErrMsg(testUrlValid(urlValue));
  }, [urlValue]);

  const handleActualize = async () => {
    if (urlValueErrMsg !== "" || urlValue === "") {
      return;
    }

    const checkResult = await dispatch(checkExpoURL(urlValue));
    if (checkResult) {
      dispatch(
        setDialog(DialogType.InfoDialog, {
          title: "Úspešná změna url výstavy",
          text: "Url výstavy byla úspěšně změněna.",
        })
      );
    } else {
      setUrlValueErrMsg("*Tato URL adresa je již obsazena.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        <div className="pt-1 text-lg text-[#5e5e5e] mr-1">{`${window.location.origin}/view/`}</div>
        <div className="flex flex-col">
          <div>
            <TextField
              value={urlValue}
              onChange={(newUrlValue: string) => setUrlValue(newUrlValue)}
            />
          </div>
          {urlValueErrMsg && (
            <div className="text-[#ea5d5d]">{urlValueErrMsg}</div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-end items-center gap-2">
        <Button
          raised
          label={t("settingsAndSharing.copyUrlLabel")}
          onClick={() => {
            const urlToCopy = `${window.location.origin}/view/${expoUrl}`;
            navigator.clipboard.writeText(urlToCopy);
            setIsSnackbarOpen(true);
          }}
        />
        <Button raised label="Storno" onClick={() => setUrlValue(expoUrl)} />
        <Button
          raised
          label={t("settingsAndSharing.actualizeLabel")}
          onClick={handleActualize}
        />
      </div>

      <Snackbar
        isOpen={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
        message={t("settingsAndSharing.copyUrlMessage")}
      />
    </div>
  );
};

export default ExpoUrlChangeField;
