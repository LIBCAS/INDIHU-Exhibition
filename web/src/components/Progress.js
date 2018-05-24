import React from "react";
import { Line } from "rc-progress";

const Progress = ({ percent }) =>
  <div className="async-loader">
    <div className="background">
      <div className="progress-bar">
        <Line
          {...{
            percent,
            strokeColor: "#3366cc",
            strokeWidth: 3,
            trailWidth: 3
          }}
        />
      </div>
    </div>
  </div>;

export default Progress;
