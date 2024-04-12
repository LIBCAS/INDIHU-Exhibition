import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

// Components
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import FontIcon from "react-md/lib/FontIcons";
import Button from "react-md/lib/Buttons/Button";
import HelpIcon from "components/help-icon";

// Models
import { VideoScreen, File as IndihuFile } from "models";
import { AppDispatch } from "store/store";

// Actions and utils
import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions";
import { setDialog } from "actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";

import cx from "classnames";

// - -

type VideoProps = {
  activeScreen: VideoScreen;
};

const Video = ({ activeScreen }: VideoProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor");

  const video = dispatch(getFileById(activeScreen.video));

  const setVideo = (video: IndihuFile) => {
    dispatch(updateScreenData({ video: video.id }));
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen screen-image">
        <div className="flex-row-nowrap flex-centered full-width">
          <div className="flex-row-nowrap one-image-row">
            <div
              className={cx("flex-col card-image-container", {
                img: !!video,
                "img-none": !video,
              })}
            >
              <div>{t("descFields.videoScreen.videoBoxLabel")}</div>
              <Card
                className={cx("card-image auto-height", {
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
                          dispatch(
                            setDialog(DialogType.ScreenFileChoose, {
                              onChoose: setVideo,
                              typeMatch: new RegExp(/^video\/.*$/),
                              accept: "video/*",
                            })
                          )
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
                        dispatch(
                          setDialog(DialogType.ScreenFileChoose, {
                            onChoose: setVideo,
                            typeMatch: new RegExp(/^video\/.*$/),
                            accept: "video/*",
                          })
                        )
                      }
                    >
                      mode_edit
                    </FontIcon>
                    <FontIcon
                      className="icon"
                      onClick={() =>
                        dispatch(
                          setDialog(DialogType.ConfirmDialog, {
                            title: (
                              <FontIcon className="color-black">
                                delete
                              </FontIcon>
                            ),
                            text: "Opravdu chcete odstranit video?",
                            onSubmit: () =>
                              dispatch(updateScreenData({ video: null })),
                          })
                        )
                      }
                    >
                      delete
                    </FontIcon>
                  </div>
                </div>
              )}
            </div>
            <HelpIcon label={t("descFields.videoScreen.videoBoxTooltip")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
