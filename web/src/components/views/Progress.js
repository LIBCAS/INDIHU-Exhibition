import React from "react";
import { Line } from "rc-progress";

const Progress = ({ percent }) => (
  <div className="viewer-progress-bar">
    <Line
      {...{
        percent,
        strokeColor: "#444444",
        strokeWidth: 3,
        trailWidth: 3
      }}
    />
  </div>
);

export default Progress;
