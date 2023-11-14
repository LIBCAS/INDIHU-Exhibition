import { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import {
  Card,
  CardContent,
  CardActions,
  Rating,
  Divider,
  Button,
} from "@mui/material";
import { Edit, Launch } from "@mui/icons-material";
import ExpoMenu from "./ExpoMenu";

import { ExpositionItem } from "models";
import { AppDispatch } from "store/store";

import cx from "classnames";
import { setDialog } from "actions/dialog-actions";
import { formatDate, formatTime, openViewer } from "utils";
import { DialogType } from "components/dialogs/dialog-types";
import { getPreferenceText } from "./utils";

// - -

type ExpoCardProps = {
  expositionItem: ExpositionItem;
};

const ExpoCard = ({ expositionItem }: ExpoCardProps) => {
  const { t } = useTranslation(["exhibitions-page", "expo"]);
  const {
    title,
    state,
    created,
    authorUsername,
    lastEdit,
    isEditing,
    rating,
    messageCount,
    preferences,
  } = expositionItem;

  const prefText = useMemo(
    () => getPreferenceText(preferences, t),
    [preferences, t]
  );

  return (
    <div className="w-full sm:w-[350px]">
      <Card
        raised
        sx={{
          height: "100%",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent>
          <div className="px-2 pt-2 pb-1">
            <div className="font-bold text-lg">{title}</div>
          </div>

          <Divider />

          <div className="mt-1 p-2 flex flex-col gap-2">
            <div className="flex justify-between items-center gap-2">
              <div className="font-medium text-base">{t("expoCard.state")}</div>
              <div>{t(`expoState.${state.toLowerCase()}`, { ns: "expo" })}</div>
            </div>

            <div className="flex justify-between items-center gap-2">
              <div className="font-medium text-base">
                {t("expoCard.created")}
              </div>
              <div
                className="overflow-x-hidden text-ellipsis"
                style={{ textAlign: "end" }}
              >
                {`${formatDate(created)}`}{" "}
                {authorUsername && (
                  <>
                    <br />
                    {`(${authorUsername})`}
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center gap-4">
              <div className="font-medium text-base">
                {t("expoCard.updated")}
              </div>
              <div
                className="overflow-x-hidden text-ellipsis"
                style={{ textAlign: "end" }}
              >
                {`${formatTime(lastEdit)}`}
                {isEditing && (
                  <>
                    <br />
                    {`(${isEditing})`}
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center gap-4">
              <div className="font-medium text-base">
                {t("expoCard.averageRating")}
              </div>
              <div className="flex">
                {rating ? (
                  <Rating defaultValue={rating} precision={0.1} readOnly />
                ) : (
                  <div className="italic">
                    {t("expoCard.noAverageRatingYet")}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center gap-4">
              <div className="font-medium text-base">
                {t("expoCard.commentsCount")}
              </div>
              <div>{messageCount ?? 0}</div>
            </div>

            <div className="flex justify-between items-center gap-4">
              <div className="font-medium text-base">
                {t("expoCard.bestRatedPreference")}
              </div>
              <div
                className={cx({ italic: prefText === null })}
                style={{ textAlign: "end" }}
              >
                {prefText ?? t("expoCard.noBestRatedPreferenceYet")}
              </div>
            </div>
          </div>
        </CardContent>

        <Divider sx={{ marginTop: "auto" }} />

        <CardActions>
          <div className="w-full flex items-center">
            <div>
              <EditButton
                expoId={expositionItem.id}
                expoState={expositionItem.state}
                canEdit={expositionItem.canEdit}
              />
            </div>
            <div>
              <PreviewButton expoUrl={expositionItem.url} />
            </div>
            <div className="ml-auto">
              <ExpoMenu expositionItem={expositionItem} />
            </div>
          </div>
        </CardActions>
      </Card>
    </div>
  );
};

export default ExpoCard;

// - - -

type EditButtonProps = {
  expoId: ExpositionItem["id"];
  expoState: ExpositionItem["state"];
  canEdit: ExpositionItem["canEdit"];
};

const EditButton = ({ expoId, expoState, canEdit }: EditButtonProps) => {
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("exhibitions-page");

  const handleEditClick = () => {
    if (expoState === "ENDED" || !canEdit) {
      const dialogTitle = t("expoCard.editErrDialogTitle");
      const dialogText = t("expoCard.editErrDialogText");
      dispatch(
        setDialog(DialogType.InfoDialog, {
          title: dialogTitle,
          text: dialogText,
          //autoClose: true
        })
      );
      return;
    }
    history.push(`/expo/${expoId}/structure`);
  };

  return (
    <Button
      variant="text"
      onClick={handleEditClick}
      size="large"
      startIcon={<Edit />}
      sx={{
        color: "#000000DE",
        "&:hover": {
          backgroundColor: "rgba(0,0,0, 0.03)",
        },
      }}
    >
      {t("expoCard.edit")}
    </Button>
  );
};

// - - -

type PreviewButtonProps = {
  expoUrl: ExpositionItem["url"];
};

const PreviewButton = ({ expoUrl }: PreviewButtonProps) => {
  const { t } = useTranslation("exhibitions-page");

  return (
    <Button
      variant="text"
      onClick={() => openViewer(`/view/${expoUrl}`)}
      size="large"
      startIcon={<Launch />}
      sx={{
        color: "#000000DE",
        "&:hover": {
          backgroundColor: "rgba(0,0,0, 0.03)",
        },
      }}
    >
      {t("expoCard.preview")}
    </Button>
  );
};
