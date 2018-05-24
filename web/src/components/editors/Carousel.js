import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { map, isEmpty, get } from "lodash";
import { compose } from "recompose";
import { Card, CardText, FontIcon } from "react-md";

import Carousel from "../Carousel";

import { getFileById } from "../../actions/fileActions";

const CarouselContainer = ({
  images,
  activeImageIndex,
  onClickCard,
  onClickLeft,
  onClickRight,
  onDelete,
  onAdd,
  getFileById
}) =>
  <div className="carousel-container">
    <Carousel>
      {map(images, (c, i) =>
        <Card
          raise
          className={classNames("carousel-card", {
            active: i === activeImageIndex
          })}
          key={i}
          onClick={() => onClickCard(i)}
        >
          <CardText className="carousel-card-text">
            <div className="carousel-card-text-image">
              {((c !== null && getFileById(c)) ||
                (!isEmpty(c) && get(c, "id") && getFileById(get(c, "id")))) &&
                <img
                  src={`/api/files/${getFileById(
                    get(c, "id") ? get(c, "id") : c
                  ).fileId}`}
                  alt="img"
                />}
            </div>
            {i === activeImageIndex &&
              (activeImageIndex > 0
                ? <FontIcon
                    className="icon-left"
                    onClick={e => {
                      e.stopPropagation();
                      onClickLeft(i);
                    }}
                  >
                    keyboard_arrow_left
                  </FontIcon>
                : <div className="icon-placeholder" />)}
            {i === activeImageIndex &&
              (activeImageIndex < images.length - 1
                ? <FontIcon
                    className="icon-middle"
                    onClick={e => {
                      e.stopPropagation();
                      onClickRight(i);
                    }}
                  >
                    keyboard_arrow_right
                  </FontIcon>
                : <div className="icon-placeholder" />)}
            {i === activeImageIndex &&
              <FontIcon
                className="icon-right"
                onClick={e => {
                  e.stopPropagation();
                  onDelete(i);
                }}
              >
                delete
              </FontIcon>}
          </CardText>
        </Card>
      )}
      <Card raise className="carousel-card" onClick={() => onAdd()}>
        <CardText className="card-text">
          <FontIcon className="card-icon">add</FontIcon>
        </CardText>
      </Card>
    </Carousel>
  </div>;

export default compose(connect(null, { getFileById }))(CarouselContainer);
