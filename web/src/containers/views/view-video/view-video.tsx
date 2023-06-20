import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useSpring, animated } from "react-spring";

import FontIcon from "react-md/lib/FontIcons/FontIcon";

import {
  setViewProgress,
  setTooltipInfo,
} from "actions/expoActions/viewer-actions";
import { AppDispatch, AppState } from "store/store";

import { ScreenProps } from "models";
import { useUpdateEffect } from "hooks/update-effect-hook";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewProgress.shouldIncrement,
  ({ expo }: AppState) => expo.viewProgress.totalTime,
  ({ expo }: AppState) => expo.viewProgress.rewindToTime,
  ({ expo }: AppState) => expo.expoVolumes,
  (shouldIncrement, totalTime, rewindToTime, expoVolumes) => ({
    shouldIncrement,
    totalTime,
    rewindToTime,
    expoVolumes,
  })
);

export const ViewVideo = ({ screenPreloadedFiles }: ScreenProps) => {
  const { shouldIncrement, totalTime, rewindToTime, expoVolumes } =
    useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();

  const videoRef = useRef<HTMLVideoElement>(null);

  // Value ranging between 0 and 1
  const { x } = useSpring({
    x: shouldIncrement ? 1 : 0,
    config: { duration: 250 },
  });

  const onLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.controls = false;
    video.currentTime = 0;
    video.volume = expoVolumes.speechVolume.actualVolume / 100;
    //video.muted = expoVolumes.speechVolume.actualVolume === 0;

    if (shouldIncrement) {
      video.play();
    }

    const timeElapsedVideo = video ? video.currentTime : 0;
    const totalTime = video ? video.duration * 1000 : 20 * 1000;

    dispatch(
      setViewProgress({
        timeElapsed: timeElapsedVideo,
        totalTime,
        shouldRedirect: true,
      })
    );

    dispatch(setTooltipInfo({ videoDuration: video.duration }));
  }, [dispatch, expoVolumes, shouldIncrement]);

  const onClick = () => {
    dispatch(
      setViewProgress({
        shouldIncrement: !shouldIncrement,
      })
    );
  };

  // If shouldIncrement state is changed <--> stop and play the video!
  useUpdateEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!shouldIncrement) {
      video.pause();
      return;
    }

    video.play();
  }, [shouldIncrement]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.volume = expoVolumes.speechVolume.actualVolume / 100;
  }, [expoVolumes]);

  // Act on rewindToTime change
  useEffect(() => {
    if (rewindToTime === null) {
      return;
    }

    const video = videoRef.current;
    if (!video) {
      return;
    }

    // 1.) Actualize the timeElapsed.. so the % width of progress bar will be okay and redirecting
    dispatch(setViewProgress({ timeElapsed: rewindToTime }));

    // 2.) Seek the video
    const reduxPercentage = (rewindToTime / totalTime) * 100;
    const newVideoCurrentTime = (video.duration / 100) * reduxPercentage;
    const newVideoCurrentTimeFormatted = parseFloat(
      newVideoCurrentTime.toFixed(1)
    );
    video.currentTime = newVideoCurrentTimeFormatted;

    return () => dispatch(setViewProgress({ rewindToTime: null }));
  }, [rewindToTime, totalTime, dispatch]);

  // Clear store.expo.tooltipInfo.videoDuration after clicking to the next screen
  useEffect(() => {
    return () => dispatch(setTooltipInfo({ videoDuration: null }));
  }, [dispatch]);

  return (
    <div className="w-full h-full">
      {screenPreloadedFiles.video && (
        <>
          <video
            src={screenPreloadedFiles.video}
            autoPlay={false}
            className="hover:cursor-pointer w-full h-full object-contain relative"
            onLoadedMetadata={onLoadedMetadata}
            onClick={onClick}
            ref={videoRef}
          />

          {/* Icon in the middle */}
          <animated.div
            className="hover:cursor-pointer"
            onClick={onClick}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: x.to(
                (value) =>
                  `translate(-50%, -50%) scale(${1 - value}, ${1 - value})`
              ),

              backgroundColor: "white",
              opacity: "80%",
              width: "92px",
              height: "92px",
              borderRadius: "50%",

              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontIcon
              style={{
                color: "#d2a473",
                fontSize: "60px",
              }}
            >
              {shouldIncrement ? "pause" : "play_arrow"}
            </FontIcon>
          </animated.div>
        </>
      )}
    </div>
  );
};
