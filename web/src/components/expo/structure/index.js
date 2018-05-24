import React from "react";
import classNames from "classnames";
import { map, get, isEmpty } from "lodash";

import Draggable from "./Draggable";
import ScreenCard from "./ScreenCard";
import ScreenNew from "./ScreenNew";
import ScreenStartFinish from "./ScreenStartFinish";

import { screenType } from "../../../enums/screenType";

const Structure = ({ activeExpo }) => {
  const screens = get(activeExpo, "structure.screens");

  return (
    <Draggable>
      {screens &&
        <div className="structure-col">
          <div className="col-line" />
          <ScreenStartFinish type="start" activeExpo={activeExpo} />

          {map(screens, (structRow, rowNum) =>
            <div key={`row${rowNum}`} className="structure-col">
              <ScreenNew section rowNum={rowNum} />
              <div className="structure-row">
                {map(structRow, (structCol, colNum) =>
                  <div key={`col${colNum}`} className="structure-row">
                    {colNum > 0 &&
                      <ScreenNew rowNum={rowNum} colNum={colNum} />}
                    <ScreenCard
                      rows={screens.length}
                      cols={structRow.length}
                      rowNum={rowNum}
                      colNum={colNum}
                      data={structCol}
                      isFilled={structCol.screenCompleted}
                    />
                    {(structRow[0].type === screenType.INTRO ||
                      !structRow[0].aloneScreen) &&
                      <div
                        className={classNames("row-line", {
                          last: structRow.length === colNum + 1
                        })}
                      />}
                  </div>
                )}
                {(structRow[0].type === screenType.INTRO ||
                  !structRow[0].aloneScreen) &&
                  <ScreenNew rowNum={rowNum} />}
              </div>
            </div>
          )}

          <ScreenNew large={isEmpty(screens)} section />
          <ScreenStartFinish type="finish" activeExpo={activeExpo} />
        </div>}
    </Draggable>
  );
};

export default Structure;
