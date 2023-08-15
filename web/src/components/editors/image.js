import { connect } from "react-redux";
import { compose, withState, withHandlers } from "recompose";
import { map, set, isEmpty, find } from "lodash";
import classNames from "classnames";
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import Button from "react-md/lib/Buttons/Button";
import FontIcon from "react-md/lib/FontIcons";
import { Tooltip as ReactTooltip } from "react-tooltip";

import HelpIcon from "../help-icon";
import InfopointIcon from "../infopoint-icon";

import { setDialog } from "../../actions/dialog-actions";
import { mouseActualize, showLoader } from "../../actions/app-actions";

import { helpIconText } from "../../enums/text";

const infopointWidth = 34;

const Image = ({
  updateScreenData,
  zoomActualize,
  zoom,
  defaultZoom,
  image,
  imageWidth,
  imageHeight,
  onDelete,
  title,
  infopoints,
  sequences,
  images,
  image1Infopoints,
  image2Infopoints,
  mouseDown,
  mouseXPos,
  mouseYPos,
  correlationX,
  correlationY,
  mouseActualize,
  activePoint,
  dragStyle,
  setDragStyle,
  dragProps,
  setDragProps,
  initVariables,
  changeImage,
  id,
  helpIconLabel,
  setDialog,
}) => {
  return (
    // Flex row with two items, whole box and just help icon
    <div className="flex-row-nowrap">
      {/* Flex col with three items: title, image card and settings panel */}
      <div
        className={classNames("flex-col card-image-container", {
          img: !!image,
          "img-none": !image,
        })}
      >
        {/* 1.) Title */}
        <div>{title}</div>

        {/* 2.) Card */}
        <Card
          className={classNames("card-image", {
            img: !!image,
            "img-none": !image,
          })}
        >
          {/* 2a) Card with image */}
          {image && (
            <div
              id={
                image2Infopoints
                  ? `screen-image-infopoints-second`
                  : "screen-image-infopoints"
              }
              className="image-infopoints-container"
              draggable="false"
              style={{ cursor: "move", position: "absolute", ...dragStyle }}
              onMouseDown={(e) => {
                if (e.target.tagName === "IMG") {
                  setDragProps([
                    parseInt(dragStyle.left, 10) || 0,
                    parseInt(dragStyle.top, 10) || 0,
                    e.pageX,
                    e.pageY,
                    true,
                  ]);
                }
              }}
              onMouseMove={(e) => {
                if (dragProps[4]) {
                  setDragStyle({
                    left: `${dragProps[0] - (dragProps[2] - e.pageX)}px`,
                    top: `${dragProps[1] - (dragProps[3] - e.pageY)}px`,
                  });
                }
                if (
                  (infopoints ||
                    sequences ||
                    images ||
                    image1Infopoints ||
                    image2Infopoints) &&
                  mouseDown
                )
                  mouseActualize({
                    mouseDown: true,
                    mouseXPos: e.pageX,
                    mouseYPos: e.pageY,
                  });
              }}
              onMouseUp={(e) => {
                setDragProps([0, 0, null, null, false]);

                if (
                  infopoints ||
                  sequences ||
                  images ||
                  image1Infopoints ||
                  image2Infopoints
                ) {
                  const boundary = document
                    .getElementById(
                      image2Infopoints
                        ? `screen-image-infopoints-second`
                        : "screen-image-infopoints"
                    )
                    .getBoundingClientRect();
                  updateScreenData(
                    infopoints || sequences
                      ? set(
                          {},
                          infopoints ? "infopoints" : "sequences",
                          map(infopoints ? infopoints : sequences, (item) =>
                            item.move
                              ? {
                                  ...item,
                                  left:
                                    (e.pageX - boundary.left + correlationX) /
                                    zoom,
                                  top:
                                    (e.pageY - boundary.top + correlationY) /
                                    zoom,
                                  move: false,
                                }
                              : item
                          )
                        )
                      : image1Infopoints || image2Infopoints
                      ? set(
                          {},
                          image1Infopoints
                            ? "image1Infopoints"
                            : "image2Infopoints",
                          map(
                            image1Infopoints
                              ? image1Infopoints
                              : image2Infopoints,
                            (infopoint) =>
                              infopoint.move
                                ? {
                                    ...infopoint,
                                    left:
                                      (e.pageX - boundary.left + correlationX) /
                                      zoom,
                                    top:
                                      (e.pageY - boundary.top + correlationY) /
                                      zoom,
                                    move: false,
                                  }
                                : infopoint
                          )
                        )
                      : {
                          images: map(images, (image) =>
                            image.active
                              ? {
                                  ...image,
                                  infopoints: map(
                                    image.infopoints,
                                    (infopoint) =>
                                      infopoint.move
                                        ? {
                                            ...infopoint,
                                            left:
                                              (e.pageX -
                                                boundary.left +
                                                correlationX) /
                                              zoom,
                                            top:
                                              (e.pageY -
                                                boundary.top +
                                                correlationY) /
                                              zoom,
                                            move: false,
                                          }
                                        : infopoint
                                  ),
                                }
                              : image
                          ),
                        }
                  );
                  mouseActualize({ mouseDown: false });
                }
              }}
            >
              {/* IMAGE */}
              {imageWidth && imageHeight ? (
                <img
                  src={`/api/files/${image.fileId}`}
                  width={imageWidth * zoom}
                  height={imageHeight * zoom}
                  alt="img"
                  draggable="false"
                />
              ) : (
                <img
                  src={`/api/files/${image.fileId}`}
                  onLoad={({ target }) => {
                    initVariables(target);
                  }}
                  alt="img"
                  draggable="false"
                />
              )}

              {/* INFOPOINTS */}
              {(infopoints ||
                sequences ||
                image1Infopoints ||
                image2Infopoints ||
                (images &&
                  !isEmpty(find(images, (img) => img.active)) &&
                  find(images, (img) => img.active).infopoints)) &&
                document.getElementById(
                  image2Infopoints
                    ? `screen-image-infopoints-second`
                    : "screen-image-infopoints"
                ) &&
                map(
                  infopoints
                    ? infopoints
                    : sequences
                    ? sequences
                    : image1Infopoints
                    ? image1Infopoints
                    : image2Infopoints
                    ? image2Infopoints
                    : find(images, (img) => img.active).infopoints,
                  (item, i) =>
                    item.move ? (
                      <InfopointIcon
                        key={i}
                        className="infopoint-icon"
                        style={{
                          position: "absolute",
                          left:
                            mouseXPos -
                            document
                              .getElementById(
                                image2Infopoints
                                  ? `screen-image-infopoints-second`
                                  : "screen-image-infopoints"
                              )
                              .getBoundingClientRect().left +
                            correlationX -
                            infopointWidth / 2,
                          top:
                            mouseYPos -
                            document
                              .getElementById(
                                image2Infopoints
                                  ? `screen-image-infopoints-second`
                                  : "screen-image-infopoints"
                              )
                              .getBoundingClientRect().top +
                            correlationY -
                            infopointWidth / 2,
                        }}
                      />
                    ) : (
                      <div key={i}>
                        <InfopointIcon
                          id={
                            image2Infopoints
                              ? `screen-image-infopoint-1-${i}`
                              : `screen-image-infopoint-${i}`
                          }
                          className="infopoint-icon"
                          style={{
                            position: "absolute",
                            top: item.top * zoom - infopointWidth / 2,
                            left: item.left * zoom - infopointWidth / 2,
                            animation:
                              activePoint === i &&
                              "infopoint-pulse 2s infinite",
                          }}
                          onMouseDown={(e) => {
                            const boundary = document
                              .getElementById(
                                image2Infopoints
                                  ? `screen-image-infopoint-1-${i}`
                                  : `screen-image-infopoint-${i}`
                              )
                              .getBoundingClientRect();

                            mouseActualize({
                              mouseDown: true,
                              mouseXPos: e.pageX,
                              mouseYPos: e.pageY,
                              correlationX:
                                boundary.left + infopointWidth / 2 - e.pageX,
                              correlationY:
                                boundary.top + infopointWidth / 2 - e.pageY,
                            });
                            updateScreenData(
                              infopoints || sequences
                                ? set(
                                    {},
                                    infopoints ? "infopoints" : "sequences",
                                    map(
                                      infopoints ? infopoints : sequences,
                                      (infopoint, idx) =>
                                        i === idx
                                          ? { ...infopoint, move: true }
                                          : infopoint
                                    )
                                  )
                                : image1Infopoints || image2Infopoints
                                ? set(
                                    {},
                                    image1Infopoints
                                      ? "image1Infopoints"
                                      : "image2Infopoints",
                                    map(
                                      image1Infopoints
                                        ? image1Infopoints
                                        : image2Infopoints,
                                      (infopoint, infopointIndex) =>
                                        infopointIndex === i
                                          ? { ...infopoint, move: true }
                                          : infopoint
                                    )
                                  )
                                : {
                                    images: map(images, (image) =>
                                      image.active
                                        ? {
                                            ...image,
                                            infopoints: map(
                                              image.infopoints,
                                              (infopoint, idx) =>
                                                i === idx
                                                  ? {
                                                      ...infopoint,
                                                      move: true,
                                                    }
                                                  : {
                                                      ...infopoint,
                                                      move: false,
                                                    }
                                            ),
                                          }
                                        : image
                                    ),
                                  }
                            );
                          }}
                          data-tooltip-id={
                            infopoints
                              ? "infopoints-tooltip"
                              : sequences
                              ? "sequences-tooltip"
                              : image1Infopoints
                              ? "image1Infopoints-tooltip"
                              : image2Infopoints
                              ? "image2Infopoints-tooltip"
                              : "slideshow-tooltip"
                          }
                          data-tooltip-content={item.text}
                        />
                        <ReactTooltip
                          id={
                            infopoints
                              ? "infopoints-tooltip"
                              : sequences
                              ? "sequences-tooltip"
                              : image1Infopoints
                              ? "image1Infopoints-tooltip"
                              : image2Infopoints
                              ? "image2Infopoints-tooltip"
                              : "slideshow-tooltip"
                          }
                          className="infopoint-tooltip"
                          variant="dark"
                          float={false}
                        />
                      </div>
                    )
                )}
            </div>
          )}

          {/* 2b) Card without image, NO IMAGE */}
          {!image && (
            <CardText className="flex-col flex-centered full-height">
              <FontIcon className="card-image-icon-placeholder">image</FontIcon>
              <div className="flex flex-centered">
                <Button raised label="Vybrat" onClick={() => changeImage()} />
              </div>
            </CardText>
          )}
        </Card>

        {/* 3.) SETTINGS, below the card */}
        {image && (
          <div className="flex-row flex-space-between">
            <div>
              <FontIcon
                className="icon"
                onClick={() =>
                  zoom < defaultZoom + (5 * defaultZoom) / 3 &&
                  zoomActualize(zoom + defaultZoom / 3)
                }
              >
                zoom_in
              </FontIcon>
              <FontIcon
                className="icon"
                onClick={() => {
                  zoomActualize(defaultZoom);
                  setDragStyle({ left: "0px", top: "0px" });
                }}
              >
                search
              </FontIcon>
              <FontIcon
                className="icon"
                onClick={() =>
                  zoom > defaultZoom && zoomActualize(zoom - defaultZoom / 3)
                }
              >
                zoom_out
              </FontIcon>
            </div>
            <div>
              <FontIcon className="icon" onClick={() => changeImage()}>
                mode_edit
              </FontIcon>
              <FontIcon
                className="icon"
                onClick={() =>
                  !!onDelete &&
                  setDialog("ConfirmDialog", {
                    title: <FontIcon className="color-black">delete</FontIcon>,
                    text: "Opravdu chcete odstranit obrázek?",
                    onSubmit: () => onDelete(),
                  })
                }
              >
                delete
              </FontIcon>
            </div>
          </div>
        )}
      </div>

      <HelpIcon label={helpIconLabel || helpIconText.EDITOR_IMAGE} id={id} />
    </div>
  );
};

