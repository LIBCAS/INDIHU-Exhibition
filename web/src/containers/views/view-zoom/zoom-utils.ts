import { ImageOrigData, Sequence, ZoomType } from "models";
import { ZOOM_SCREEN_DEFAULT_STAY_IN_DETAIL_TIME } from "constants/screen";

// - - - - - -

/**
 * Calculates timing parameters for a single sequence which is being animated.
 *
 * One single animation can consist of the three possible phases: **Zoom-in**, **Stay-in**, **Zoom-out**
 *
 * Variables:
 * - `zoomTime` represents duration of **zoom-in** or **zoom-out** phase (time until required zoom scale is achieved)
 * - `stayTime` represents duration for how long we remain in the **stay-in-detail** (time for how long we remain zoomed)
 * - `duration` represents the length of the entire sequence animation (summary of all phases)
 *
 * All three returned time variables are expressed in **milliseconds**.
 */
export const calculateSequenceParameters = (
  seq: Sequence,
  zoomType: ZoomType
) => {
  const zoomTime = (seq.time ?? 2) * 1000;
  const stayTime =
    (seq.stayInDetailTime ?? ZOOM_SCREEN_DEFAULT_STAY_IN_DETAIL_TIME) * 1000;

  let duration;

  if (zoomType === "RESET_AFTER_ZOOM") {
    duration = zoomTime + stayTime + zoomTime; // NOTE: zoom-in, stay-in, zoom-out
  } else if (zoomType === "CONTINUOUS_ZOOM") {
    duration = zoomTime + stayTime; // NOTE: zoom-in, stay-in (missing zoom-out phase)
  } else {
    const errMsg = `[calculateSequenceParameters]: Unknown zoom type ${zoomType}`;
    console.error(errMsg);
    duration = 0;
  }

  return { zoomTime, stayTime, duration };
};

// - - - - - -

/**
 * Calculates the total duration of all sequence animations of which one zoom screen is composed of.
 * This result also represents the total duration of the whole zoom screen (total screen time).
 *
 * The result may include:
 * - one initial delay
 * - the duration of every sequence (summary of all of its phases),
 * - a delay between each sequence,
 * - and one final delay at the end.
 *
 * Result is expressed in **seconds**.
 */
export const calculateTotalSequencesTime = (
  sequences: Sequence[],
  delayTime: number,
  zoomType: ZoomType
) => {
  const initialDelay = delayTime;

  // NOTE: One delay is at the beginning + then one delay between sequences + finally one last delay in the end
  let totalTimeInMiliseconds = sequences.reduce((acc, seq) => {
    const { duration } = calculateSequenceParameters(seq, zoomType);
    return acc + duration + delayTime;
  }, initialDelay);

  if (zoomType === "RESET_AFTER_ZOOM") {
    const totalTimeInSeconds = Math.round(totalTimeInMiliseconds / 1000);
    return totalTimeInSeconds;
  }

  // NOTE: When using 'CONTINUOUS_ZOOM', we need to add some extra time for our fake sequence
  // One delay time as zoomTime, to return back to center with zoom 1, second delay time to stay there for some time
  totalTimeInMiliseconds = totalTimeInMiliseconds + delayTime + delayTime;
  const totalTimeInSeconds = Math.round(totalTimeInMiliseconds / 1000);
  return totalTimeInSeconds;
};

// - - - - - -

/**
 * When using zoomType as 'CONTINUOUS_ZOOM', we need to use one additional extra fake sequence.
 * The purpose of this last fake sequence is to go from last sequence animation back to the center.
 *
 * In order that this fake sequence is perfectly centered, we need:
 * - to use zoom scale 1
 * - empty text so its not being displayed as real sequence
 * - left and top coordinates needs to be derived from the image used as background
 */
export const generateFakeSequence = (
  imageOrigData: ImageOrigData,
  delayTime: number
): Sequence => {
  const fakeSequence: Sequence = {
    left: imageOrigData.width / 2,
    top: imageOrigData.height / 2,
    text: "", // NOTE: Empty text is not displayed
    zoom: 1,
    time: delayTime / 1000, // NOTE: we need seconds here
  };
  return fakeSequence;
};
