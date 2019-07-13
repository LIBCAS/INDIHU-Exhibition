import React from "react";
import { connect } from "react-redux";
import FontIcon from "react-md/lib/FontIcons";
import { swapSections, swapScreens } from "../../../actions/expoActions";

const ScreenCardMenu = ({
  rows,
  cols,
  rowNum,
  colNum,
  swapSections,
  swapScreens
}) => (
  <div className="card-actions">
    {colNum === 0 ? (
      <div>
        <FontIcon
          disabled={rowNum === 0}
          onClick={() => rowNum !== 0 && swapSections(rowNum - 1, rowNum)}
        >
          keyboard_arrow_up
        </FontIcon>
        <FontIcon
          disabled={rowNum === rows - 1}
          onClick={() =>
            rowNum !== rows - 1 && swapSections(rowNum, rowNum + 1)
          }
        >
          keyboard_arrow_down
        </FontIcon>
      </div>
    ) : (
      <div>
        <FontIcon
          disabled={colNum === 1}
          onClick={() =>
            colNum !== 1 && swapScreens(rowNum, colNum - 1, colNum)
          }
        >
          keyboard_arrow_left
        </FontIcon>
        <FontIcon
          disabled={colNum === cols - 1}
          onClick={() =>
            colNum !== cols - 1 && swapScreens(rowNum, colNum, colNum + 1)
          }
        >
          keyboard_arrow_right
        </FontIcon>
      </div>
    )}
  </div>
);

export default connect(
  null,
  { swapSections, swapScreens }
)(ScreenCardMenu);
