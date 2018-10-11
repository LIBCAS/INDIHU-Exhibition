import React from "react";
import classNames from "classnames";
import { withRouter } from "react-router-dom";
import { compose, lifecycle, withState } from "recompose";
import { connect } from "react-redux";
import { get } from "lodash";

import { animationType } from "../../enums/animationType";

const ViewChapter = ({ title, subTitle }) => {
  return (
    <div className="viewer-screen">
      <div
        id="view-chapter-image-container"
        className="image-fullscreen-wrap"
      />
      <div className="title-container">
        <p className="title-fullscreen">
          {title}
        </p>
        <p className="subtitle-fullscreen">
          {subTitle}
        </p>
      </div>
    </div>
  );
};

export default compose(
  withRouter,
  connect(({ expo: { viewScreen } }) => ({ viewScreen }), null),
  withState("title", "setTitle", ""),
  withState("subTitle", "setSubTitle", ""),
  withState("titleTimeout", "setTitleTimeout", null),
  withState("subTitleTimeout", "setSubTitleTimeout", null),
  lifecycle({
    componentDidMount() {
      const {
        screenFiles,
        viewScreen,
        setTitle,
        setSubTitle,
        setTitleTimeout,
        setSubTitleTimeout
      } = this.props;

      if (screenFiles["image"]) {
        const newNode = screenFiles["image"];

        newNode.className = classNames("image-fullscreen", {
          "animation-slideDown":
            viewScreen.animationType &&
            viewScreen.animationType === animationType.FROM_TOP,
          "animation-slideUp":
            viewScreen.animationType &&
            viewScreen.animationType === animationType.FROM_BOTTOM
        });
        newNode.setAttribute(
          "style",
          `animation-duration: ${viewScreen.time && viewScreen.time > 0
            ? viewScreen.time
            : "20"}s`
        );
        document
          .getElementById("view-chapter-image-container")
          .appendChild(newNode);
      }

      if (get(viewScreen, "title")) {
        const titleTyping = title => {
          let add = "";
          if (
            get(
              viewScreen.title.replace(new RegExp("^" + title), ""),
              "[0]",
              ""
            ).match(/\s/)
          ) {
            while (
              get(
                viewScreen.title.replace(new RegExp("^" + title + add), ""),
                "[0]",
                ""
              ).match(/\s/)
            ) {
              add += get(
                viewScreen.title.replace(new RegExp("^" + title + add), ""),
                "[0]",
                ""
              );
            }
            add += get(
              viewScreen.title.replace(new RegExp("^" + title + add), ""),
              "[0]",
              ""
            );
          } else {
            add = get(
              viewScreen.title.replace(new RegExp("^" + title), ""),
              "[0]",
              ""
            );
          }
          const newTitle = title + add;
          setTitle(newTitle);
          if (newTitle !== title) {
            setTitleTimeout(setTimeout(() => titleTyping(newTitle), 100));
          }
        };

        setTitleTimeout(setTimeout(() => titleTyping(""), 100));
      }

      if (get(viewScreen, "subTitle")) {
        const subTitleTyping = subTitle => {
          let add = "";
          if (
            get(
              viewScreen.subTitle.replace(new RegExp("^" + subTitle), ""),
              "[0]",
              ""
            ).match(/\s/)
          ) {
            while (
              get(
                viewScreen.subTitle.replace(
                  new RegExp("^" + subTitle + add),
                  ""
                ),
                "[0]",
                ""
              ).match(/\s/)
            ) {
              add += get(
                viewScreen.subTitle.replace(
                  new RegExp("^" + subTitle + add),
                  ""
                ),
                "[0]",
                ""
              );
            }
            add += get(
              viewScreen.subTitle.replace(new RegExp("^" + subTitle + add), ""),
              "[0]",
              ""
            );
          } else {
            add = get(
              viewScreen.subTitle.replace(new RegExp("^" + subTitle), ""),
              "[0]",
              ""
            );
          }
          const newSubTitle = subTitle + add;
          setSubTitle(newSubTitle);
          if (newSubTitle !== subTitle) {
            setSubTitleTimeout(
              setTimeout(() => subTitleTyping(newSubTitle), 100)
            );
          }
        };

        setSubTitleTimeout(
          setTimeout(
            () => subTitleTyping(""),
            viewScreen.title.length * 100 + 1000
          )
        );
      }
    },
    componentWillUnmount() {
      const { titleTimeout, subtitleTimeout } = this.props;

      clearTimeout(titleTimeout);
      clearTimeout(subtitleTimeout);
    }
  })
)(ViewChapter);
