import { useTranslation } from "react-i18next";

import { Rating } from "@mui/material";

import { MessageObj } from "models";

import { formatDate } from "utils";
import { palette } from "palette";
import { useMediaDevice } from "context/media-device-provider/media-device-provider";

// - -

type RatingCommentsPanelProps = {
  messages: MessageObj[];
};

const RatingCommentsPanel = ({ messages }: RatingCommentsPanelProps) => {
  const { t } = useTranslation("expo");

  const { isMd } = useMediaDevice();

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {messages.map((message) => {
        if (!message.text) {
          return null;
        }

        return (
          <div
            key={message.id}
            className="px-4 py-3 flex flex-col gap-3 border-solid border-2 rounded-md"
            style={{
              borderColor: palette["medium-gray"],
              backgroundColor: palette["light-gray"],
            }}
          >
            <div className="text-base">{message.text}</div>

            <div className="flex flex-col justify-end items-end gap-1 md:flex-row md:items-center md:gap-3">
              <div className="flex gap-1 items-center text-sm italic">
                <div>{t("rating.created")}</div>
                <div>{formatDate(message.created)}</div>
              </div>

              {!isMd && (
                <div className="w-[6px] h-[6px] rounded-full bg-black" />
              )}

              <div className="flex gap-1 items-center text-sm italic">
                <div>{t("rating.rating")}</div>
                <div>
                  {message.rating ? (
                    <Rating
                      value={message.rating}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                  ) : (
                    <span className="italic">
                      {t("rating.ratingNotSpecified")}
                    </span>
                  )}
                </div>
              </div>

              {message.contactEmail && !isMd && (
                <div className="w-[6px] h-[6px] rounded-full bg-black" />
              )}

              {message.contactEmail && (
                <div className="flex gap-1 items-center text-sm italic">
                  <span className="italic">{t("rating.emailContact")}</span>
                  <span>{message.contactEmail}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RatingCommentsPanel;
