import { useState, useEffect, useMemo, useCallback } from "react";
import { useSpring, easings } from "react-spring";

// Models
import { Sequence, ZoomType } from "models";

// Utils
import { calculateSequenceParameters } from "./zoom-utils";

// - - - - - -

/**
 * One single zoom sequence consists of three phases: **Zoom-in**, **Stay-in**, **Zoom-out**.
 * Before the first zoom sequence, there is one initial delay.
 * After each zoom sequence, before going to the next zoom, there is also one delay.
 *
 * Example: Initial delay -> Seq 1 -> Delay -> Seq 2 -> Delay -> Seq 3 -> Delay.
 * Each sequence has three phases as mentioned previously.
 */
export const useZoom = (
  sequences: Sequence[],
  shouldIncrement: boolean,
  delayTime: number,
  containedImgSize: { containedImgWidth: number; containedImgHeight: number },
  containedImgRatio: { widthRatio: number; heightRatio: number },
  zoomType: ZoomType
) => {
  const { containedImgWidth, containedImgHeight } = containedImgSize;
  const { widthRatio, heightRatio } = containedImgRatio;

  // - - - States - - -

  // NOTE: Initial value is true because screen starts with initial delay, before first sequence
  const [isDelayActive, setisDelayActive] = useState<boolean>(true);

  const [currSequenceIdx, setCurrSequenceIdx] = useState<number | null>(null);

  // - - - Main Logic - - -

  /**
   *
   */
  const currSequence = useMemo<Sequence | null>(
    () => (currSequenceIdx === null ? null : sequences[currSequenceIdx]),
    [sequences, currSequenceIdx]
  );

  /**
   *
   */
  const prevSequence = useMemo<Sequence | null>(() => {
    if (currSequenceIdx === null || currSequenceIdx <= 0) {
      return null;
    }
    return sequences[currSequenceIdx - 1];
  }, [sequences, currSequenceIdx]);

  /**
   *
   */
  // const isFinalDelay = useMemo<boolean>(
  //   () => currSequenceIdx === sequences.length - 1 && isDelayActive,
  //   [sequences.length, currSequenceIdx, isDelayActive]
  // );

  /**
   *
   */
  const { zoomTime, stayTime, duration } =
    useMemo(
      () =>
        currSequence
          ? calculateSequenceParameters(currSequence, zoomType)
          : null,
      [currSequence, zoomType]
    ) ?? {};

  /**
   *
   */
  const { zoomingIn, stayingIn } =
    useMemo(() => {
      if (
        zoomTime === undefined ||
        stayTime === undefined ||
        duration === undefined
      ) {
        return null;
      }

      // E.g. zoomTime = 10s, stayTime = 20s, zoomType = 'RESET_AFTER_ZOOM'
      // This means that the total duration must be 40s
      // Result will be: [10s, 20s, 40s, 0.25, 0.75]
      // initialDelay + [0, 0.25, 0.75, 1] --> initialDelay + [0, zoomingIn, stayingIn, 1]
      // Initial delay, then zooming-in for 10s, then stay-in-detail for 20s, finally zoom-out for 10s
      const zoomingIn = zoomTime / duration;
      const stayingIn = (zoomTime + stayTime) / duration;

      return { zoomingIn, stayingIn };
    }, [zoomTime, stayTime, duration]) ?? {};

  // - - - Spring - - -

  const [{ zoom, translate }, api] = useSpring(() => ({
    zoom: 1,
    translate: 1,
  }));

  // - - - Effects - - -

  /**
   * Effect responsible for playing / pausing the sequence animation flow
   */
  useEffect(() => {
    if (!shouldIncrement) {
      api.pause();
      return;
    }
    api.resume();
  }, [api, shouldIncrement]);

  /**
   * Effect responsible for starting and handling the sequence animation flow
   */
  useEffect(() => {
    sequences.reduce((accDelay, seq, seqIdx) => {
      const { duration } = calculateSequenceParameters(seq, zoomType);

      api.start({
        from: { zoom: 0, translate: 0 },
        to: { zoom: 1, translate: 1 },
        delay: accDelay,
        config: { duration: duration }, // easing: easings.easeInOutQuad
        onStart: () => {
          setCurrSequenceIdx(seqIdx);
          setisDelayActive(false);
        },
        onResolve: () => {
          setisDelayActive(true);
        },
      });

      return accDelay + duration + delayTime;
    }, delayTime);
  }, [sequences, delayTime, zoomType, api]);

  // - - - Zoom Styling (common) - - -

  const getTranslation = useCallback(
    (currSeq: Sequence) => {
      const x = containedImgWidth / 2 - currSeq.left * widthRatio;
      const y = containedImgHeight / 2 - currSeq.top * heightRatio;

      const translation = { x, y };
      return translation;
    },
    [containedImgWidth, containedImgHeight, widthRatio, heightRatio]
  );

  // - - - Zoom Styling (reset-after-zoom) - - -

  const zoomStyleReset =
    currSequence && zoomingIn && stayingIn
      ? {
          scale: zoom
            .to([0, zoomingIn, stayingIn, 1], [0, 1, 1, 0]) // NOTE: [zooming-in, staying-in-detail, zooming-out] for scale looks like [0, 1, 1, 0]
            .to((x) => Math.log2(x + 1)) // NOTE: represents easing function, our custom one, not using predefined
            .to([0, 1], [1, currSequence.zoom]), // NOTE: When zooming-in, we need to map value 1 to our real zoom scale value

          translateX: translate
            .to([0, zoomingIn, stayingIn, 1], [0, 1, 1, 0])
            .to(easings.easeOutQuad)
            .to([0, 1], [0, getTranslation(currSequence).x]),

          translateY: translate
            .to([0, zoomingIn, stayingIn, 1], [0, 1, 1, 0])
            .to(easings.easeOutQuad)
            .to([0, 1], [0, getTranslation(currSequence).y]),
        }
      : undefined;

  // - - - Zoom Styling (continuous-zoom)

  const fromZoom = currSequenceIdx === 0 ? 1 : prevSequence?.zoom ?? 1;
  const fromTarget =
    currSequenceIdx === 0 || prevSequence === null
      ? { x: 0, y: 0 }
      : getTranslation(prevSequence);

  // NOTE: To immediately return to center (without animation), add isFinalDelay condition
  const toZoom = currSequence?.zoom ?? 1;
  const toTarget =
    currSequence === null ? { x: 0, y: 0 } : getTranslation(currSequence);

  const zoomStyleContinuous =
    currSequence && zoomingIn && stayingIn
      ? {
          scale: zoom.to([0, zoomingIn, stayingIn, 1], [0, 1, 1, 1]).to((v) => {
            const result = fromZoom + (toZoom - fromZoom) * v;
            return result;
          }),

          translateX: translate
            .to([0, zoomingIn, stayingIn, 1], [0, 1, 1, 1])
            .to(easings.easeOutQuad)
            .to((v) => {
              const result = fromTarget.x + (toTarget.x - fromTarget.x) * v;
              return result;
            }),

          translateY: translate
            .to([0, zoomingIn, stayingIn, 1], [0, 1, 1, 1])
            .to(easings.easeOutQuad)
            .to((v) => {
              const result = fromTarget.y + (toTarget.y - fromTarget.y) * v;
              return result;
            }),
        }
      : undefined;

  // - - - Return Value - - -

  const zoomStyle =
    zoomType === "RESET_AFTER_ZOOM" ? zoomStyleReset : zoomStyleContinuous;

  return { currSequence, isDelayActive, zoomStyle };
};
