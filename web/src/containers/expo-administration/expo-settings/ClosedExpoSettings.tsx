import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";

// Components
import { TextField, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import Button from "react-md/lib/Buttons/Button";
import HelpIcon from "components/help-icon";

// Models
import { ActiveExpo, File as IndihuFile } from "models";
import { AppDispatch } from "store/store";

// Actions and utils
import { getFileById } from "actions/file-actions-typed";
import { setDialog } from "actions/dialog-actions";
import { updateExpo } from "actions/expoActions";
import { DialogType } from "components/dialogs/dialog-types";
import { useActiveExpoAccess } from "context/active-expo-access-provider/active-expo-access-provider";

// - - -

type ClosedExpoSettingsProps = {
  activeExpo: ActiveExpo;
};

const ClosedExpoSettings = ({ activeExpo }: ClosedExpoSettingsProps) => {
  const { t } = useTranslation("expo");
  const dispatch = useDispatch<AppDispatch>();

  const { isReadWriteAccess } = useActiveExpoAccess();

  const [closedPicture, setClosedPicture] = useState<IndihuFile | null>(null);
  const [closedUrlValue, setClosedUrlValue] = useState<string>(
    activeExpo.closedUrl ?? ""
  );
  const [closedCaptionValue, setClosedCaptionValue] = useState<string>(
    activeExpo.closedCaption ?? ""
  );

  const isClosedCaptionErr = useMemo(
    () => closedCaptionValue.length > 200,
    [closedCaptionValue]
  );

  useEffect(() => {
    const closedPictureFileId = activeExpo?.closedPicture;
    const closedPictureFile = dispatch(getFileById(closedPictureFileId));
    setClosedPicture(closedPictureFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeExpo]);

  // - -

  const handleSave = async () => {
    if (isClosedCaptionErr) {
      return;
    }
    const isSucc = await dispatch(
      updateExpo({
        ...activeExpo,
        closedPicture: closedPicture ? closedPicture.id : null,
        closedUrl: closedUrlValue,
        closedCaption: closedCaptionValue,
      })
    );

    if (!isSucc) {
      dispatch(
        setDialog(DialogType.InfoDialog, {
          title: "Neúspešné uloženie",
          text: "Nepodařilo se uložit změny.",
        })
      );
    }
  };

  // - -

  return (
    <div className="flex flex-col gap-5">
      {/* 1. Closed picture */}
      <div className="flex items-center gap-1">
        <div className="flex-grow">
          <TextField
            variant="standard"
            label={t("settingsAndSharing.expoEndedInfo.backgroundImage")}
            value={closedPicture ? closedPicture.name : ""}
            disabled
            fullWidth
            inputProps={{
              style: { fontFamily: "Work Sans", fontSize: "16px" },
            }}
            sx={{
              "& .MuiFormLabel-root.Mui-focused": {
                color: "#083d77",
              },
              "& .MuiInputBase-root:after": {
                borderBottomColor: "#083d77",
              },
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "black",
              },
            }}
          />
        </div>

        {closedPicture && (
          <IconButton
            onClick={() => {
              dispatch(
                setDialog(DialogType.ConfirmDialog, {
                  title: <Delete />,
                  text: "Opravdu chcete odstranit obrázek?",
                  onSubmit: () => setClosedPicture(null),
                })
              );
            }}
            disabled={!isReadWriteAccess}
          >
            <Delete />
          </IconButton>
        )}

        <Button
          raised
          label={t("settingsAndSharing.selectLabel")}
          onClick={() => {
            dispatch(
              setDialog(DialogType.ScreenFileChoose, {
                onChoose: setClosedPicture,
                typeMatch: new RegExp(/^image\/.*$/),
                accept: "image/*",
              })
            );
          }}
          disabled={!isReadWriteAccess}
        />

        <HelpIcon
          label={t("settingsAndSharing.expoEndedInfo.backgroundImageTooltip")}
          id="expo-settings-closed-expo-image"
          place="left"
        />
      </div>

      {/* 2. Closed URL */}
      <div className="flex items-center gap-1">
        <div className="flex-grow">
          <TextField
            variant="standard"
            label={t("settingsAndSharing.expoEndedInfo.redirectUrl")}
            value={closedUrlValue}
            onChange={(e) => setClosedUrlValue(e.target.value)}
            fullWidth
            inputProps={{
              style: { fontFamily: "Work Sans", fontSize: "16px" },
            }}
            sx={{
              "& .MuiFormLabel-root.Mui-focused": {
                color: "#083d77",
              },
              "& .MuiInputBase-root:after": {
                borderBottomColor: "#083d77",
              },
            }}
          />
        </div>
        <HelpIcon
          label={t("settingsAndSharing.expoEndedInfo.redirectUrlTooltip")}
          id="expo-settings-closed-expo-url"
          place="left"
        />
      </div>

      {/* 3. Closed caption */}
      <div className="flex items-center gap-1">
        <div className="flex-grow">
          <TextField
            variant="standard"
            label={t("settingsAndSharing.expoEndedInfo.infoForVisitor")}
            value={closedCaptionValue}
            onChange={(e) => setClosedCaptionValue(e.target.value)}
            multiline
            minRows={2}
            maxRows={5}
            fullWidth
            helperText={`${closedCaptionValue.length} / 200`}
            error={isClosedCaptionErr}
            inputProps={{
              style: { fontFamily: "Work Sans", fontSize: "16px" },
            }}
            sx={{
              "& .MuiFormLabel-root": {
                "&.Mui-focused": {
                  color: "#083d77",
                },
                "&.Mui-error": {
                  color: "#d32f2f",
                },
              },
              "& .MuiInputBase-root:after": {
                borderBottomColor: "#083d77",
              },
              "& .MuiFormHelperText-root": {
                textAlign: "end",
              },
            }}
          />
        </div>
        <HelpIcon
          label={t("settingsAndSharing.expoEndedInfo.infoForVisitorTooltip")}
          id="expo-settings-closed-expo-caption"
          place="left"
        />
      </div>

      {/* 4. Save button */}
      <div className="flex justify-end">
        <div className="-mt-2 mr-8">
          <Button
            raised
            label={t("settingsAndSharing.saveLabel")}
            onClick={handleSave}
            disabled={!isReadWriteAccess}
          />
        </div>
      </div>
    </div>
  );
};

export default ClosedExpoSettings;
