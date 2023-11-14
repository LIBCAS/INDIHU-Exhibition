import { useTranslation } from "react-i18next";

import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

import { ExpositionRatingObj } from "models";

// - -

type RatingStatisticsTableProps = {
  expositionRating: ExpositionRatingObj;
};

const RatingStatisticsTable = ({
  expositionRating,
}: RatingStatisticsTableProps) => {
  const { t } = useTranslation("expo");

  return (
    <TableContainer>
      <Table
        aria-label="rating statistics table"
        sx={{
          minWidth: "320px",
          "& .MuiTableRow-root": {
            cursor: "pointer",
            transition: "background-color 0.2s",
            "&:hover": {
              backgroundColor: "#ececec",
            },
          },
          "& .MuiTableCell-root": {},
        }}
      >
        <TableBody
          sx={{
            "& .MuiTableCell-root": {
              padding: "8px",
            },
          }}
        >
          <TableRow>
            <TableCell sx={{ fontWeight: "500" }}>
              {t("rating.ratingTable.rateCount")}
            </TableCell>
            <TableCell align="center">{expositionRating.ratingCount}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ fontWeight: "500" }}>
              {t("rating.ratingTable.avgRate")}
            </TableCell>
            <TableCell align="center">
              {expositionRating.average.toFixed(2)}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ fontWeight: "500" }}>
              {t("rating.ratingTable.peopleTopicLikeCount")}
            </TableCell>
            <TableCell align="center">{expositionRating.topicCount}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ fontWeight: "500" }}>
              {t("rating.ratingTable.peopleMediaLikeCount")}
            </TableCell>
            <TableCell align="center">{expositionRating.mediaCount}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ fontWeight: "500" }}>
              {t("rating.ratingTable.peopleTextLikeCount")}
            </TableCell>
            <TableCell align="center">{expositionRating.textCount}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ fontWeight: "500" }}>
              {t("rating.ratingTable.peopleGameLikeCount")}
            </TableCell>
            <TableCell align="center">{expositionRating.gameCount}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RatingStatisticsTable;
