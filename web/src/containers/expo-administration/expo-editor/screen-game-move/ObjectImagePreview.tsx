import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { animated } from "react-spring";

import useResizeObserver from "hooks/use-resize-observer";
import { useElementMove } from "hooks/spring-hooks/use-element-move";
import { useElementResize } from "hooks/spring-hooks/use-element-resize";

// Models
import { AppDispatch } from "store/store";
import { GameMoveScreen } from "models";

// Actions and utils
import { updateScreenData } from "actions/expoActions";
import { calculateObjectFit } from "utils/object-fit";
import { calculateObjectSizeBackup } from "containers/views/games/game-move/utils";

// Assets
import expandImg from "../../../../assets/img/expand.png";

// - - - -

type ObjectImagePreviewProps = {
  activeScreen: GameMoveScreen;
  image1Src: string;
  objectImgSrc: string | null;
  object2ImgSrc: string | null;
  object3ImgSrc: string | null;
};

const ObjectImagePreview = ({
  activeScreen,
  image1Src,
  objectImgSrc,
  object2ImgSrc,
  object3ImgSrc,
}: ObjectImagePreviewProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.gameMoveScreen",
  });

  // - - - Derived variables - - -

  const isSomeObjectProvided = useMemo(
    () => !!objectImgSrc || !!object2ImgSrc || !!object3ImgSrc,
    [object2ImgSrc, object3ImgSrc, objectImgSrc]
  );

  // - - - Assignment image - - -

  const image1OrigData = activeScreen.image1OrigData ?? { width: 0, height: 0 };

  const [containerRef, containerSize] = useResizeObserver();

  const {
    width: containedAssignmentImgWidth,
    height: containedAssignmentImgHeight,
    left: fromLeft,
    top: fromTop,
  } = calculateObjectFit({
    type: "contain",
    parent: containerSize,
    child: image1OrigData,
  });

  const initialSizeBackupForObjs = useMemo(
    () =>
      calculateObjectSizeBackup(
        containedAssignmentImgWidth,
        containedAssignmentImgHeight
      ),
    [containedAssignmentImgWidth, containedAssignmentImgHeight]
  );

  // - - - Object 1 - - -

  const objectOrigData = activeScreen.objectOrigData ?? { width: 0, height: 0 };

  const [objectRef, objectSize] = useResizeObserver();

  const { moveSpring, bindMoveDrag } = useElementMove({
    containerSize: containerSize,
    dragMovingObjectSize: objectSize,
    initialPosition: activeScreen.objectPositionProps?.containerPosition,
    additionalCallback: (left, top) => {
      dispatch(
        updateScreenData({
          objectPositionProps: {
            containerPosition: { left: left, top: top },
            containedImgPosition: {
              left: left - fromLeft,
              top: top - fromTop,
            },
          },
        })
      );
    },
  });

  const { resizeSpring, bindResizeDrag } = useElementResize({
    containerSize: containerSize,
    dragResizingImgOrigData: objectOrigData,
    initialSize:
      activeScreen.objectSizeProps?.inContainerSize ?? initialSizeBackupForObjs,
    additionalCallback: (width, height) => {
      dispatch(
        updateScreenData({
          objectSizeProps: {
            inContainerSize: { width: width, height: height },
            inContainedImgFractionSize: {
              width: width / containedAssignmentImgWidth,
              height: height / containedAssignmentImgHeight,
            },
          },
        })
      );
    },
  });

  // - - - Object 2 - - -

  const object2OrigData = activeScreen.object2OrigData ?? {
    width: 0,
    height: 0,
  };

  const [object2Ref, object2Size] = useResizeObserver();

  const { moveSpring: move2Spring, bindMoveDrag: bindMove2Drag } =
    useElementMove({
      containerSize: containerSize,
      dragMovingObjectSize: object2Size,
      initialPosition: activeScreen.object2PositionProps?.containerPosition,
      additionalCallback: (left, top) => {
        dispatch(
          updateScreenData({
            object2PositionProps: {
              containerPosition: { left: left, top: top },
              containedImgPosition: {
                left: left - fromLeft,
                top: top - fromTop,
              },
            },
          })
        );
      },
    });

  const { resizeSpring: resize2Spring, bindResizeDrag: bindResize2Drag } =
    useElementResize({
      containerSize: containerSize,
      dragResizingImgOrigData: object2OrigData,
      initialSize:
        activeScreen.object2SizeProps?.inContainerSize ??
        initialSizeBackupForObjs,
      additionalCallback: (width, height) => {
        dispatch(
          updateScreenData({
            object2SizeProps: {
              inContainerSize: { width: width, height: height },
              inContainedImgFractionSize: {
                width: width / containedAssignmentImgWidth,
                height: height / containedAssignmentImgHeight,
              },
            },
          })
        );
      },
    });

  // - - - Object 3 - - -

  const object3OrigData = activeScreen.object3OrigData ?? {
    width: 0,
    height: 0,
  };

  const [object3Ref, object3Size] = useResizeObserver();

  const { moveSpring: move3Spring, bindMoveDrag: bindMove3Drag } =
    useElementMove({
      containerSize: containerSize,
      dragMovingObjectSize: object3Size,
      initialPosition: activeScreen.object3PositionProps?.containerPosition,
      additionalCallback: (left, top) => {
        dispatch(
          updateScreenData({
            object3PositionProps: {
              containerPosition: { left: left, top: top },
              containedImgPosition: {
                left: left - fromLeft,
                top: top - fromTop,
              },
            },
          })
        );
      },
    });

  const { resizeSpring: resize3Spring, bindResizeDrag: bindResize3Drag } =
    useElementResize({
      containerSize: containerSize,
      dragResizingImgOrigData: object3OrigData,
      initialSize:
        activeScreen.object3SizeProps?.inContainerSize ??
        initialSizeBackupForObjs,
      additionalCallback: (width, height) => {
        dispatch(
          updateScreenData({
            object3SizeProps: {
              inContainerSize: { width: width, height: height },
              inContainedImgFractionSize: {
                width: width / containedAssignmentImgWidth,
                height: height / containedAssignmentImgHeight,
              },
            },
          })
        );
      },
    });

  // - - - GUI - - -

  if (!isSomeObjectProvided) {
    return null;
  }

  return (
    <div className="mt-16 mb-32 flex flex-col justify-center items-center gap-6">
      <div className="self-start font-['Work_Sans'] text-lg">
        {t("screenPreviewText")}
      </div>

      <div
        ref={containerRef}
        className="w-[450px] h-[350px] relative overflow-hidden border-solid border-2 border-black"
      >
        <img
          src={image1Src}
          alt="first img"
          className="absolute w-full h-full object-contain"
        />

        {/* Object 1 */}
        {objectImgSrc && (
          <animated.div
            className="touch-none absolute p-2 border-2 border-white border-opacity-50 border-dashed hover:cursor-move"
            style={{
              left: moveSpring.left,
              top: moveSpring.top,
              width: resizeSpring.width,
              height: resizeSpring.height,
              WebkitUserSelect: "none",
              WebkitTouchCallout: "none",
            }}
            ref={objectRef}
          >
            <img
              className="touch-none w-full h-full object-contain"
              src={objectImgSrc}
              draggable={false}
              alt="object-drag-content"
              {...bindMoveDrag()}
            />

            <img
              className="touch-none absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 hover:cursor-se-resize"
              src={expandImg}
              draggable={false}
              alt="expand-image-1-icon"
              {...bindResizeDrag()}
            />
          </animated.div>
        )}

        {/* Object 2 */}
        {object2ImgSrc !== null && (
          <animated.div
            className="touch-none absolute p-2 border-2 border-white border-opacity-50 border-dashed hover:cursor-move"
            style={{
              left: move2Spring.left,
              top: move2Spring.top,
              width: resize2Spring.width,
              height: resize2Spring.height,
              WebkitUserSelect: "none",
              WebkitTouchCallout: "none",
            }}
            ref={object2Ref}
          >
            <img
              className="touch-none w-full h-full object-contain"
              src={object2ImgSrc}
              draggable={false}
              alt="object-2-drag-content"
              {...bindMove2Drag()}
            />

            <img
              className="touch-none absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 hover:cursor-se-resize"
              src={expandImg}
              draggable={false}
              alt="expand-image-2-icon"
              {...bindResize2Drag()}
            />
          </animated.div>
        )}

        {/* Object 3 */}
        {object3ImgSrc !== null && (
          <animated.div
            className="touch-none absolute p-2 border-2 border-white border-opacity-50 border-dashed hover:cursor-move"
            style={{
              left: move3Spring.left,
              top: move3Spring.top,
              width: resize3Spring.width,
              height: resize3Spring.height,
              WebkitUserSelect: "none",
              WebkitTouchCallout: "none",
            }}
            ref={object3Ref}
          >
            <img
              className="touch-none w-full h-full object-contain"
              src={object3ImgSrc}
              draggable={false}
              alt="object-3-drag-content"
              {...bindMove3Drag()}
            />

            <img
              className="touch-none absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 hover:cursor-se-resize"
              src={expandImg}
              draggable={false}
              alt="expand-image-3-icon"
              {...bindResize3Drag()}
            />
          </animated.div>
        )}
      </div>
    </div>
  );
};

export default ObjectImagePreview;
