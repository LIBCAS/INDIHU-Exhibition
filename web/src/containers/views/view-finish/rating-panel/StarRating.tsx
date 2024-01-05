import { Dispatch, SetStateAction } from "react";
import { Rating } from "@mui/material";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

type StarRatingProps = {
  value: number | null;
  setValue: Dispatch<SetStateAction<number | null>>;
};

const StarRating = ({ value, setValue }: StarRatingProps) => {
  const { isLightMode, palette } = useExpoDesignData();

  return (
    <Rating
      size="large"
      precision={0.5}
      value={value}
      onChange={(_event, newRatingValue) => {
        setValue(newRatingValue);
      }}
      sx={{
        fontSize: "42px",
        color: palette["warning"],
        "& .MuiRating-iconEmpty": {
          color: isLightMode ? undefined : palette["white"],
        },
      }}
    />
  );
};

export default StarRating;
