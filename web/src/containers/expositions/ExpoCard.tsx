import { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import { Card, CardContent, CardActions, Rating, Divider } from "@mui/material";
import { PushPin, PushPinOutlined } from "@mui/icons-material";
import ExpoMenu from "./ExpoMenu";

// Models
import { ExpositionItem } from "models";
import { AppDispatch } from "store/store";
import { ExpositionsFilterStateObj } from "./Expositions";

// Actions and utils
import cx from "classnames";
import { setDialog } from "actions/dialog-actions";
import { formatDate, formatTime, openInNewTab, openViewer } from "utils";
import { DialogType } from "components/dialogs/dialog-types";
import { pinExpositionItem, unpinExpositionItem } from "actions/expoActions";
import { getPreferenceText } from "./utils";

// - -

type ExpoCardProps = {
  expositionItem: ExpositionItem;
  expositionsFilterState: ExpositionsFilterStateObj;
};

const ExpoCard = ({
  expositionItem,
  expositionsFilterState,
}: ExpoCardProps) => {
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
    viewCount,
  } = expositionItem;

  const prefText = useMemo(
    () => getPreferenceText(preferences, t),
    [preferences, t]
  );

  const canAccessTheExpo = useMemo(() => state !== "ENDED", [state]);

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
                {t("expoCard.numberOfViews")}
              </div>
              <div>
                {viewCount ?? (
                  <span className="italic">
                    {t("expoCard.noNumberOfViewsYet")}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center gap-4">
              <div className="font-medium text-base">
                {t("expoCard.averageRating")}
              </div>
              <div className="flex">
                {rating ? (
                  <div className="flex gap-1">
                    <Rating defaultValue={rating} precision={0.1} readOnly />
                    <Button
                      className="self-center"
                      noPadding
                      onClick={() => {
                        openInNewTab(
                          `${window.origin}/expo/${expositionItem.id}/rating`
                        );
                      }}
                    >
                      <Icon
                        name="launch"
                        iconStyle={{ fontSize: "12px" }}
                        tooltip={{
                          id: "rating-redirect-icon",
                          content: t("expoCard.ratingRedirectLabel"),
                          variant: "dark",
                        }}
                      />
                    </Button>
                  </div>
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
          <div className="w-full flex items-center gap-1">
            <EditButton
              expoId={expositionItem.id}
              canAccessTheExpo={canAccessTheExpo}
            />

            <PreviewButton expoUrl={expositionItem.url} />

            <PinButton
              isExpoPinned={expositionItem.pinned}
              expoId={expositionItem.id}
            />

            <div className="ml-auto">
              <ExpoMenu
                expositionItem={expositionItem}
                expositionsFilterState={expositionsFilterState}
              />
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
  canAccessTheExpo: boolean;
};

const EditButton = ({ expoId, canAccessTheExpo }: EditButtonProps) => {
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("exhibitions-page");

  const handleEditClick = () => {
    if (!canAccessTheExpo) {
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
      iconBefore={<Icon useMaterialUiIcon name="edit" />}
      className="px-2 py-2"
      onClick={handleEditClick}
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
      iconBefore={<Icon useMaterialUiIcon name="launch" />}
      className="px-2 py-2"
      onClick={() => openViewer(`/view/${expoUrl}`)}
    >
      {t("expoCard.preview")}
    </Button>
  );
};

// - - -

type PinButtonProps = {
  isExpoPinned: boolean;
  expoId: string;
};

const PinButton = ({ isExpoPinned, expoId }: PinButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("exhibitions-page");

  const handlePin = () => {
    dispatch(pinExpositionItem(expoId));
  };

  const handleUnpin = () => {
    dispatch(unpinExpositionItem(expoId));
  };

  if (isExpoPinned) {
    return (
      <Button
        onClick={handleUnpin}
        key="unpin-button"
        tooltip={{
          id: "unpin-action-button-tooltip",
          content: t("expoCard.unpinTooltip"),
          variant: "dark",
        }}
      >
        <PushPin />
      </Button>
    );
  }

  return (
    <Button
      onClick={handlePin}
      key="pin-button"
      tooltip={{
        id: "pin-action-button-tooltip",
        content: t("expoCard.pinTooltip"),
        variant: "dark",
      }}
    >
      <PushPinOutlined />
    </Button>
  );
};
