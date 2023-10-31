import { ZOOM_SCREEN_DEFAULT_STAY_IN_DETAIL_TIME } from "constants/screen";
import { Sequence } from "models";

/** Resulting duration is in miliseconds */
export const calculateSequenceParameters = (seq: Sequence) => {
  const zoomTime = (seq.time ?? 2) * 1000;
  const stayTime =
    (seq.stayInDetailTime ?? ZOOM_SCREEN_DEFAULT_STAY_IN_DETAIL_TIME) * 1000;
  const duration = zoomTime + stayTime + zoomTime;
  return { zoomTime, stayTime, duration };
};

/** Result is in seconds */
export const calculateTotalSequencesTime = (
  sequences: Sequence[],
  delayTime: number
) => {
  // One delay in the beginning, then between sequences and one in the end
  const totalTimeInMiliseconds = sequences.reduce((acc, seq) => {
    const { duration } = calculateSequenceParameters(seq);
    return acc + duration + delayTime; // 1 initial and then x delays, after is here
  }, delayTime);

  const totalTimeInSeconds = Math.round(totalTimeInMiliseconds / 1000);
  return totalTimeInSeconds;
};

/** One zoom consists of three phases: zoom in, stay in, zoom out
 *  After each zoom there is also delay before the next zoom starts
 *  There is also one initial delay before first zoom starts
 *  Example: Delay -> Zoom in, Stay, Zoom out -> Delay -> Phase2 -> Final delay
 */
export const useZoomPhase = (currSeq: Sequence | null) => {
  if (!currSeq) {
    return null;
  }

  const { zoomTime, stayTime, duration } = calculateSequenceParameters(currSeq);

  // E.g [0, 0.25, 0.75, 1] --> [0, zoomingIn, stayingIn, 1]
  // If duration would be 40s, then after delay, 10s zooming in, 20s staying, 10s zooming out
  const zoomingIn = zoomTime / duration;
  const stayingIn = (zoomTime + stayTime) / duration;

  return { zoomTime, stayTime, duration, zoomingIn, stayingIn };
};
