import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import { setViewProgress } from "actions/expoActions/viewer-actions";
import { AppDispatch, AppState } from "store/store";

import { ScreenProps } from "../types";
import { useUpdateEffect } from "hooks/update-effect-hook";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.soundIsTurnedOff,
  ({ expo }: AppState) => expo.viewProgress.shouldIncrement,
  (soundIsTurnedOff, shouldIncrement) => ({
    soundIsTurnedOff,
    shouldIncrement,
  })
);

export const ViewVideo = ({ screenFiles }: ScreenProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { soundIsTurnedOff, shouldIncrement } = useSelector(stateSelector);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.controls = false;
    video.currentTime = 0;
    video.muted = !!soundIsTurnedOff;

    if (shouldIncrement) {
      video.play();
    }

    const timeElapsed = video ? video.currentTime : 0;
    const totalTime = video ? video.duration * 1000 : 20 * 1000;

    dispatch(
      setViewProgress({
        timeElapsed,
        totalTime,
        shouldRedirect: true,
      })
    );
  }, [dispatch, soundIsTurnedOff, shouldIncrement]);

  useUpdateEffect(() => {
    const video = videoRef.current;
    if (!shouldIncrement) {
      video?.pause();
      return;
    }

    video?.play();
  }, [shouldIncrement]);

  useUpdateEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !!soundIsTurnedOff;
  }, [soundIsTurnedOff]);

  const onClick = () => {
    dispatch(
      setViewProgress({
        shouldIncrement: !shouldIncrement,
      })
    );
  };

  return (
    <div className="w-full h-full">
      {screenFiles.video && (
        <video
          src={screenFiles.video}
          autoPlay={false}
          className="hover:cursor-pointer w-full h-full object-contain"
          onLoadedMetadata={onLoadedMetadata}
          onClick={onClick}
          ref={videoRef}
        />
      )}
    </div>
  );
};
