import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";

import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import FontIcon from "react-md/lib/FontIcons";
import Button from "react-md/lib/Buttons/Button";

import HelpIcon from "../../HelpIcon";

import { setDialog } from "../../../actions/dialogActions";
import { getFileById } from "../../../actions/fileActions";

import { helpIconText } from "../../../enums/text";

const Video = ({ activeScreen, updateScreenData, setDialog, getFileById }) => {
  const video = getFileById(activeScreen.video);

  const setVideo = video => {
    updateScreenData({ video: video.id });
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen screen-image">
        <div className="flex-row-nowrap flex-centered full-width">
          <div className="flex-row-nowrap one-image-row">
            <div
              className={classNames("flex-col card-image-container", {
                img: !!video,
                "img-none": !video
              })}
            >
              <div>Video</div>
              <Card
                className={classNames("card-image auto-height", {
                  img: !!video,
                  "img-none": !video
                })}
              >
                {video
                  ? <CardText>
                      <video controls width="100%">
                        <source
                          src={`/api/files/${video.fileId}`}
                          type={video.type}
                        />
                        Váš prohlížeč nepodporuje přehrávání videa.
                      </video>
                    </CardText>
                  : <CardText className="flex-col padding-none">
                      <FontIcon>movie</FontIcon>
                      <div className="flex flex-centered">
                        <Button
                          raised
                          label="Vybrat"
                          onClick={() =>
                            setDialog("ScreenFileChoose", {
                              onChoose: setVideo,
                              typeMatch: new RegExp(/^video\/.*$/)
                            })}
                        />
                      </div>
                    </CardText>}
              </Card>
              {video &&
                <div className="flex-row flex-right">
                  <div>
                    <FontIcon
                      className="icon"
                      onClick={() =>
                        setDialog("ScreenFileChoose", {
                          onChoose: setVideo,
                          typeMatch: new RegExp(/^video\/.*$/)
                        })}
                    >
                      mode_edit
                    </FontIcon>
                    <FontIcon
                      className="icon"
                      onClick={() => updateScreenData({ video: null })}
                    >
                      delete
                    </FontIcon>
                  </div>
                </div>}
            </div>
            <HelpIcon {...{ label: helpIconText.EDITOR_VIDEO_VIDEO }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(null, { setDialog, getFileById })(Video);
