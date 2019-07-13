import React from "react";

const Progress = ({ percent, text }) => (
  <div className="async-loader">
    <div className="background progress-bar-background">
      <div className="progress-bar">
        <div className="loader-container">
          <div className="loader" />
          <p className="text percent-text">{Math.round(percent)}%</p>
        </div>
        {text && <p className="text">{text}</p>}
      </div>
    </div>
  </div>
);

export default Progress;
