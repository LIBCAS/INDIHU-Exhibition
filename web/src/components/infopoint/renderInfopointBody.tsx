import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import { Infopoint } from "models";
import cx from "classnames";

type InputArguments = {
  infopoint: Infopoint;
  onClose?: () => void;
};

export const renderInfopointBody = ({ infopoint, onClose }: InputArguments) => {
  return (
    <div className={cx("flex flex-col gap-[10px] p-1 max-w-[288px]")}>
      {/* 1. Infopoint Header */}
      {infopoint.header && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-xl font-bold">{infopoint.header}</span>
          {!infopoint.alwaysVisible && (
            <Button
              noPadding
              iconBefore={<Icon name="close" />}
              onClick={() => {
                if (onClose) {
                  onClose();
                }
              }}
            />
          )}
        </div>
      )}

      {/* 2. Infopoint body */}
      {/* 2A Text infopoint body */}
      {/* Also backwards compatibility when infopoints does not have bodyContentType and had text automatically */}
      {((!infopoint.bodyContentType && infopoint.text) ||
        (infopoint.bodyContentType === "TEXT" && infopoint.text)) && (
        <div
          className={cx({
            "expo-scrollbar max-h-[70px] font-['Work_Sans'] text-[14px] leading-[22px] font-normal":
              infopoint.bodyContentType === "TEXT",
            "text-muted": !!infopoint.header,
          })}
        >
          {infopoint.text}
        </div>
      )}

      {/* 2B Image infopoint body */}
      {infopoint.bodyContentType === "IMAGE" && infopoint.imageFile && (
        <div className={cx("expo-scrollbar max-h-[208px]")}>
          <img
            src={`/api/files/${infopoint.imageFile.fileId}`}
            alt="infopoint_img"
          />
        </div>
      )}

      {/* 2C Video infopoint body */}
      {infopoint.bodyContentType === "VIDEO" && infopoint.videoFile && (
        <div>
          <video
            src={`/api/files/${infopoint.videoFile.fileId}`}
            autoPlay={false}
            className="hover:cursor-pointer w-full h-full object-contain"
            controls
            controlsList="nodownload"
          />
        </div>
      )}

      {/* 3. Optional URL link */}
      {infopoint.isUrlIncluded && infopoint.url && infopoint.urlName && (
        <div className="flex">
          <div
            className="flex cursor-pointer"
            onClick={() => {
              const url =
                !infopoint.url?.startsWith("https://") &&
                !infopoint.url?.startsWith("http://")
                  ? "https://" + infopoint.url
                  : infopoint.url;

              window.open(url, "_blank");
            }}
          >
            <button className="text-black font-['Work_Sans'] font-bold text-lg mr-1">
              {infopoint.urlName}
            </button>
            <Icon name="arrow_forward" useMaterialUiIcon />
          </div>
        </div>
      )}
    </div>
  );
};
