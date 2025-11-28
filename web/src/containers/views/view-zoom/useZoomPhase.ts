import { Sequence } from "models";
import { calculateSequenceParameters } from "./zoom-utils";

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
