import { ZOOM_SCREEN_DEFAULT_STAY_IN_DETAIL_TIME } from "constants/screen";
import { Sequence } from "models";

// - - - - - -

/**
 * Calculates timing parameters for a single sequence which is being animated.
 *
 * Each sequence animation consists of the three following phases: **zoom-in phase**, **stay-in-detail** phase, **zoom-out** phase.
 *
 * Variables:
 * - `zoomTime` represents duration of **zoom-in** and **zoom-out** phase (required zoom scale being achieved)
 * - `stayTime` represents duration for how long we remain in the **stay-in-detail**
 * - `duration` represents the length of the whole three phase sequence animation
 *
 * All three returned time variables are expressed in **milliseconds**.
 */
export const calculateSequenceParameters = (seq: Sequence) => {
  const zoomTime = (seq.time ?? 2) * 1000;
  const stayTime =
    (seq.stayInDetailTime ?? ZOOM_SCREEN_DEFAULT_STAY_IN_DETAIL_TIME) * 1000;
  const duration = zoomTime + stayTime + zoomTime;
  return { zoomTime, stayTime, duration };
};

// - - - - - -

/**
 * Calculates the total duration of all sequence animations on the screen.
 * This result also represents the total duration of the whole screen (total screen time).
 *
 * The result includes:
 * - the duration of every sequence (zoom-in + stay-in-detail + zoom-out),
 * - one initial delay,
 * - a delay between each sequence,
 * - and one final delay at the end.
 *
 * Result is expressed in **seconds**.
 */
export const calculateTotalSequencesTime = (
  sequences: Sequence[],
  delayTime: number
) => {
  // NOTE: One delay is at the beginning + then one delay between sequences + finally one last delay in the end
  const totalTimeInMiliseconds = sequences.reduce((acc, seq) => {
    const { duration } = calculateSequenceParameters(seq);
    return acc + duration + delayTime;
  }, delayTime);

  const totalTimeInSeconds = Math.round(totalTimeInMiliseconds / 1000);
  return totalTimeInSeconds;
};

// - - - - - -

/**
 * As previously mentioned, one whole zoom sequence animation consists of three phases: zoom in, stay in, zoom out.
 * As previously mentioned, there is one initial delay, one delay between each sequence, one final delay.
 *
 * Example: Initial delay -> Zoom-in -> Stay-in-detail -> Zoom-out -> Delay -> ... -> Final delay
 *
 * This hooks calculates some required animation parameters for a single sequence.
 */
export const useZoomPhase = (currSeq: Sequence | null) => {
  if (!currSeq) {
    return null;
  }

  const { zoomTime, stayTime, duration } = calculateSequenceParameters(currSeq);

  // E.g. zoomTime = 10s, stayTime = 20s
  // This means that the total duration must be 40s
  // Result will be: [10s, 20s, 40s, 0.25, 0.75]
  // initialDelay + [0, 0.25, 0.75, 1] --> initialDelay + [0, zoomingIn, stayingIn, 1]
  // Initial delay, then zooming-in for 10s, then stay-in-detail for 20s, finally zoom-out for 10s
  const zoomingIn = zoomTime / duration;
  const stayingIn = (zoomTime + stayTime) / duration;

  return { zoomTime, stayTime, duration, zoomingIn, stayingIn };
};
