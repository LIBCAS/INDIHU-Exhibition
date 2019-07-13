import React from "react";
import { connect } from "react-redux";
import { forEach, get, isEqual } from "lodash";
import {
  compose,
  withState,
  withHandlers,
  lifecycle,
  withProps
} from "recompose";

import ScreenDraggedCard from "./ScreenDraggedCard";
import { screenType } from "../../../enums/screenType";
import {
  moveScreen,
  moveChapter,
  moveAloneScreenToChapter,
  moveScreenFromChapter
} from "../../../actions/expoActions";

const Draggable = ({
  children,
  onMouseMove,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  dragAndDropData: { draggedScreen },
  screens,
  onClickEnabled
}) => {
  return (
    <div
      id="expo-structure-container-modeller"
      className="container-modeller structure"
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {children}
      <ScreenDraggedCard
        rowNum={draggedScreen ? draggedScreen.rowNum : null}
        colNum={draggedScreen ? draggedScreen.colNum : null}
        onClickEnabled={onClickEnabled}
        data={
          draggedScreen
            ? get(screens, `[${draggedScreen.rowNum}][${draggedScreen.colNum}]`)
            : null
        }
      />
    </div>
  );
};

const dragAndDropDataDefault = {
  mouseDown: false,
  draggedScreen: null,
  targetLocationCard: null
};

