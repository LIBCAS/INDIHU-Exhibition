import { Dispatch, SetStateAction } from "react";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";
import { useTranslation } from "react-i18next";

import { TextField } from "@mui/material";

//import * as Yup from "yup";

// - -

type AuthorEmailTextFieldProps = {
  reviewerEmail: string;
  setReviewerEmail: Dispatch<SetStateAction<string>>;
};

const AuthorEmailTextField = ({
  reviewerEmail,
  setReviewerEmail,
}: AuthorEmailTextFieldProps) => {
  const { t } = useTranslation("view-screen", { keyPrefix: "rating" });
  const { isLightMode, palette } = useExpoDesignData();

  // const [isReviewerEmailTouched, setIsReviewerEmailTouched] =
  //   useState<boolean>(false);
  // const isReviewerEmailValid = useMemo(
  //   () => Yup.string().optional().email().isValidSync(reviewerEmail),
  //   [reviewerEmail]
  // );

  return (
    <TextField
      variant="filled"
      type="email"
      value={reviewerEmail}
      onChange={(e) => setReviewerEmail(e.target.value)}
      //onBlur={() => setIsReviewerEmailTouched(true)}
      placeholder={t("linkToReviewerPlaceholder")}
      fullWidth
      // error={isReviewerEmailTouched && !isReviewerEmailValid}
      // helperText={
      //   isReviewerEmailTouched && !isReviewerEmailValid
      //     ? "Neplatný formát emailu"
      //     : undefined
      // }
      sx={{
        "& .MuiInputBase-root": {
          borderRadius: "0px",
          backgroundColor: isLightMode
            ? palette["light-gray"]
            : palette["medium-gray"],
          "&.Mui-focused": {
            backgroundColor: isLightMode
              ? palette["light-gray"]
              : palette["medium-gray"],
          },
          "&:hover": {
            backgroundColor: isLightMode
              ? palette["light-gray"]
              : palette["medium-gray"],
          },
        },
        "& .MuiInputBase-input": {
          fontSize: "16px",
          padding: "8px 12px",
        },
        "& .MuiFilledInput-underline:after": {
          borderBottom: "none",
        },
        "& .MuiFormHelperText-root": {
          margin: "4px 0px 0px 4px",
          fontSize: "12px",
        },
      }}
    />
  );
};

export default AuthorEmailTextField;
