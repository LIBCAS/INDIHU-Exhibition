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
