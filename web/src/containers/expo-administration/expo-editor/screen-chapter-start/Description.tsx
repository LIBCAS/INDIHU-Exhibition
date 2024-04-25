import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import TextField from "react-md/lib/TextFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";
import SelectField from "react-md/lib/SelectFields";
import AudioMusic from "components/editors/audio-music";
import Time from "components/editors/time";
import HelpIcon from "components/help-icon";

// Models
import {
  IntroScreen,
  ScreenChapterIntroTextThemeType,
  ScreenChapterStartHorizontalPositionType,
  ScreenChapterStartVerticalPositionType,
} from "models";
import { AppDispatch } from "store/store";

// Actions and utils
import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions";

import {
  ScreenChapterStartHorizontalPositionEnum,
  ScreenChapterStartVerticalPositionEnum,
  ScreenChapterIntroTextThemeEnum,
  ScreenChapterIntroTextHaloEffectOnEnum,
} from "enums/administration-screens";

// - -

type DescriptionProps = {
  activeScreen: IntroScreen;
};

const Description = ({ activeScreen }: DescriptionProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor");

  const music = dispatch(getFileById(activeScreen.music));
  const audio = dispatch(getFileById(activeScreen.audio));

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="description-container">
          {/* First column */}
          <div className="part margin-bottom margin-horizontal">
            <div className="flex-row-nowrap">
              <TextField
                id="chapter-start-textfield-title"
                label={t("descFields.name")}
                defaultValue={activeScreen.title}
                onChange={(newTitle: string) =>
                  dispatch(updateScreenData({ title: newTitle }))
                }
              />
              <HelpIcon
                label={t("descFields.nameChapterTooltip")}
                id="editor-chapter-start-description-title"
              />
            </div>
            <div className="flex-row-nowrap">
              <TextField
                id="chapter-start-textfield-subtitle"
                label={t("descFields.subname")}
                defaultValue={activeScreen.subTitle}
                onChange={(newSubtitle: string) =>
                  dispatch(updateScreenData({ subTitle: newSubtitle }))
                }
              />
              <HelpIcon
                label={t("descFields.subnameChapterToolip")}
                id="editor-chapter-start-description-title"
              />
            </div>
            <div className="row">
              <Checkbox
                id="chapter-start-checkbox-animateText"
                name="simple-checkboxes"
                label={t("descFields.imageChapterAnimation")}
                checked={!!activeScreen.animateText}
                value={!!activeScreen.animateText}
                onChange={(value: boolean) =>
                  dispatch(updateScreenData({ animateText: value }))
                }
                className="checkbox-shift-left-by-padding"
              />
            </div>

            <div className="row">
              <SelectField
                id="chapter-start-selectfield-textPosition.horizontal"
                className="select-field big"
                label={t("descFields.introScreen.horizontalTextPosition")}
                menuItems={[
                  {
                    value: ScreenChapterStartHorizontalPositionEnum.LEFT,
                    label: t(
                      "descFields.introScreen.horizontalTextPositionLeftOption"
                    ),
                  },
                  {
                    value: ScreenChapterStartHorizontalPositionEnum.CENTER,
                    label: t(
                      "descFields.introScreen.horizontalTextPositionCenterOption"
                    ),
                  },
                  {
                    value: ScreenChapterStartHorizontalPositionEnum.RIGHT,
                    label: t(
                      "descFields.introScreen.horizontalTextPositionRightOption"
                    ),
                  },
                ]}
                itemLabel={"label"}
                itemValue={"value"}
                position={"below"}
                defaultValue={activeScreen?.textPosition?.horizontal}
                onChange={(value: ScreenChapterStartHorizontalPositionType) =>
                  dispatch(
                    updateScreenData({
                      textPosition: {
                        ...activeScreen?.textPosition,
                        horizontal: value,
                      },
                    })
                  )
                }
              />
              <SelectField
                id="chapter-start-selectfield-textPosition.vertical"
                className="select-field big"
                label={t("descFields.introScreen.verticalTextPosition")}
                menuItems={[
                  {
                    value: ScreenChapterStartVerticalPositionEnum.TOP,
                    label: t(
                      "descFields.introScreen.verticalTextPositionTopOption"
                    ),
                  },
                  {
                    value: ScreenChapterStartVerticalPositionEnum.CENTER,
                    label: t(
                      "descFields.introScreen.verticalTextPositionCenterOption"
                    ),
                  },
                  {
                    value: ScreenChapterStartVerticalPositionEnum.BOTTOM,
                    label: t(
                      "descFields.introScreen.verticalTextPositionBottomOption"
                    ),
                  },
                ]}
                itemLabel={"label"}
                itemValue={"value"}
                position={"below"}
                defaultValue={activeScreen?.textPosition?.vertical}
                onChange={(value: ScreenChapterStartVerticalPositionType) =>
                  dispatch(
                    updateScreenData({
                      textPosition: {
                        ...activeScreen?.textPosition,
                        vertical: value,
                      },
                    })
                  )
                }
              />
            </div>

            <div className="row">
              <SelectField
                id="chapter-start-selectield-textColor"
                className="select-field big"
                label={t("descFields.introScreen.textTheme")}
                menuItems={[
                  {
                    value: ScreenChapterIntroTextThemeEnum.LIGHT,
                    label: t("descFields.introScreen.textThemeLightOption"),
                  },
                  {
                    value: ScreenChapterIntroTextThemeEnum.DARK,
                    label: t("descFields.introScreen.textThemeDarkOption"),
                  },
                ]}
                itemLabel={"label"}
                itemValue={"value"}
                position={"below"}
                defaultValue={activeScreen.introTextTheme}
                onChange={(value: ScreenChapterIntroTextThemeType) =>
                  dispatch(updateScreenData({ introTextTheme: value }))
                }
              />

              <SelectField
                id="chapter-start-selectfield-textHaloEffect"
                className="select-field big"
                label={t("descFields.introScreen.enableHaloEffect")}
                menuItems={[
                  {
                    value: ScreenChapterIntroTextHaloEffectOnEnum.ON,
                    label: t("descFields.introScreen.enableHaloEffectOnOption"),
                  },
                  {
                    value: ScreenChapterIntroTextHaloEffectOnEnum.OFF,
                    label: t(
                      "descFields.introScreen.enableHaloEffectOffOption"
                    ),
                  },
                ]}
                itemLabel={"label"}
                itemValue={"value"}
                position={"below"}
                defaultValue={activeScreen.isIntroTextHaloEffectOn}
                onChange={(value: ScreenChapterIntroTextHaloEffectOnEnum) =>
                  dispatch(updateScreenData({ isIntroTextHaloEffectOn: value }))
                }
              />
            </div>
          </div>

          {/* Second column */}
          <div className="part margin-bottom margin-horizontal">
            <AudioMusic
              isAudio={true}
              audio={audio}
              helpIconTitle={t("descFields.audioScreenTrackTooltip")}
              id="editor-chapter-start-description-audio"
            />
            <Time activeScreen={activeScreen} audio={audio} />
            <AudioMusic
              isAudio={false}
              music={music}
              helpIconTitle={t("descFields.audioChapterTrackTooltip")}
              id="editor-chapter-start-description-music"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;
