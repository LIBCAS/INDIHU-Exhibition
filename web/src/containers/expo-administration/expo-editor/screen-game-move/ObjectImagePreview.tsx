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

// Assets
import expandImg from "../../../../assets/img/expand.png";

// - - - -

type ObjectImagePreviewProps = {
  activeScreen: GameMoveScreen;
  image1Src: string;
  objectImgSrc: string;
};

const ObjectImagePreview = ({
  activeScreen,
  image1Src,
  objectImgSrc,
}: ObjectImagePreviewProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.gameMoveScreen",
  });

  const image1OrigData = activeScreen.image1OrigData ?? { width: 0, height: 0 };
  const objectOrigData = activeScreen.objectOrigData ?? { width: 0, height: 0 };

  const [containerRef, containerSize] = useResizeObserver();
  const [objectRef, objectSize] = useResizeObserver();

  const {
    width: containedImg1Width,
    height: containedImg1Height,
    left: fromLeft,
    top: fromTop,
  } = calculateObjectFit({
    type: "contain",
    parent: containerSize,
    child: image1OrigData,
  });

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
    initialSize: activeScreen.objectSizeProps?.inContainerSize,
    additionalCallback: (width, height) => {
      dispatch(
        updateScreenData({
          objectSizeProps: {
            inContainerSize: { width: width, height: height },
            inContainedImgFractionSize: {
              width: width / containedImg1Width,
              height: height / containedImg1Height,
            },
          },
        })
      );
    },
  });

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
            alt="object drag content"
            {...bindMoveDrag()}
          />

          <img
            className="touch-none absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 hover:cursor-se-resize"
            src={expandImg}
            draggable={false}
            alt="expand image icon"
            {...bindResizeDrag()}
          />
        </animated.div>
      </div>
    </div>
  );
};

export default ObjectImagePreview;
