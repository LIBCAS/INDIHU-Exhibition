import { Dispatch, SetStateAction } from "react";
import { useScreenDataByScreenId } from "hooks/view-hooks/useScreenDataByScreenId";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import VideoContentBody from "./VideoContentBody";

import { Infopoint } from "models";

import cx from "classnames";

type InputArguments = {
  infopoint: Infopoint;
  onClose?: () => void;
  isVideoLoaded: boolean;
  setIsVideoLoaded: Dispatch<SetStateAction<boolean>>;
};

const InfopointBody = ({
  infopoint,
  onClose,
  isVideoLoaded,
  setIsVideoLoaded,
}: InputArguments) => {
  const { isLightMode } = useExpoDesignData();

  const { screenReferenceUrl } =
    useScreenDataByScreenId(infopoint.screenIdReference ?? null) ?? {};

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
            "expo-scrollbar pr-1 max-h-[115px] font-['Work_Sans'] text-[14px] leading-[22px] font-normal":
              infopoint.bodyContentType === "TEXT",
            "text-gray": !!infopoint.header && isLightMode,
            "text-light-gray": !!infopoint.header && !isLightMode,
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
        <VideoContentBody
          videoSrc={`/api/files/${infopoint.videoFile.fileId}`}
          isVideoLoaded={isVideoLoaded}
          setIsVideoLoaded={setIsVideoLoaded}
        />
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
            <button className="text-inherit font-['Work_Sans'] font-bold text-lg mr-1">
              {infopoint.urlName}
            </button>
            <Icon name="arrow_forward" useMaterialUiIcon />
          </div>
        </div>
      )}

      {/* 4. Optional Screen Id reference link */}
      {infopoint.isScreenIdIncluded &&
        infopoint.screenIdReference &&
        infopoint.screenNameReference && (
          <div className="flex">
            <div
              className="flex cursor-pointer"
              onClick={() => {
                window.open(screenReferenceUrl, "_blank");
              }}
            >
              <button className="text-inherit font-['Work_Sans'] font-bold text-lg mr-1">
                {infopoint.screenNameReference}
              </button>
              <Icon name="arrow_forward" useMaterialUiIcon />
            </div>
          </div>
        )}
    </div>
  );
};

export default InfopointBody;
