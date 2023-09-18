import {
  useState,
  useRef,
  Dispatch,
  SetStateAction,
  useMemo,
  useEffect,
} from "react";
import { useSpring, animated } from "react-spring";

import Slider from "@mui/material/Slider";
import { Icon } from "components/icon/icon";
import { Spinner } from "components/spinner/spinner";

import { secondsToVideoDuration } from "utils";

// - -

type VideoContentBodyProps = {
  videoSrc: string;
  isVideoLoaded: boolean;
  setIsVideoLoaded: Dispatch<SetStateAction<boolean>>;
};

const VideoContentBody = ({
  videoSrc,
  isVideoLoaded,
  setIsVideoLoaded,
}: VideoContentBodyProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isVolumeHovered, setIsVolumeHovered] = useState<boolean>(false);
  const [isVideoHovered, setIsVideoHovered] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);

  const [videoCurrTime, setVideoCurrTime] = useState<number>(0);
  const [videoVolume, setVideoVolume] = useState<number>(0.8);
  const [prevVideoVolume, setPrevVideoVolume] = useState<number>(0.8);

  const shouldShowControls = useMemo(() => {
    return (isVideoPlaying && isVideoHovered) || !isVideoPlaying;
  }, [isVideoHovered, isVideoPlaying]);

  const { width: sliderWidth } = useSpring({
    width: isVolumeHovered ? "35px" : "0px",
  });

  const { opacity: controlsOpacity } = useSpring({
    opacity: shouldShowControls ? 1 : 0,
  });

  const playPauseVideo = () => {
    if (isVideoPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
  };

  // Handle changes of the video volume
  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.volume = videoVolume;
    }
  }, [videoVolume]);

  useEffect(() => {
    return () => setPrevVideoVolume(videoVolume);
  }, [videoVolume]);

  // Handle changes of the video current time
  // useEffect(() => {
  //   console.log("videoCurrTime changes to: ", videoCurrTime);
  // }, [videoCurrTime]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay={false}
        className="hover:cursor-pointer w-full h-full object-contain"
        onCanPlay={() => setIsVideoLoaded(true)}
        onMouseEnter={() => setIsVideoHovered(true)}
        onMouseLeave={() => setIsVideoHovered(false)}
        onPlay={() => setIsVideoPlaying(true)}
        onPause={() => setIsVideoPlaying(false)}
        // TODO
        onTimeUpdate={(e) => {
          const currTarget = e.currentTarget;
          const currVideoTime = currTarget.currentTime;
          setVideoCurrTime(currVideoTime);
        }}
        onClick={() => playPauseVideo()}
        // controls
        // controlsList="nodownload"
      />

      {!isVideoLoaded && (
        <div className="absolute left-0 top-0 bottom-0 right-0 flex justify-center items-center">
          <Spinner scale={1} />
        </div>
      )}

      {/* Controls */}
      {isVideoLoaded && (
        <animated.div
          className="absolute bottom-0 left-0 right-0 px-[5%] flex flex-col pointer-events-none"
          style={{ opacity: controlsOpacity }}
        >
          <div className="text-white w-full flex items-center gap-3 overflow-x-hidden">
            <div
              className="pointer-events-auto"
              onMouseEnter={() => setIsVideoHovered(true)}
            >
              <Icon
                color="white"
                useMaterialUiIcon
                name={isVideoPlaying ? "pause" : "play_arrow"}
                onClick={() => playPauseVideo()}
                style={{ fontSize: "22px" }}
              />
            </div>

            {/* TODO */}
            <div className="text-[13px]">
              {`${secondsToVideoDuration(
                videoCurrTime
              )} / ${secondsToVideoDuration(videoRef.current?.duration ?? 0)}`}
            </div>

            <div
              className="flex items-center gap-3 pointer-events-auto"
              onMouseEnter={() => {
                setIsVolumeHovered(true);
                setIsVideoHovered(true);
              }}
              onMouseLeave={() => setIsVolumeHovered(false)}
            >
              <div>
                <Icon
                  color="white"
                  useMaterialUiIcon
                  name={
                    videoVolume === 0
                      ? "volume_off"
                      : videoVolume < 0.5
                      ? "volume_down"
                      : "volume_up"
                  }
                  onClick={() => {
                    if (videoVolume !== 0) {
                      setVideoVolume(0);
                    } else {
                      setVideoVolume(prevVideoVolume);
                    }
                  }}
                  style={{ fontSize: "22px" }}
                  className="ml-auto"
                />
              </div>

              <animated.div
                className="w-[35px] flex items-center"
                style={{ width: sliderWidth }}
              >
                <Slider
                  size="small"
                  min={0}
                  max={1}
                  step={0.01}
                  sx={{
                    width: "100%",
                    color: "lightgray",
                    padding: "10px 0px", // .MuiSlider-root on top
                    "& .MuiSlider-thumb": {
                      width: `${isVolumeHovered ? "8px" : "0px"}`,
                      height: `${isVolumeHovered ? "8px" : "0px"}`,
                      "&.Mui-active": {
                        boxShadow: "0px 0px 0px 7px rgba(0, 0, 0, 0.16)",
                      },
                      "&:hover, &.Mui-focusVisible": {
                        boxShadow: "0px 0px 0px 3px rgba(0, 0, 0, 0.16)",
                      },
                      "&::after": {
                        width: "20px",
                        height: "20px",
                      },
                    },
                  }}
                  value={videoVolume}
                  onChange={(_event: Event, newValue: number | number[]) => {
                    if (typeof newValue === "number" && videoRef.current) {
                      setVideoVolume(newValue);
                    }
                  }}
                />
              </animated.div>
            </div>

            <div className="ml-auto cursor-pointer text-[13px] flex items-center">
              1.25x
            </div>
          </div>

          {/* Timeline for seeking */}
          <div
            className="px-[10px] pointer-events-auto"
            onMouseEnter={() => setIsVideoHovered(true)}
          >
            <Slider
              size="small"
              min={0}
              max={1}
              step={0.01}
              sx={{
                color: "lightgray",
                padding: "10px 0px", // .MuiSlider-root on top
                "& .MuiSlider-thumb": {
                  "&.Mui-active": {
                    boxShadow: "0px 0px 0px 7px rgba(0, 0, 0, 0.16)",
                  },
                  "&:hover, &.Mui-focusVisible": {
                    boxShadow: "0px 0px 0px 3px rgba(0, 0, 0, 0.16)",
                  },
                  "&::after": {
                    width: "20px",
                    height: "20px",
                  },
                },
              }}
              // TODO
              value={
                videoRef.current
                  ? Number(
                      (videoCurrTime / videoRef.current.duration).toFixed(2)
                    )
                  : 0
              }
              onChangeCommitted={(_e, newValue: number | number[]) => {
                if (typeof newValue === "number" && videoRef.current) {
                  const videoEl = videoRef.current;
                  const totalTime = videoEl.duration;
                  // e.g slided to 0.2 and total time is 60s -> 0.2 * 60 = 12s
                  const newCurrTime = newValue * totalTime;
                  setVideoCurrTime(newCurrTime);
                }
              }}
            />
          </div>
        </animated.div>
      )}
    </div>
  );
};

export default VideoContentBody;
