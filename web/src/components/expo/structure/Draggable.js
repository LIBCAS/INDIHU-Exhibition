import React from "react";

const Draggable = ({ children }) => {
  let curYPos, curXPos, curDown;
  return (
    <div
      className="container-modeller structure"
      onMouseMove={e => {
        if (curDown) {
          window.scrollTo(
            window.pageXOffset + (curXPos - e.pageX),
            window.pageYOffset + (curYPos - e.pageY)
          );
        }
      }}
      onMouseDown={e => {
        curYPos = e.pageY;
        curXPos = e.pageX;
        curDown = true;
      }}
      onMouseUp={e => {
        curDown = false;
      }}
    >
      {children}
    </div>
  );
};

export default Draggable;
