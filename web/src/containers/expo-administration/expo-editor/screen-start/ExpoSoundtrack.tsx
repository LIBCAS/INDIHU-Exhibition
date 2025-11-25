import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

// Components
import TextField from "react-md/lib/TextFields";
import FontIcon from "react-md/lib/FontIcons";
import Button from "react-md/lib/Buttons/Button";

import HelpIcon from "components/help-icon";
import { DialogType } from "components/dialogs/dialog-types";

// Types
import { AppDispatch } from "store/store";

// Redux (actions)
import { setDialog } from "actions/dialog-actions";
import { updateScreenData } from "actions/expoActions/screen-actions";

// - - - - - -

type ExpoSoundTrackProps = {
  value: string; // NOTE: emptry string if not provided
  textFieldLabel: string;
  helpIconTitle: string;
};

/**
 * Komponenta zodpovedná za nahratie podkresovej hudby k celej výstave.
 * Predstavuje to tretí typ pre hudobnú složku.
 * Aktuálne projekt podporuje audio pre konkrétnu obrazovku, music skrz celú kapitolu.
 * Toto je tretí hudobný formát, jedna hudobná zložka hrajúca skrz celú výstavu, všetky kapitoly.
 * Bacha na miešanie, toto je vhodné len pre výstavy, ktoré napr. nepoužívajú kapitoly a teda nemajú podkresovú hudbu z kapitol a teda použijú toto
 */
const ExpoSoundtrack = ({
  value,
  textFieldLabel,
  helpIconTitle,
}: ExpoSoundTrackProps) => {
  const { t } = useTranslation("expo-editor");
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="row flex-centered">
      <TextField
        id="editor-expo-soundtrack"
        label={textFieldLabel}
        value={value}
        disabled
      />

      <div className="row flex-centered">
        {value !== "" && (
          <FontIcon
            className="icon"
            onClick={() =>
              dispatch(
                setDialog(DialogType.ConfirmDialog, {
                  title: <FontIcon className="color-black">delete</FontIcon>,
                  text: t("descFields.expoSoundtrackDeleteConfirmTitle"),
                  onSubmit: () =>
                    dispatch(updateScreenData({ expoSoundtrack: null })),
                })
              )
            }
          >
            delete
          </FontIcon>
        )}

        <Button
          raised
          label={t("descFields.expoSoundtrackBtnLabel")}
          onClick={() =>
            dispatch(
              setDialog(DialogType.ScreenFileChoose, {
                onChoose: (expoSoundtrack) =>
                  dispatch(
                    updateScreenData({ expoSoundtrack: expoSoundtrack.id })
                  ),
                typeMatch: new RegExp(/^audio\/.*$/),
                accept: "audio/*",
              })
            )
          }
        />

        <HelpIcon label={helpIconTitle} id="editor-expo-soundtrack-help" />
      </div>
    </div>
  );
};

export default ExpoSoundtrack;
