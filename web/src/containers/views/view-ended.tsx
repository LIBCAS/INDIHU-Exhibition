import { useEffect, useState } from "react";
import defaultBgImage from "../../assets/img/mountain-background.jpg";
import { useFiles } from "hooks/view-hooks/files-hook";

// - - - - - - -

interface ViewEndedProps {
  closedUrl?: string;
  closedPicture?: string;
  closedCaption?: string;
}

const ViewEnded = (props: ViewEndedProps) => {
  const [closedPictureUrl, setClosedPictureUrl] = useState<string | null>(null);
  const fileLookupMap = useFiles();

  useEffect(() => {
    if (!props.closedPicture) {
      return;
    }
    const fileId = fileLookupMap[props.closedPicture].fileId;
    const url = `/api/files/${fileId}`;
    setClosedPictureUrl(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.closedPicture]);

  return (
    <div className="w-full h-full">
      {/* Background image */}
      <div
        className="w-full h-full -z-50 blur-sm"
        style={
          props.closedPicture
            ? {
                backgroundImage: `url(${closedPictureUrl})`,
                backgroundSize: "cover",
              }
            : {
                backgroundImage: `url(${defaultBgImage})`,
                backgroundSize: "cover",
              }
        }
      />

      <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 flex items-center">
        <div className="text-white text-[270px] opacity-20 font-bold overflow-hidden">
          INDIHU
        </div>
      </div>

      {/* Text above the bg image */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="h-full flex flex-col gap-10 sm:gap-12 justify-center ml-[10%]">
          {/* First col item */}
          <div className="flex align-items gap-6 bg-white py-4 px-6 rounded-md w-fit">
            <div className="w-5 h-5 bg-red-700 rounded-full self-center " />
            <div className="font-['Roboto'] font-bold text-xl sm:text-2xl text-black">
              UKONČENO
            </div>
          </div>

          <div className="font-['Roboto'] font-bold text-4xl sm:text-6xl text-white">
            Výstava již byla ukončena autorem výstavy
          </div>

          {props.closedCaption && (
            <div className="font-['Roboto'] font-medium text-3xl sm:text-5xl text-white w-1/2 italic opacity-90">
              &quot;{props.closedCaption}&quot;
            </div>
          )}

          {props.closedUrl && (
            <div className="font-['Roboto'] font-medium text-2xl sm:text-4xl text-white opacity-80 cursor-pointer">
              <a href={props.closedUrl} target="_blank" rel="noreferrer">
                {props.closedUrl}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewEnded;
