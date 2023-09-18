import { useEffect, useState } from "react";
import { useFiles } from "hooks/view-hooks/files-hook";
import defaultBgImage from "../../assets/img/mountain-background.jpg";

import { openInNewTab } from "utils";

// - - - - - - -

interface ViewEndedProps {
  closedUrl?: string;
  closedPicture?: string;
  closedCaption?: string;
}

const ViewEnded = (props: ViewEndedProps) => {
  const [closedPictureUrl, setClosedPictureUrl] = useState<string | null>(null);
  const fileLookupMap = useFiles(); // empty because sometimes i do not receive structure from BE!!

  useEffect(() => {
    if (!props.closedPicture) {
      return;
    }

    const fileId = fileLookupMap[props.closedPicture]?.fileId; // can be undefined
    if (!fileId) {
      return;
    }
    const url = `/api/files/${fileId}`;
    setClosedPictureUrl(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.closedPicture]);

  return (
    <div className="w-full h-full relative">
      {/* Background image */}
      <div className="w-full h-full">
        <img
          src={closedPictureUrl ? closedPictureUrl : defaultBgImage}
          className="w-full h-full object-cover object-top"
        />
      </div>

      <div className="absolute left-0 top-1/2 w-full h-1/2 flex justify-end items-center text-white font-bold opacity-20 overflow-hidden text-[110px] sm:text-[160px] md:text-[200px] lg:text-[270px]">
        INDIHU
      </div>

      {/* Text above the bg image */}
      <div className="absolute left-0 top-0 w-full h-full px-[10%] py-[10%] overflow-y-auto flex flex-col justify-center gap-10 sm:gap-12">
        <div className="flex items-center gap-6 bg-white px-6 py-4 rounded-md w-fit">
          <div className="w-5 h-5 bg-red-700 rounded-full self-center " />
          <div className="font-['Roboto'] font-bold text-xl sm:text-2xl text-black">
            UKONČENO
          </div>
        </div>

        <div
          className="font-['Roboto'] text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
          style={{ textShadow: "1px 1px 1px black, -1px -1px 1px black" }}
        >
          Výstava již byla ukončena autorem výstavy
        </div>

        {props.closedCaption && (
          <div
            className="font-['Roboto'] text-white italic opacity-90 font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
            style={{ textShadow: "1px 1px 1px black, -1px -1px 1px black" }}
          >
            &quot;{props.closedCaption}&quot;
          </div>
        )}

        {props.closedUrl && (
          <div
            className="block cursor-pointer font-['Roboto'] text-white opacity-80 font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
            onClick={() => {
              if (props.closedUrl) {
                openInNewTab(props.closedUrl);
              }
            }}
            style={{ textShadow: "1px 1px 1px black, -1px -1px 1px black" }}
          >
            {props.closedUrl}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewEnded;
