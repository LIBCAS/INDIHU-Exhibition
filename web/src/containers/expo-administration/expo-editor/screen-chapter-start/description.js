import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import TextField from "react-md/lib/TextFields";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";
import SelectField from "react-md/lib/SelectFields";

import AudioMusic from "components/editors/audio-music";
import Time from "components/editors/time";
import HelpIcon from "components/help-icon";

import { setDialog } from "actions/dialog-actions";
import { getFileById } from "actions/file-actions";

import {
  ScreenChapterStartHorizontalPositionEnum,
  ScreenChapterStartVerticalPositionEnum,
  ScreenChapterIntroTextThemeEnum,
  ScreenChapterIntroTextHaloEffectOnEnum,
} from "enums/administration-screens";

const Description = ({ activeScreen, updateScreenData, getFileById }) => {
  const { t } = useTranslation("expo-editor");

  const music = getFileById(activeScreen.music);
  const audio = getFileById(activeScreen.audio);

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
                onChange={(value) => updateScreenData({ title: value })}
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
                onChange={(value) => updateScreenData({ subTitle: value })}
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
                onChange={(value) => updateScreenData({ animateText: value })}
                className="checkbox-shift-left-by-padding"
              />
            </div>

            <div className="row">
              <SelectField
                id="chapter-start-selectfield-textPosition.horizontal"
                className="select-field big"
                label={t("descFields.horizontalTextPosition")}
                menuItems={[
                  {
                    value: ScreenChapterStartHorizontalPositionEnum.LEFT,
                    label: t("descFields.horizontalTextPositionLeftOption"),
                  },
                  {
                    value: ScreenChapterStartHorizontalPositionEnum.CENTER,
                    label: t("descFields.horizontalTextPositionCenterOption"),
                  },
                  {
                    value: ScreenChapterStartHorizontalPositionEnum.RIGHT,
                    label: t("descFields.horizontalTextPositionRightOption"),
                  },
                ]}
                itemLabel={"label"}
                itemValue={"value"}
                position={"below"}
                defaultValue={activeScreen?.textPosition?.horizontal}
                onChange={(value) =>
                  updateScreenData({
                    textPosition: {
                      ...activeScreen?.textPosition,
                      horizontal: value,
                    },
                  })
                }
              />
              <SelectField
                id="chapter-start-selectfield-textPosition.vertical"
                className="select-field big"
                label={t("descFields.verticalTextPosition")}
                menuItems={[
                  {
                    value: ScreenChapterStartVerticalPositionEnum.TOP,
                    label: t("descFields.verticalTextPositionTopOption"),
                  },
                  {
                    value: ScreenChapterStartVerticalPositionEnum.CENTER,
                    label: t("descFields.verticalTextPositionCenterOption"),
                  },
                  {
                    value: ScreenChapterStartVerticalPositionEnum.BOTTOM,
                    label: t("descFields.verticalTextPositionBottomOption"),
                  },
                ]}
                itemLabel={"label"}
                itemValue={"value"}
                position={"below"}
                defaultValue={activeScreen?.textPosition?.vertical}
                onChange={(value) =>
                  updateScreenData({
                    textPosition: {
                      ...activeScreen?.textPosition,
                      vertical: value,
                    },
                  })
                }
              />
            </div>

            <div className="row">
              <SelectField
                id="chapter-start-selectield-textColor"
                className="select-field big"
                label={t("descFields.textTheme")}
                menuItems={[
                  {
                    value: ScreenChapterIntroTextThemeEnum.LIGHT,
                    label: t("descFields.textThemeLightOption"),
                  },
                  {
                    value: ScreenChapterIntroTextThemeEnum.DARK,
                    label: t("descFields.textThemeDarkOption"),
                  },
                ]}
                itemLabel={"label"}
                itemValue={"value"}
                position={"below"}
                defaultValue={activeScreen.introTextTheme}
                onChange={(value) =>
                  updateScreenData({ introTextTheme: value })
                }
              />

              <SelectField
                id="chapter-start-selectfield-textHaloEffect"
                className="select-field big"
                label={t("descFields.enableHaloEffect")}
                menuItems={[
                  {
                    value: ScreenChapterIntroTextHaloEffectOnEnum.ON,
                    label: t("descFields.enableHaloEffectOnOption"),
                  },
                  {
                    value: ScreenChapterIntroTextHaloEffectOnEnum.OFF,
                    label: t("descFields.enableHaloEffectOffOption"),
                  },
                ]}
                itemLabel={"label"}
                itemValue={"value"}
                position={"below"}
                defaultValue={activeScreen.isIntroTextHaloEffectOn}
                onChange={(value) =>
                  updateScreenData({ isIntroTextHaloEffectOn: value })
                }
              />
            </div>
          </div>

          {/* Second column */}
          <div className="part margin-bottom margin-horizontal">
            <AudioMusic
              {...{
                isAudio: true,
                audio,
                updateScreenData,
                helpIconTitle: t("descFields.audioScreenTrackTooltip"),
                id: "editor-chapter-start-description-audio",
              }}
            />
            <Time {...{ audio, activeScreen, updateScreenData }} />
            <AudioMusic
              {...{
                music,
                updateScreenData,
                helpIconTitle: t("descFields.audioChapterTrackTooltip"),
                id: "editor-chapter-start-description-music",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(null, { setDialog, getFileById })(Description);
