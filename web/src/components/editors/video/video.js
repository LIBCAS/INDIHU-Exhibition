import { connect } from "react-redux";
import classNames from "classnames";

import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import FontIcon from "react-md/lib/FontIcons";
import Button from "react-md/lib/Buttons/Button";

import HelpIcon from "../../help-icon";

import { setDialog } from "../../../actions/dialog-actions";
import { getFileById } from "../../../actions/file-actions";

import { helpIconText } from "../../../enums/text";

const Video = ({ activeScreen, updateScreenData, setDialog, getFileById }) => {
  const video = getFileById(activeScreen.video);

  const setVideo = (video) => {
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
                "img-none": !video,
              })}
            >
              <div>Video</div>
              <Card
                className={classNames("card-image auto-height", {
                  img: !!video,
                  "img-none": !video,
                })}
              >
                {video ? (
                  <CardText>
                    <video controls width="100%">
                      <source
                        src={`/api/files/${video.fileId}`}
                        type={video.type}
                      />
                      Váš prohlížeč nepodporuje přehrávání videa.
                    </video>
                  </CardText>
                ) : (
                  <CardText className="flex-col padding-none">
                    <FontIcon className="card-image-icon-placeholder">
                      movie
                    </FontIcon>
                    <div className="flex flex-centered">
                      <Button
                        raised
                        label="Vybrat"
                        onClick={() =>
                          setDialog("ScreenFileChoose", {
                            onChoose: setVideo,
                            typeMatch: new RegExp(/^video\/.*$/),
                            accept: "video/*",
                          })
                        }
                      />
                    </div>
                  </CardText>
                )}
              </Card>
              {video && (
                <div className="flex-row flex-right">
                  <div>
                    <FontIcon
                      className="icon"
                      onClick={() =>
                        setDialog("ScreenFileChoose", {
                          onChoose: setVideo,
                          typeMatch: new RegExp(/^video\/.*$/),
                          accept: "video/*",
                        })
                      }
                    >
                      mode_edit
                    </FontIcon>
                    <FontIcon
                      className="icon"
                      onClick={() =>
                        setDialog("ConfirmDialog", {
                          title: (
                            <FontIcon className="color-black">delete</FontIcon>
                          ),
                          text: "Opravdu chcete odstranit video?",
                          onSubmit: () => updateScreenData({ video: null }),
                        })
                      }
                    >
                      delete
                    </FontIcon>
                  </div>
                </div>
              )}
            </div>
            <HelpIcon {...{ label: helpIconText.EDITOR_VIDEO_VIDEO }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(null, { setDialog, getFileById })(Video);
