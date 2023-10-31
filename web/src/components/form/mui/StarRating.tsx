import { Dispatch, SetStateAction } from "react";
import { Rating } from "@mui/material";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

// Currently supports only controlled mode
// https://mui.com/material-ui/react-rating/ , also see the API section

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
