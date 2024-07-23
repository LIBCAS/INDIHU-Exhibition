import { useState } from "react";
import { useScreenDataByScreenId } from "hooks/view-hooks/useScreenDataByScreenId";

import { Link } from "react-router-dom";
import { Icon } from "components/icon/icon";

import { ReferenceObj, SignpostReferenceType } from "models";

import { palette } from "palette";
import cx from "classnames";

// - - -

type ReferenceItemProps = {
  referenceObj: ReferenceObj;
  referenceIndex: number;
  preloadedReferenceImgSrc: string;
  referenceType: SignpostReferenceType;
  numberOfTotalReferences: number;
};

const ReferenceItem = ({
  referenceObj,
  referenceIndex,
  preloadedReferenceImgSrc,
  referenceType,
  numberOfTotalReferences,
}: ReferenceItemProps) => {
  const [isReferenceHovered, setIsReferenceHovered] = useState<boolean>(false);
  const { screenReferenceUrl } =
    useScreenDataByScreenId(referenceObj.reference) ?? {};

  return (
    <Link
      to={(location) => (screenReferenceUrl ? screenReferenceUrl : location)}
      key={referenceIndex}
    >
      <div
        className={cx(
          "w-[340px] flex flex-col gap-4 self-stretch p-4 md:p-6 border-4 border-solid border-transparent rounded-md bg-transparent hover:bg-light-gray/10 cursor-pointer",
          {
            "w-[340px]": numberOfTotalReferences <= 3,
            "!p-3": referenceType === "ONLY_TEXT",
          }
        )}
        onMouseEnter={() => setIsReferenceHovered(true)}
        onMouseLeave={() => setIsReferenceHovered(false)}
      >
        {/* Image of reference, if should be rendered */}
        {(referenceType === "TEXT_IMAGES" ||
          referenceType === "ONLY_IMAGES") && (
          <div
            className={cx("w-full h-[275px] relative", {
              "h-[275px]": numberOfTotalReferences <= 3,
            })}
          >
            <img
              src={preloadedReferenceImgSrc}
              alt="reference-image"
              className="w-full h-full object-contain"
            />

            {/* Icon on hover inside image */}
            <div
              className={cx(
                "text-blue absolute top-0 right-0 translate-x-1/2 -translate-y-1/2",
                {
                  flex: isReferenceHovered,
                  hidden: !isReferenceHovered,
                }
              )}
            >
              <Icon
                useMaterialUiIcon
                name="launch"
                iconStyle={{ fontSize: "24px" }}
              />
            </div>
          </div>
        )}

        {/* Text of reference, if should be rendered */}
        {(referenceType === "TEXT_IMAGES" || referenceType === "ONLY_TEXT") && (
          <div className="w-full flex items-center gap-4">
            {referenceType === "ONLY_TEXT" && (
              <Icon
                useMaterialUiIcon
                name="launch"
                iconStyle={{ color: `${palette["blue"]} !important` }}
              />
            )}

            <div
              className={cx("px-2 w-full text-white", {
                "text-center": referenceType !== "ONLY_TEXT",
                "text-start": referenceType === "ONLY_TEXT",
              })}
            >
              {referenceObj.text ?? "Neuveden žádnej text"}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ReferenceItem;