export default compose(
  connect(
    null,
    {
      moveScreen,
      moveChapter,
      moveAloneScreenToChapter,
      moveScreenFromChapter
    }
  ),
  withState("mouseDownTimeout", "setMouseDownTimeout", null),
  withState("dragAndDropData", "setDragAndDropData", dragAndDropDataDefault),
  withState("onClickEnabled", "setOnClickEnabled", true),
  withHandlers({
    isInsideRectangle: () => (x, y, left, right, top, bottom) =>
      x >= left && x <= right && y >= top && y <= bottom,
    rectanglesOverlap: () => (
      left1,
      right1,
      top1,
      bottom1,
      left2,
      right2,
      top2,
      bottom2
    ) =>
      (left1 >= left2 && left1 <= right2 && top1 >= top2 && top1 <= bottom2) ||
      (right1 >= left2 &&
        right1 <= right2 &&
        top1 >= top2 &&
        top1 <= bottom2) ||
      (left1 >= left2 &&
        left1 <= right2 &&
        bottom1 >= top2 &&
        bottom1 <= bottom2) ||
      (right1 >= left2 &&
        right1 <= right2 &&
        bottom1 >= top2 &&
        bottom1 <= bottom2)
  }),
  withHandlers({
    isInsideCard: ({ isInsideRectangle }) => (x, y, rowNum, colNum) => {
      const screen = document.getElementById(
        `expo-structure-screen-card-${rowNum}-${colNum}`
      );

      if (screen) {
        const screenPosition = screen.getBoundingClientRect();

        if (
          isInsideRectangle(
            x,
            y,
            screenPosition.left,
            screenPosition.right,
            screenPosition.top,
            screenPosition.bottom
          )
        ) {
          return screen;
        }
      }

      return false;
    },
    isOverlapingPossibleTargetCard: ({ rectanglesOverlap }) => (
      left,
      right,
      top,
      bottom,
      rowNum,
      colNum
    ) => {
      const screen = document.getElementById(
        `expo-structure-screen-card-${rowNum}-${colNum}`
      );

      if (screen) {
        const screenPosition = screen.getBoundingClientRect();

        if (
          rectanglesOverlap(
            left,
            right,
            top,
            bottom,
            screenPosition.left,
            screenPosition.right,
            screenPosition.top,
            screenPosition.bottom
          )
        ) {
          return screen;
        }
      }

      return false;
    },
    isOverlapingTargetLocationCard: ({ rectanglesOverlap }) => (
      left,
      right,
      top,
      bottom
    ) => {
      const screen = document.getElementById(
        "screen-dragged-card-target-location"
      );

      if (screen) {
        const screenPosition = screen.getBoundingClientRect();

        if (
          rectanglesOverlap(
            left,
            right,
            top,
            bottom,
            screenPosition.left,
            screenPosition.right,
            screenPosition.top,
            screenPosition.bottom
          )
        ) {
          return screen;
        }
      }

      return false;
    }
  }),
  withHandlers({
    updateDragAndDropData: ({
      dragAndDropData,
      setDragAndDropData,
      setOnClickEnabled
    }) => updateData => {
      const newDragAndDropData = { ...dragAndDropData, ...updateData };
      setDragAndDropData(newDragAndDropData);
      setTimeout(() => setOnClickEnabled(!newDragAndDropData.mouseDown), 100);
    },
    resetDragAndDropData: ({ setDragAndDropData }) => () =>
      setDragAndDropData(dragAndDropDataDefault),
    checkIfInsideCard: ({ screens, isInsideCard }) => (x, y) => {
      let isInside = null;
      forEach(screens, (row, rowNum) => {
        forEach(row, (_, colNum) => {
          const screen = isInsideCard(x, y, rowNum, colNum);
          if (screen) {
            const screenPosition = screen.getBoundingClientRect();
            const draggedCard = document.getElementById(
              "expo-structure-dragged-card"
            );
            const container = document.getElementById(
              "expo-structure-container-modeller"
            );
            draggedCard.style.left = `${screenPosition.left +
              container.scrollLeft}px`;
            draggedCard.style.top = `${screenPosition.top +
              container.scrollTop}px`;
            isInside = {
              rowNum,
              colNum,
              correlationLeft: screenPosition.left - x,
              correlationTop: screenPosition.top - y
            };
            return false;
          }
        });

        if (isInside) {
          return false;
        }
      });

      return isInside;
    },
    checkIfOverlapCard: ({
      screens,
      isOverlapingPossibleTargetCard,
      isOverlapingTargetLocationCard,
      dragAndDropData: { draggedScreen, targetLocationCard }
    }) => (left, right, top, bottom) => {
      if (targetLocationCard && targetLocationCard.rowNum < screens.length) {
        const screen = isOverlapingTargetLocationCard(left, right, top, bottom);
        return screen ? targetLocationCard : null;
      }

      let newTargetLocationCard = null;
      forEach(screens, (row, rowNum) => {
        forEach(row, (_, colNum) => {
          if (
            (draggedScreen.colNum > 0 &&
              (rowNum !== draggedScreen.rowNum ||
                (colNum !== draggedScreen.colNum &&
                  colNum !== draggedScreen.colNum + 1))) ||
            (draggedScreen.colNum === 0 &&
              (colNum === 0 ||
                screens[draggedScreen.rowNum][draggedScreen.colNum].type !==
                  screenType.INTRO) &&
              rowNum !== draggedScreen.rowNum &&
              rowNum !== draggedScreen.rowNum + 1)
          ) {
            const screen = isOverlapingPossibleTargetCard(
              left,
              right,
              top,
              bottom,
              rowNum,
              colNum
            );
            if (screen) {
              newTargetLocationCard = { rowNum, colNum };
              return false;
            }
          }
        });

        if (newTargetLocationCard) {
          return false;
        }
      });

      // last in col
      if (!newTargetLocationCard) {
        const screen = document.getElementById(
          `expo-structure-screen-card-${screens.length - 1}-0`
        );

        if (screen) {
          const screenPosition = screen.getBoundingClientRect();

          if (top > screenPosition.bottom) {
            newTargetLocationCard = { rowNum: screens.length, colNum: 0 };
          }
        }
      }

      // last in row
      if (!newTargetLocationCard) {
        forEach(screens, (firstScreen, rowNum) => {
          if (
            firstScreen[0].type === screenType.INTRO &&
            (rowNum !== draggedScreen.rowNum ||
              screens[rowNum].length - 1 !== draggedScreen.colNum)
          ) {
            const screen = document.getElementById(
              `expo-structure-screen-card-${rowNum}-${screens[rowNum].length -
                1}`
            );

            if (screen) {
              const screenPosition = screen.getBoundingClientRect();

              if (
                left > screenPosition.right &&
                ((top >= screenPosition.top && top <= screenPosition.bottom) ||
                  (bottom >= screenPosition.top &&
                    bottom <= screenPosition.bottom))
              ) {
                newTargetLocationCard = {
                  rowNum,
                  colNum: screens[rowNum].length
                };
              }
            }
          }
        });
      }

      return newTargetLocationCard;
    }
  }),
  withHandlers({
    onDraggingEnd: ({
      resetDragAndDropData,
      mouseDownTimeout,
      setMouseDownTimeout
    }) => () => {
      clearTimeout(mouseDownTimeout);
      setMouseDownTimeout(null);
      resetDragAndDropData();
      const draggedCard = document.getElementById(
        "expo-structure-dragged-card"
      );
      draggedCard.style.display = "none";
    },
    onMouseDownTimeout: ({
      dragAndDropData: { draggedScreen },
      updateDragAndDropData,
      resetDragAndDropData
    }) => () => {
      if (draggedScreen) {
        const draggedCard = document.getElementById(
          "expo-structure-dragged-card"
        );
        draggedCard.style.display = "block";
        updateDragAndDropData({ mouseDown: true });
      } else {
        resetDragAndDropData();
      }
    },
    updateOnDraggedScreenMove: ({
      dragAndDropData: { draggedScreen, targetLocationCard },
      checkIfOverlapCard,
      updateDragAndDropData
    }) => (x, y) => {
      const container = document.getElementById(
        "expo-structure-container-modeller"
      );
      const left = x + draggedScreen.correlationLeft + container.scrollLeft;
      const top = y + draggedScreen.correlationTop + container.scrollTop;
      const draggedCard = document.getElementById(
        "expo-structure-dragged-card"
      );
      draggedCard.style.left = `${left}px`;
      draggedCard.style.top = `${top}px`;
      const width = draggedCard.getBoundingClientRect().width;
      const height = draggedCard.getBoundingClientRect().height;
      const containerSize = container.getBoundingClientRect();
      const containerLeft = containerSize.left;
      const containerRight = containerSize.right;
      const containerTop = containerSize.top;
      const containerBottom = containerSize.bottom;

      const rightBorder = containerRight + container.scrollLeft - 2 * width;
      const leftBorder = containerLeft + container.scrollLeft + width;
      const bottomBorder = containerBottom + container.scrollTop - 2 * height;
      const topBorder = containerTop + container.scrollTop + 2 * height;

      if (left > rightBorder) {
        container.scrollLeft += left - rightBorder + 2;
      }

      if (left < leftBorder) {
        container.scrollLeft -= leftBorder - left - +2;
      }

      if (top > bottomBorder) {
        container.scrollTop += top - bottomBorder + 2;
      }

      if (top < topBorder) {
        container.scrollTop -= topBorder - top - +2;
      }

      const newTargetLocationCard = checkIfOverlapCard(
        draggedCard.getBoundingClientRect().left,
        draggedCard.getBoundingClientRect().right,
        draggedCard.getBoundingClientRect().top,
        draggedCard.getBoundingClientRect().bottom
      );

      if (
        (newTargetLocationCard || targetLocationCard) &&
        !isEqual(newTargetLocationCard, targetLocationCard)
      ) {
        updateDragAndDropData({ targetLocationCard: newTargetLocationCard });
      }
    },
    updateStructure: ({
      dragAndDropData: { draggedScreen, targetLocationCard },
      screens,
      moveScreen,
      moveChapter,
      moveAloneScreenToChapter,
      moveScreenFromChapter
    }) => () => {
      if (draggedScreen && targetLocationCard) {
        const originScreen =
          screens[draggedScreen.rowNum][draggedScreen.colNum];
        const targetRow = screens[targetLocationCard.rowNum];
        if (
          originScreen.type !== "INTRO" &&
          !get(originScreen, "aloneScreen") &&
          draggedScreen.colNum > 0 &&
          targetLocationCard.colNum > 0
        ) {
          moveScreen(
            draggedScreen.rowNum,
            draggedScreen.colNum,
            targetLocationCard.rowNum,
            targetLocationCard.colNum > draggedScreen.colNum &&
              targetRow.length > targetLocationCard.colNum &&
              draggedScreen.rowNum === targetLocationCard.rowNum
              ? targetLocationCard.colNum - 1
              : targetLocationCard.colNum
          );
        } else if (
          ((originScreen.type !== "INTRO" &&
            get(originScreen, "aloneScreen")) ||
            originScreen.type === "INTRO") &&
          draggedScreen.colNum === 0 &&
          targetLocationCard.colNum === 0
        ) {
          moveChapter(
            draggedScreen.rowNum,
            targetLocationCard.rowNum > draggedScreen.rowNum
              ? targetLocationCard.rowNum - 1
              : targetLocationCard.rowNum
          );
        } else if (
          originScreen.type !== "INTRO" &&
          get(originScreen, "aloneScreen") &&
          draggedScreen.colNum === 0 &&
          targetLocationCard.colNum > 0
        ) {
          moveAloneScreenToChapter(
            draggedScreen.rowNum,
            targetLocationCard.rowNum,
            targetLocationCard.colNum
          );
        } else if (
          originScreen.type !== "INTRO" &&
          draggedScreen.colNum > 0 &&
          targetLocationCard.colNum === 0
        ) {
          moveScreenFromChapter(
            draggedScreen.rowNum,
            draggedScreen.colNum,
            targetLocationCard.rowNum
          );
        }
      }
    }
  }),
  withHandlers({
    onMouseMove: ({
      dragAndDropData: { draggedScreen, mouseDown },
      updateDragAndDropData,
      resetDragAndDropData,
      checkIfInsideCard,
      updateOnDraggedScreenMove
    }) => e => {
      const currentDraggedScreen = checkIfInsideCard(e.clientX, e.clientY);
      if (draggedScreen && !mouseDown) {
        if (
          get(draggedScreen, "rowNum") ===
            get(currentDraggedScreen, "rowNum") &&
          get(draggedScreen, "colNum") === get(currentDraggedScreen, "colNum")
        ) {
          updateDragAndDropData({ draggedScreen: currentDraggedScreen });
        } else {
          resetDragAndDropData();
        }
      } else if (draggedScreen) {
        updateOnDraggedScreenMove(e.clientX, e.clientY);
      }
    },
    onMouseDown: ({
      setMouseDownTimeout,
      updateDragAndDropData,
      checkIfInsideCard,
      onMouseDownTimeout
    }) => e => {
      const draggedScreen = checkIfInsideCard(e.clientX, e.clientY);
      if (draggedScreen) {
        updateDragAndDropData({ draggedScreen });
        setMouseDownTimeout(setTimeout(onMouseDownTimeout, 300));
      }
    },
    onMouseUp: ({ onDraggingEnd, updateStructure }) => () => {
      updateStructure();
      onDraggingEnd();
    },
    onMouseLeave: ({ onDraggingEnd }) => () => {
      onDraggingEnd();
    }
  }),
  lifecycle({
    componentWillUnmount() {
      const { mouseDownTimeout } = this.props;

      clearTimeout(mouseDownTimeout);
    }
  }),
  withProps(
    ({
      component: Component,
      onClickEnabled,
      dragAndDropData: { mouseDown, draggedScreen, targetLocationCard }
    }) => ({
      children: (
        <Component
          onClickEnabled={onClickEnabled}
          draggedScreen={mouseDown ? draggedScreen : null}
          targetLocationCard={targetLocationCard}
        />
      )
    })
  )
)(Draggable);