export default compose(
  connect(
    ({
      app: {
        mouseInfo: {
          mouseDown,
          mouseXPos,
          mouseYPos,
          correlationX,
          correlationY,
        },
      },
    }) => ({
      mouseDown,
      mouseXPos,
      mouseYPos,
      correlationX,
      correlationY,
    }),
    { setDialog, mouseActualize, showLoader }
  ),
  withState("imageWidth", "setImageWidth", 0),
  withState("imageHeight", "setImageHeight", 0),
  withState("defaultZoom", "setDefaultZoom", 1),
  withState("zoom", "zoomActualize", 1),
  withState("dragStyle", "setDragStyle", {}),
  // [old style left, old style top, onStart offset x, onStart offset y, is mouse down]
  withState("dragProps", "setDragProps", [0, 0, null, null, false]),
  withHandlers({
    changeImage:
      ({
        setDialog,
        setImage,
        setImageWidth,
        setImageHeight,
        setDragStyle,
        showLoader,
      }) =>
      () => {
        setDialog("ScreenFileChoose", {
          onChoose: (img) => {
            showLoader(true);
            setImage(img);
            setImageWidth(0);
            setImageHeight(0);
          },
          typeMatch: new RegExp(/^image\/.*$/),
          accept: "image/*",
        });
        setDragStyle({ left: "0px", top: "0px" });
      },
    initVariables:
      ({
        onLoad,
        setImageWidth,
        setImageHeight,
        setDefaultZoom,
        zoomActualize,
        showLoader,
      }) =>
      (img) => {
        const cardWidth = 450;
        const cardHeight = 350;

        const imgWidth = img.width;
        const imgHeight = img.height;

        setImageWidth(imgWidth);
        setImageHeight(imgHeight);

        if (onLoad) {
          onLoad(imgWidth, imgHeight);
        }

        let zoom;
        if (imgWidth > imgHeight) {
          zoom = cardWidth / imgWidth;
        } else {
          zoom = cardHeight / imgHeight;
        }

        setDefaultZoom(zoom);
        zoomActualize(zoom);
        showLoader(false);
      },
  })
)(Image);
