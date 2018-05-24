/* DRAGGABLE STRUCTURE */

// import React from "react";
// import { connect } from "react-redux";
// import { map, get, forEach } from "lodash";

// import ScreenCard from "./ScreenCard";
// import ScreenNew from "./ScreenNew";
// import ScreenStartFinish from "./ScreenStartFinish";

// import { cardPressed } from "../../../actions/expoActions";
// import { mouseActualize } from "../../../actions/appActions";

// const Structure = ({
// activeExpo,
// activeCard,
// cardPressed,
// mouseDown,
// mouseXPos,
// mouseYPos,
// mouseActualize
// }) => {
// const screens = get(activeExpo, "structure.screens");

// return (
// <div
//     className="container container-modeller structure"
//     style={{ width: "100hh", cursor: "move" }}
//     onMouseMove={e => {
//     // console.log(mouseDown);
//     mouseActualize(mouseDown, e.pageX, e.pageY);
//     if (mouseDown) {
//         window.scrollTo(
//         e.pageX - window.innerWidth / 2 < 0
//             ? 0
//             : e.pageX - window.innerWidth / 2,
//         e.pageY - window.innerHeight / 2 < 0
//             ? 0
//             : e.pageY - window.innerHeight / 2
//         );
//     }
//     }}
//     onMouseDown={e => {
//     mouseActualize(true, e.pageX, e.pageY);
//     }}
//     onMouseUp={e => {
//     // console.log(document.getElementById(`card-${activeRow}-${activeCol}`).getBoundingClientRect());
//     if (activeCard) {
//         forEach(screens, (structRow, rowNum) =>
//         forEach(structRow, (structCol, colNum) => {
//             if (
//             activeCard.rowNum !== rowNum ||
//             activeCard.colNum !== colNum
//             ) {
//             const boundary = document
//                 .getElementById(`card-${rowNum}-${colNum}`)
//                 .getBoundingClientRect();
//             }
//         })
//         );
//     }
//     mouseActualize(false, null, null);
//     cardPressed(null);
//     }}
//     onMouseLeave={e => {
//     mouseActualize(false, null, null);
//     cardPressed(null);
//     }}
// >
//     {activeCard &&
//     <ScreenCard
//         positionX={mouseXPos + activeCard.correlationX}
//         positionY={mouseYPos + activeCard.correlationY}
//         rows={activeCard.rows}
//         cols={activeCard.col}
//         rowNum={activeCard.rowNum}
//         colNum={activeCard.colNum}
//         data={activeCard.data}
//     />}
//     {screens &&
//     <div className="structure-col">
//         <div className="col-line" />
//         <ScreenStartFinish type="start" />

//         {map(screens, (structRow, rowNum) =>
//         <div key={`row${rowNum}`} className="structure-col">
//             <ScreenNew add section rowNum={rowNum} />
//             <div className="structure-row">
//             {map(structRow, (structCol, colNum) =>
//                 <div key={`col${colNum}`} className="structure-row">
//                 {colNum > 0 &&
//                     <ScreenNew add rowNum={rowNum} colNum={colNum} />}
//                 {activeCard &&
//                 activeCard.rowNum === rowNum &&
//                 activeCard.colNum === colNum
//                     ? <div className="card-empty" />
//                     : <div
//                         id={`card-${rowNum}-${colNum}`}
//                         onMouseDown={e => {
//                         cardPressed(
//                             {
//                             rowNum,
//                             colNum,
//                             rows: screens.length,
//                             cols: structRow.length,
//                             data: structCol,
//                             boundary: document
//                                 .getElementById(`card-${rowNum}-${colNum}`)
//                                 .getBoundingClientRect()
//                             },
//                             mouseXPos,
//                             mouseYPos
//                         );
//                         }}
//                     >
//                         <ScreenCard
//                         rows={screens.length}
//                         cols={structRow.length}
//                         rowNum={rowNum}
//                         colNum={colNum}
//                         data={structCol}
//                         />
//                     </div>}
//                 <div className="row-line" />
//                 </div>
//             )}
//             <ScreenNew rowNum={rowNum} />
//             </div>
//         </div>
//         )}

//         <ScreenNew section />
//         <ScreenStartFinish type="finish" />
//     </div>}
// </div>
// );
// };

// export default connect(
// ({
// app: { mouseInfo: { mouseDown, mouseXPos, mouseYPos } },
// expo: { activeCard }
// }) => ({ mouseDown, mouseXPos, mouseYPos, activeCard }),
// {
// cardPressed,
// mouseActualize
// }
// )(Structure);


// export const mouseActualize = (mouseDown, mouseXPos, mouseYPos) => ({
// type: MOUSE_ACTUALIZE,
// payload: {
//     mouseInfo: { mouseDown, mouseXPos, mouseYPos }
// }
// });


// export const cardPressed = (
// activeCard,
// mouseXPos,
// mouseYPos
// ) => async dispatch => {
// console.log(activeCard, mouseXPos, mouseYPos);
// dispatch({
//     type: EXPO_PRESSED_CARD_SET,
//     payload: activeCard
//     ? {
//         activeCard: {
//             ...activeCard,
//             correlationX: activeCard.boundary.left - mouseXPos,
//             correlationY: activeCard.boundary.top - mouseYPos
//         }
//         }
//     : { activeCard: null }
// });
// };


// import React from "react";
// import classNames from "classnames";
// import Card from "react-md/lib/Cards/Card";
// import CardText from "react-md/lib/Cards/CardText";

// import ScreenCardMenu from "./ScreenCardMenu";
// import ScreenCardActions from "./ScreenCardActions";
// import { screenTypeText } from "../../../enums/screenType";

// const ScreenCard = ({
//   rows,
//   cols,
//   rowNum,
//   colNum,
//   data,
//   positionX,
//   positionY
// }) => {
//   const header = `${rowNum + 1}${colNum > 0
//     ? `.${colNum} `
//     : " "}${screenTypeText[data.type]}`;

//   return (
//     <Card
//       raise
//       className={classNames("card", {
//         "card-not-moving": positionX === undefined
//       })}
//       style={
//         positionX !== undefined && positionY !== undefined
//           ? {
//               position: "absolute",
//               top: positionY,
//               left: positionX,
//               zIndex: 10000
//             }
//           : undefined
//       }
//     >
//       <ScreenCardMenu
//         name={header}
//         type={data.type}
//         rowNum={rowNum}
//         colNum={colNum}
//       />
//       <CardText className="card-screen">
//         <p>
//           {header}
//         </p>
//         <p>
//           {data.name || ""}
//         </p>
//       </CardText>
//       <ScreenCardActions
//         rows={rows}
//         cols={cols}
//         rowNum={rowNum}
//         colNum={colNum}
//       />
//     </Card>
//   );
// };

// export default ScreenCard;


// .card {
//     &-not-moving {
//       position: relative;
//     }
//   }
  
//   .start,
//   .finish {
//     position: relative;
//   }