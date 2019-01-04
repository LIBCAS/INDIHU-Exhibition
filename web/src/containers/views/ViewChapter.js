import React from "react";
import classNames from "classnames";
import { withRouter } from "react-router-dom";
import { compose, lifecycle, withState, withHandlers } from "recompose";
import { connect } from "react-redux";
import { get, escapeRegExp } from "lodash";

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
  withHandlers({
    getTypingAdd: () => (resultStr, str) => {
      let add = "";
      let escapedAdd = add;
      const escapedStr = escapeRegExp(str);
      if (
        get(
          resultStr.replace(new RegExp("^" + escapedStr), ""),
          "[0]",
          ""
        ).match(/\s/)
      ) {
        while (
          get(
            resultStr.replace(new RegExp("^" + escapedStr + escapedAdd), ""),
            "[0]",
            ""
          ).match(/\s/)
        ) {
          add += get(
            resultStr.replace(new RegExp("^" + escapedStr + escapedAdd), ""),
            "[0]",
            ""
          );
          escapedAdd = escapeRegExp(add);
        }
        add += get(
          resultStr.replace(new RegExp("^" + escapedStr + escapedAdd), ""),
          "[0]",
          ""
        );
        escapedAdd = escapeRegExp(add);
      } else {
        add = get(
          resultStr.replace(new RegExp("^" + escapedStr), ""),
          "[0]",
          ""
        );
      }

      return add;
    }
  }),
  lifecycle({
    componentDidMount() {
      const {
        screenFiles,
        viewScreen,
        setTitle,
        setSubTitle,
        setTitleTimeout,
        setSubTitleTimeout,
        getTypingAdd
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
          const newTitle =
            title + getTypingAdd(get(viewScreen, "title"), title);
          setTitle(newTitle);
          if (newTitle !== title) {
            setTitleTimeout(setTimeout(() => titleTyping(newTitle), 100));
          }
        };

        setTitleTimeout(setTimeout(() => titleTyping(""), 100));
      }

      if (get(viewScreen, "subTitle")) {
        const subTitleTyping = subTitle => {
          const newSubTitle =
            subTitle + getTypingAdd(get(viewScreen, "subTitle"), subTitle);
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
