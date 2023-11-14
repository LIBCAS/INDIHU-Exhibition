import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import { TextField, SelectField, FontIcon, Button, Checkbox } from "react-md";
import AudioMusic from "components/editors/audio-music";
import HelpIcon from "components/help-icon";
import CharacterCount from "components/editors/character-count";

// Models
import {
  StartScreen,
  ActiveExpo,
  File as IndihuFile,
  ScreenStartAnimationType,
} from "models";
import { AppDispatch } from "store/store";

// Actions and utils
import { setDialog } from "actions/dialog-actions";
import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions";
import { giveMeExpoTime } from "utils";
import { ScreenStartAnimationEnum } from "enums/administration-screens";
import { DialogType } from "components/dialogs/dialog-types";

// - -

type DescriptionProps = { activeScreen: StartScreen; activeExpo: ActiveExpo };

const Description = ({ activeScreen, activeExpo }: DescriptionProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor");

  const [error, setError] = useState<string | null>(null);

  const image = dispatch(getFileById(activeScreen.image));
  const audio = dispatch(getFileById(activeScreen.audio));

  const setImage = (img: IndihuFile) => {
    dispatch(updateScreenData({ image: img.id }));
  };

  const expoTime = giveMeExpoTime(activeExpo.structure.screens);
  const expoTimeNumber = Number(activeScreen.expoTime);
  const expoTimeValue = isNaN(expoTimeNumber)
    ? "0"
    : Math.round(expoTimeNumber / 60).toString();

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="description-container">
          <div className="part margin-bottom margin-horizontal">
            <div className="flex-row-nowrap">
              <TextField
                id="screen-start-textfield-title"
                label={t("descFields.name")}
                defaultValue={activeScreen.title}
                onChange={(newTitle: string) =>
                  dispatch(updateScreenData({ title: newTitle }))
                }
              />
              <HelpIcon
                label={t("descFields.nameTooltip")}
                id="editor-start-description-title"
              />
            </div>
            <div className="flex-row-nowrap">
              <TextField
                id="screen-start-textfield-subtitle"
                label={t("descFields.subname")}
                defaultValue={activeScreen.subTitle}
                onChange={(newSubTitle: string) =>
                  dispatch(updateScreenData({ subTitle: newSubTitle }))
                }
              />
              <HelpIcon
                label={t("descFields.subnameTooltip")}
                id="editor-start-description-subtitle"
              />
            </div>
            <div className="flex-row-nowrap">
              <TextField
                id="screen-start-textfield-perex"
                label={t("descFields.perex")}
                rows={5}
                defaultValue={activeScreen.perex}
                onChange={(newPerex: string) =>
                  dispatch(updateScreenData({ perex: newPerex }))
                }
              />
              <HelpIcon
                label={t("descFields.perexTooltip")}
                id="editor-start-description-perex"
              />
            </div>
            <CharacterCount text={activeScreen.perex} />
          </div>

          <div className="part margin-horizontal">
            <div className="row flex-centered">
              <TextField
                id="screen-start-textfield-image"
                label={t("descFields.backgroundImage")}
                value={image ? image.name : ""}
                disabled
              />

              {image && (
                <img
                  src={`/api/files/${image.fileId}`}
                  onLoad={(e) => {
                    const imgEl = e.currentTarget;
                    dispatch(
                      updateScreenData({
                        imageOrigData: {
                          width: imgEl.width,
                          height: imgEl.height,
                        },
                      })
                    );
                  }}
                  className="hidden"
                  alt=""
                />
              )}

              <div className="row flex-centered">
                {image && (
                  <FontIcon
                    className="icon"
                    onClick={() =>
                      dispatch(
                        setDialog(DialogType.ConfirmDialog, {
                          title: (
                            <FontIcon className="color-black">delete</FontIcon>
                          ),
                          text: "Opravdu chcete odstranit obrázek?",
                          onSubmit: () =>
                            dispatch(updateScreenData({ image: null })),
                        })
                      )
                    }
                  >
                    delete
                  </FontIcon>
                )}

                <Button
                  raised
                  label={t("descFields.backgroundImageSelectLabel")}
                  onClick={() =>
                    dispatch(
                      setDialog(DialogType.ScreenFileChoose, {
                        onChoose: setImage,
                        typeMatch: new RegExp(/^image\/.*$/),
                        accept: "image/*",
                      })
                    )
                  }
                />
                <HelpIcon
                  label={t("descFields.backgroundImageTooltip")}
                  id="editor-start-description-image"
                />
              </div>
            </div>

            <div className="flex-row-nowrap flex-space-between flex-center">
              <SelectField
                id="screen-start-selectfield-animation"
                className="select-field big"
                label={t("descFields.imageAnimation")}
                menuItems={[
                  {
                    label: "Bez animace",
                    value: ScreenStartAnimationEnum.WITHOUT,
                  },
                  {
                    label: "Bez animace s rozmlženým pozadím",
                    value: ScreenStartAnimationEnum.WITHOUT_AND_BLUR_BACKGROUND,
                  },
                  {
                    label: "Shora dolů",
                    value: ScreenStartAnimationEnum.FROM_TOP,
                  },
                  {
                    label: "Zdola nahoru",
                    value: ScreenStartAnimationEnum.FROM_BOTTOM,
                  },
                  {
                    label: "Zleva doprava",
                    value: ScreenStartAnimationEnum.FROM_LEFT_TO_RIGHT,
                  },
                  {
                    label: "Zprava doleva",
                    value: ScreenStartAnimationEnum.FROM_RIGHT_TO_LEFT,
                  },
                ]}
                itemLabel={"label"}
                itemValue={"value"}
                position={"below"}
                defaultValue={activeScreen.animationType}
                onChange={(value: ScreenStartAnimationType) =>
                  dispatch(updateScreenData({ animationType: value }))
                }
              />
              <HelpIcon
                label={t("descFields.imageAnimationTooltip")}
                id="editor-start-description-animation"
              />
            </div>

            <AudioMusic
              textFieldLabel={t("descFields.expoAudio")}
              audio={audio}
              isAudio={true}
              helpIconTitle={t("descFields.expoAudioTooltip")}
              id="editor-start-description-audio"
            />

            <div className="flex-col">
              <div className="flex-row-nowrap">
                <div className="form-input form-input-with-suffix">
                  <TextField
                    id="screen-start-textfield-expoTime"
                    label={t("descFields.expoDuration")}
                    type="number"
                    defaultValue={expoTimeValue}
                    onChange={(value: string) => {
                      const numberValue = Number(value);
                      const nan = isNaN(numberValue);

                      if (nan || numberValue > 1000000) {
                        setError("Zadejte číslo v rozsahu 0 až 1000000.");
                      } else {
                        setError(null);
                      }

                      dispatch(
                        updateScreenData({
                          expoTime: !nan ? Math.abs(numberValue * 60) : value,
                        })
                      );
                    }}
                  />
                  <span className="form-input-suffix">min</span>
                </div>
                <HelpIcon
                  label={t("descFields.expoDurationTooltip")}
                  id="editor-start-description-expotime"
                />
              </div>
              {error && (
                <div>
                  <span className="invalid">{error}</span>
                </div>
              )}
              <div className="margin-bottom-small">
                {t("descFields.timeEstimation")} <b>{expoTime}</b>
              </div>
            </div>
            <div className="flex-row-nowrap">
              <TextField
                id="screen-start-textfield-organization"
                label={t("descFields.organization")}
                defaultValue={activeScreen.organization ?? ""}
                onChange={(newOrganization: string) =>
                  dispatch(updateScreenData({ organization: newOrganization }))
                }
              />
              <HelpIcon
                label={t("descFields.organizationTooltip")}
                id="editor-start-description-organization"
              />
            </div>
            <div className="flex-row-nowrap">
              <TextField
                id="screen-start-textfield-organization-link"
                label={t("descFields.organizationLink")}
                defaultValue={activeScreen.organizationLink ?? ""}
                onChange={(newOrganizationLink: string) =>
                  dispatch(
                    updateScreenData({ organizationLink: newOrganizationLink })
                  )
                }
              />
              <HelpIcon
                label={t("descFields.organizationLinkTooltip")}
                id="editor-start-description-organization-link"
              />
            </div>
            <div className="row">
              <Checkbox
                id="screen-start-checkbox-screencompleted"
                name="simple-checkboxes"
                label={t("descFields.screenCompleted")}
                checked={activeScreen.screenCompleted}
                value={activeScreen.screenCompleted}
                onChange={(value: boolean) =>
                  dispatch(updateScreenData({ screenCompleted: value }))
                }
                className="checkbox-shift-left-by-padding"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;
