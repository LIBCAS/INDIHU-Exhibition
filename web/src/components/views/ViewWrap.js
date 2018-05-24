import React from "react";

const ViewWrap = ({ institution, title, children }) => {
  return (
    <div className="viewer">
      <div className="viewer-title">
        <div className="viewer-title-institution">
          {institution}
        </div>
        <div className="viewer-title-name">
          {title}
        </div>
        <div />
      </div>
      {children}
    </div>
  );
};

export default ViewWrap;
