import React from "react";
import { isNumber } from "lodash";

const Progress = ({ percent, text }) => (
  <div className="async-loader">
    <div className="background progress-bar-background">
      <div className="progress-bar">
        <div className="loader-container">
          <div className="loader" />
          {isNumber(percent) ? (
            <p className="text percent-text">{Math.round(percent)}%</p>
          ) : (
            <div />
          )}
        </div>
        {text && <p className="text">{text}</p>}
      </div>
    </div>
  </div>
);

export default Progress;
