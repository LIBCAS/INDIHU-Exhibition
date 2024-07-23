import {
  useState,
  useRef,
  Dispatch,
  SetStateAction,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { useSpring, animated } from "react-spring";

import Slider from "@mui/material/Slider";
import { Icon } from "components/icon/icon";
import { Spinner } from "components/loaders/spinner";

import { secondsToVideoDuration } from "utils";

// - -

const playbackSpeedOptions = [0.5, 1.0, 1.5, 2.0];

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
  const [videoBlobSrc, setVideoBlobSrc] = useState<string | null>(null);

  const [isVolumeHovered, setIsVolumeHovered] = useState<boolean>(false);
  const [isVideoHovered, setIsVideoHovered] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);

  const [videoVolume, setVideoVolume] = useState<number>(0.8);
  const [prevVideoVolume, setPrevVideoVolume] = useState<number>(0.8);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [videoCurrTime, setVideoCurrTime] = useState<number>(0);
  const [playbackSpeedIndex, setPlaybackSpeedIndex] = useState<number>(1); // index 1, second item as 1.0

  // - -

  useEffect(() => {
    const extractVideoFile = async () => {
      const res = await fetch(videoSrc);
      const blob = await res.blob();
      const blobSrc = window.URL.createObjectURL(blob);
      setVideoBlobSrc(blobSrc);
    };
    extractVideoFile();

    return () => {
      if (videoBlobSrc) {
        window.URL.revokeObjectURL(videoBlobSrc);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  useEffect(() => {
    if (videoRef.current) {
      const playbackSpeed = playbackSpeedOptions[playbackSpeedIndex];
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeedIndex]);

  // - -

  const shouldShowControls = useMemo(() => {
    return (isVideoPlaying && isVideoHovered) || !isVideoPlaying;
  }, [isVideoHovered, isVideoPlaying]);

  const { width: sliderWidth } = useSpring({
    width: isVolumeHovered ? "35px" : "0px",
  });

  const { opacity: controlsOpacity } = useSpring({
    opacity: shouldShowControls ? 1 : 0,
  });

  const playPauseVideo = useCallback(() => {
    if (isVideoPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
  }, [isVideoPlaying]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsVideoHovered(true)}
      onMouseLeave={() => setIsVideoHovered(false)}
    >
      <video
        ref={videoRef}
        src={videoBlobSrc ?? ""}
        autoPlay={false}
        className="hover:cursor-pointer w-full h-full object-contain"
        onLoadedMetadata={(e) => setVideoDuration(e.currentTarget.duration)}
        onCanPlay={() => setIsVideoLoaded(true)}
        onPlay={() => setIsVideoPlaying(true)}
        onPause={() => setIsVideoPlaying(false)}
        onClick={() => playPauseVideo()}
        onTimeUpdate={(e) => setVideoCurrTime(e.currentTarget.currentTime)}
        // controls
        // controlsList="nodownload"
      />

      {(!isVideoLoaded || !videoBlobSrc) && (
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
            <div className="pointer-events-auto">
              <Icon
                color="white"
                useMaterialUiIcon
                name={isVideoPlaying ? "pause" : "play_arrow"}
                onClick={() => playPauseVideo()}
                iconStyle={{ fontSize: "22px" }}
              />
            </div>

            <div className="text-[13px]">
              {`${secondsToVideoDuration(
                videoCurrTime
              )} / ${secondsToVideoDuration(videoDuration)}`}
            </div>

            <div
              className="flex items-center gap-3 pointer-events-auto"
              onMouseEnter={() => setIsVolumeHovered(true)}
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
                  iconStyle={{ fontSize: "22px" }}
                  containerClassName="ml-auto"
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
                    if (typeof newValue === "number") {
                      setVideoVolume(newValue);
                    }
                  }}
                />
              </animated.div>
            </div>

            <div
              className="ml-auto cursor-pointer text-[13px] flex items-center pointer-events-auto"
              onClick={() => {
                setPlaybackSpeedIndex(
                  (prev) => (prev + 1) % playbackSpeedOptions.length
                );
              }}
            >
              {playbackSpeedOptions[playbackSpeedIndex].toFixed(2)}x
            </div>
          </div>

          {/* Timeline for seeking */}
          <div className="px-[10px] pointer-events-auto">
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
              value={Number((videoCurrTime / videoDuration).toFixed(2))}
              onChange={(_e, newValue: number | number[]) => {
                if (typeof newValue === "number" && videoRef.current) {
                  // e.g slided to 0.2 and total time is 60s -> 0.2 * 60 = 12s
                  const newCurrTime = newValue * videoDuration;
                  videoRef.current.currentTime = newCurrTime;
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
