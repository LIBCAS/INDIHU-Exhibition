import { useState } from "react";
import { useTranslation } from "react-i18next";

// Components
import Snackbar from "components/snackbar/Snackbar";
import { TextField } from "@mui/material";
import Button from "react-md/lib/Buttons/Button";

// - -

type EmbedCodeFieldProps = {
  expoUrl: string;
};

const EmbedCodeField = ({ expoUrl }: EmbedCodeFieldProps) => {
  const { t } = useTranslation("expo");

  const [width, setWidth] = useState<number>(600);
  const [height, setHeight] = useState<number>(400);

  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-8">
        <TextField
          variant="standard"
          type="number"
          label={t("settingsAndSharing.embedCodeWidth")}
          value={width}
          onChange={(e) => {
            const newWidthValue = parseInt(e.target.value);
            if (!isNaN(newWidthValue)) {
              setWidth(newWidthValue);
            }
          }}
          fullWidth
          inputProps={{
            style: { fontFamily: "Work Sans", fontSize: "16px" },
          }}
          sx={{
            maxWidth: "100px",
            "& .MuiFormLabel-root.Mui-focused": {
              color: "#083d77",
            },
            "& .MuiInputBase-root:after": {
              borderBottomColor: "#083d77",
            },
          }}
        />

        <TextField
          variant="standard"
          type="number"
          label={t("settingsAndSharing.embedCodeHeight")}
          value={height}
          onChange={(e) => {
            const newHeightValue = parseInt(e.target.value);
            if (!isNaN(newHeightValue)) {
              setHeight(newHeightValue);
            }
          }}
          fullWidth
          inputProps={{
            style: { fontFamily: "Work Sans", fontSize: "16px" },
          }}
          sx={{
            maxWidth: "100px",
            "& .MuiFormLabel-root.Mui-focused": {
              color: "#083d77",
            },
            "& .MuiInputBase-root:after": {
              borderBottomColor: "#083d77",
            },
          }}
        />
      </div>

      <Button
        raised
        label={t("settingsAndSharing.generateEmbedCode")}
        onClick={() => {
          const urlToCopy = `${window.location.origin}/view/${expoUrl}`;
          const iframeEl = `<iframe src=${urlToCopy} width=${width} height=${height} allowFullScreen />`;
          navigator.clipboard.writeText(iframeEl);
          setIsSnackbarOpen(true);
        }}
      />

      <Snackbar
        isOpen={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
        message={t("settingsAndSharing.generateEmbedCodeMessage")}
      />
    </div>
  );
};

export default EmbedCodeField;
