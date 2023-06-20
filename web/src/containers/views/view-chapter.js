import classNames from "classnames";
import { withRouter } from "react-router-dom";
import {
  compose,
  lifecycle,
  withState,
  withHandlers,
  withProps,
  onlyUpdateForKeys,
} from "recompose";
import { connect } from "react-redux";
import { get, escapeRegExp } from "lodash";

import { animationType } from "../../enums/animation-type";
import { isMobileDevice } from "../../utils";

const endTime = 3;

const ViewChapter = ({ animation }) => {
  return (
    <div className="viewer-screen">
      <div
        id="view-chapter-image-container"
        className={classNames("image-fullscreen-wrap chapter", {
          slideUp: animation === animationType.FROM_TOP,
          slideDown: animation === animationType.FROM_BOTTOM,
          slideRight: animation === animationType.FROM_LEFT_TO_RIGHT,
          slideLeft: animation === animationType.FROM_RIGHT_TO_LEFT,
        })}
      />
      <div className="title-container">
        <p
          id="viewer-screen-view-chapter-title"
          className="title-fullscreen"
        ></p>
        <p
          id="viewer-screen-view-chapter-subtitle"
          className="subtitle-fullscreen"
        ></p>
      </div>
    </div>
  );
};

export default compose(
  withRouter,
  connect(({ expo: { viewScreen } }) => ({ viewScreen }), null),
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
    },
  }),
  withProps(({ viewScreen }) => ({
    animation: get(viewScreen, "animationType"),
  })),
  lifecycle({
    componentDidMount() {
      const {
        screenPreloadedFiles,
        viewScreen,
        animation,
        setTitleTimeout,
        setSubTitleTimeout,
        getTypingAdd,
      } = this.props;

      if (screenPreloadedFiles["image"]) {
        if (animation === animationType.WITHOUT_AND_BLUR_BACKGROUND) {
          const backgroundNode = document.createElement("img");
          backgroundNode.src = screenPreloadedFiles["image"];
          backgroundNode.className = "view-chapter-image-background";
          backgroundNode.setAttribute(
            "style",
            "position: static; min-width: 100%; min-height: 100%;"
          );
          document
            .getElementById("view-chapter-image-container")
            .appendChild(backgroundNode);
        }

        const newNode = document.createElement("img");
        newNode.src = screenPreloadedFiles["image"];

        newNode.className = classNames("image-fullscreen", {
          cover:
            animation === animationType.WITHOUT ||
            animation === animationType.WITHOUT_FULL_SCREEN,
          contain: animation === animationType.WITHOUT_NO_CROP,
          "with-blur": animation === animationType.WITHOUT_AND_BLUR_BACKGROUND,
          "animation-slideDown":
            animation && animation === animationType.FROM_TOP,
          "animation-slideUp":
            animation && animation === animationType.FROM_BOTTOM,
          "animation-slideRight":
            animation && animation === animationType.FROM_LEFT_TO_RIGHT,
          "animation-slideLeft":
            animation && animation === animationType.FROM_RIGHT_TO_LEFT,
        });
        newNode.setAttribute(
          "style",
          `animation-duration: ${
            viewScreen.time && viewScreen.time > 0
              ? viewScreen.time - endTime
              : 20 - endTime
          }s`
        );
        document
          .getElementById("view-chapter-image-container")
          .appendChild(newNode);
      }

      // without animation
      if (!viewScreen.animateText || isMobileDevice()) {
        const titleEl = document.getElementById(
          "viewer-screen-view-chapter-title"
        );
        if (titleEl) {
          titleEl.innerHTML = get(viewScreen, "title", "");
        }
        const subtitleEl = document.getElementById(
          "viewer-screen-view-chapter-subtitle"
        );
        if (subtitleEl) {
          subtitleEl.innerHTML = get(viewScreen, "subTitle", "");
        }
      } else {
        const typingTime = 100;

        if (get(viewScreen, "title")) {
          const titleTyping = (title) => {
            const newTitle =
              title + getTypingAdd(get(viewScreen, "title"), title);
            const element = document.getElementById(
              "viewer-screen-view-chapter-title"
            );
            if (element) {
              element.innerHTML = newTitle;
              if (newTitle !== title) {
                setTitleTimeout(
                  setTimeout(() => titleTyping(newTitle), typingTime)
                );
              }
            }
          };

          setTitleTimeout(setTimeout(() => titleTyping(""), typingTime));
        }

        if (get(viewScreen, "subTitle")) {
          const subTitleTyping = (subTitle) => {
            const newSubTitle =
              subTitle + getTypingAdd(get(viewScreen, "subTitle"), subTitle);
            const element = document.getElementById(
              "viewer-screen-view-chapter-subtitle"
            );
            if (element) {
              element.innerHTML = newSubTitle;
              if (newSubTitle !== subTitle) {
                setSubTitleTimeout(
                  setTimeout(() => subTitleTyping(newSubTitle), typingTime)
                );
              }
            }
          };

          setSubTitleTimeout(
            setTimeout(
              () => subTitleTyping(""),
              viewScreen.title.replace(/\s/g, "").length * typingTime + 1000
            )
          );
        }
      }
    },
    componentWillUnmount() {
      const { titleTimeout, subtitleTimeout } = this.props;

      clearTimeout(titleTimeout);
      clearTimeout(subtitleTimeout);
    },
  }),
  onlyUpdateForKeys(["animation"])
)(ViewChapter);
