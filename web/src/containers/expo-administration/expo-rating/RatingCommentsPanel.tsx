import { useTranslation } from "react-i18next";

import { Rating } from "@mui/material";

import { MessageObj } from "models";

import { formatDate } from "utils";
import { palette } from "palette";

// - -

type RatingCommentsPanelProps = {
  messages: MessageObj[];
};

const RatingCommentsPanel = ({ messages }: RatingCommentsPanelProps) => {
  const { t } = useTranslation("expo");

  return (
    <div className="max-h-[490px] flex flex-col gap-4 pr-2 expo-scrollbar">
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

            <div className="flex justify-end items-center gap-3">
              <div className="flex gap-1 items-center text-sm italic">
                <div>{t("rating.created")}</div>
                <div>{formatDate(message.created)}</div>
              </div>

              <div className="w-[6px] h-[6px] rounded-full bg-black" />

              <div className="flex gap-1 items-center text-sm italic">
                <div>{t("rating.rating")}</div>
                <div>
                  <Rating
                    value={message.rating}
                    precision={0.5}
                    readOnly
                    size="small"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RatingCommentsPanel;
