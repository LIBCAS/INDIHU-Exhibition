import classNames from "classnames";
import { map, get, isEmpty } from "lodash";
import ReactTooltip from "react-tooltip";

import Draggable from "./draggable";
import ScreenCard from "./screen-card";
import ScreenNew from "./screen-new";
import ScreenDraggedCardTargetLocation from "./screen-dragged-card-target-location";
import ScreenStartFinish from "./screen-start-finish";

import { screenType } from "../../../enums/screen-type";

const Structure = ({ activeExpo }) => {
  const screens = get(activeExpo, "structure.screens");

  return (
    <Draggable
      screens={screens}
      component={({ onClickEnabled, draggedScreen, targetLocationCard }) => (
        <div>
          {screens && (
            <div className="structure-col">
              <div className="col-line" />
              <ScreenStartFinish type="start" activeExpo={activeExpo} />

              {map(screens, (structRow, rowNum) => (
                <div key={`row${rowNum}`} className="structure-col">
                  <ScreenNew section rowNum={rowNum} />
                  {draggedScreen &&
                    (draggedScreen.colNum > 0 ||
                      draggedScreen.rowNum !== rowNum) &&
                    targetLocationCard &&
                    targetLocationCard.rowNum === rowNum &&
                    targetLocationCard.colNum === 0 && (
                      <ScreenDraggedCardTargetLocation col={true} />
                    )}
                  <div className="structure-row">
                    {map(structRow, (structCol, colNum) => (
                      <div key={`col${colNum}`} className="structure-row">
                        {colNum > 0 && (
                          <ScreenNew rowNum={rowNum} colNum={colNum} />
                        )}
                        {colNum > 0 &&
                          draggedScreen &&
                          (draggedScreen.rowNum !== rowNum ||
                            (draggedScreen.colNum !== colNum &&
                              draggedScreen.colNum + 1 !== colNum)) &&
                          targetLocationCard &&
                          targetLocationCard.rowNum === rowNum &&
                          targetLocationCard.colNum === colNum && (
                            <ScreenDraggedCardTargetLocation />
                          )}
                        <ScreenCard
                          rows={screens.length}
                          cols={structRow.length}
                          rowNum={rowNum}
                          colNum={colNum}
                          data={structCol}
                          isFilled={structCol.screenCompleted}
                          menuPosition={
                            colNum && colNum >= structRow.length - 1
                              ? "tr"
                              : "tl"
                          }
                          onClickEnabled={onClickEnabled}
                          isDragged={
                            draggedScreen &&
                            draggedScreen.rowNum === rowNum &&
                            draggedScreen.colNum === colNum
                          }
                        />
                        {!(
                          draggedScreen &&
                          (draggedScreen.colNum > 0 ||
                            screens[draggedScreen.rowNum][draggedScreen.colNum]
                              .aloneScreen) &&
                          targetLocationCard &&
                          targetLocationCard.rowNum === rowNum &&
                          targetLocationCard.colNum === structRow.length &&
                          colNum === structRow.length - 1
                        ) &&
                          (structRow[0].type === screenType.INTRO ||
                            !structRow[0].aloneScreen) && (
                            <div
                              className={classNames("row-line", {
                                last: structRow.length === colNum + 1,
                              })}
                            />
                          )}
                        {(structRow[0].type === screenType.INTRO ||
                          !structRow[0].aloneScreen) &&
                          draggedScreen &&
                          (draggedScreen.colNum > 0 ||
                            screens[draggedScreen.rowNum][draggedScreen.colNum]
                              .aloneScreen) &&
                          targetLocationCard &&
                          targetLocationCard.rowNum === rowNum &&
                          targetLocationCard.colNum === structRow.length &&
                          colNum === structRow.length - 1 && (
                            <ScreenDraggedCardTargetLocation last={true} />
                          )}
                      </div>
                    ))}
                    {(structRow[0].type === screenType.INTRO ||
                      !structRow[0].aloneScreen) &&
                      !(
                        draggedScreen &&
                        (draggedScreen.colNum > 0 ||
                          screens[draggedScreen.rowNum][draggedScreen.colNum]
                            .aloneScreen) &&
                        targetLocationCard &&
                        targetLocationCard.rowNum === rowNum &&
                        targetLocationCard.colNum === structRow.length
                      ) && (
                        <ScreenNew
                          rowNum={rowNum}
                          position={structRow.length > 1 ? "tr" : "tl"}
                          style={{ marginRight: "1em" }}
                        />
                      )}
                  </div>
                  {draggedScreen &&
                    targetLocationCard &&
                    targetLocationCard.rowNum === screens.length &&
                    rowNum === screens.length - 1 && (
                      <ScreenNew large={isEmpty(screens)} section />
                    )}
                  {draggedScreen &&
                    targetLocationCard &&
                    targetLocationCard.rowNum === screens.length &&
                    rowNum === screens.length - 1 && (
                      <ScreenDraggedCardTargetLocation col={true} />
                    )}
                </div>
              ))}

              <ReactTooltip
                type="dark"
                effect="solid"
                id="expo-structure-screen-new-tooltip"
                place="left"
                className="help-icon-react-tooltip"
              />

              {!(
                draggedScreen &&
                targetLocationCard &&
                targetLocationCard.rowNum === screens.length
              ) && <ScreenNew large={isEmpty(screens)} section />}
              <ScreenStartFinish type="finish" activeExpo={activeExpo} />
            </div>
          )}
        </div>
      )}
    />
  );
};

export default Structure;
