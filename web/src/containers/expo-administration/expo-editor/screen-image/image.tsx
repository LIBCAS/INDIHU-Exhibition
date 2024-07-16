import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

// Components
import SelectField from "react-md/lib/SelectFields";
import ImageBox from "components/editors/ImageBox";
import InfopointsTable from "components/editors/InfopointsTable";
import HelpIcon from "components/help-icon";

// Models
import { ImageScreen, File as IndihuFile } from "models";
import { AppDispatch } from "store/store";

// Actions
import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions";
import { compact, concat } from "lodash";

// Enums
import { ScreenImageAnimationEnum } from "enums/administration-screens";

// - -

type ImageProps = {
  activeScreen: ImageScreen;
};

const Image = ({ activeScreen }: ImageProps) => {
  const { t } = useTranslation("expo-editor");
  const dispatch = useDispatch<AppDispatch>();

  const imageFile = activeScreen.image
    ? dispatch(getFileById(activeScreen.image))
    : null;

  const setImageFile = (image: IndihuFile) => {
    dispatch(updateScreenData({ image: image.id, infopoints: [] }));
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen screen-image">
        <div className="screen-two-cols">
          <div className="flex-row-nowrap one-image-row">
            <ImageBox
              title={t("descFields.imageScreen.imageBoxTitle")}
              image={imageFile}
              setImage={setImageFile}
              onDelete={() => {
                dispatch(
                  updateScreenData({
                    image: null,
                    imageOrigData: null,
                    infopoints: [],
                  })
                );
              }}
              onLoad={(width, height) => {
                dispatch(
                  updateScreenData({
                    imageOrigData: {
                      width,
                      height,
                    },
                  })
                );
              }}
              helpIconLabel={t("descFields.imageScreen.imageBoxTooltip")}
              helpIconId="editor-image-image"
              infopoints={activeScreen.infopoints}
              onInfopointMove={(
                movedInfopointIndex,
                newLeftPosition,
                newTopPosition
              ) => {
                dispatch(
                  updateScreenData({
                    infopoints: activeScreen.infopoints?.map((ip, ipIndex) =>
                      ipIndex === movedInfopointIndex
                        ? { ...ip, left: newLeftPosition, top: newTopPosition }
                        : ip
                    ),
                  })
                );
              }}
            />
          </div>

          <div className="flex-col half-width-min">
            <div className="flex-row-nowrap flex-centered">
              <SelectField
                id="screen-image-selectfield-animation"
                className="select-field big"
                label={t("descFields.imageScreen.imageAnimationLabel")}
                menuItems={[
                  {
                    label: t("descFields.imageScreen.imageAnimationWithout"),
                    value: ScreenImageAnimationEnum.WITHOUT,
                  },
                  {
                    label: t(
                      "descFields.imageScreen.imageAnimationWithoutAndBlurBackground"
                    ),
                    value: ScreenImageAnimationEnum.WITHOUT_AND_BLUR_BACKGROUND,
                  },
                  {
                    label: t("descFields.imageScreen.imageAnimationFromTop"),
                    value: ScreenImageAnimationEnum.FROM_TOP,
                  },
                  {
                    label: t("descFields.imageScreen.imageAnimationFromBottom"),
                    value: ScreenImageAnimationEnum.FROM_BOTTOM,
                  },
                  {
                    label: t(
                      "descFields.imageScreen.imageAnimationFromLeftToRight"
                    ),
                    value: ScreenImageAnimationEnum.FROM_LEFT_TO_RIGHT,
                  },
                  {
                    label: t(
                      "descFields.imageScreen.imageAnimationFromRightToLeft"
                    ),
                    value: ScreenImageAnimationEnum.FROM_RIGHT_TO_LEFT,
                  },
                ]}
                itemLabel={"label"}
                itemValue={"value"}
                position={"below"}
                defaultValue={activeScreen.animationType}
                onChange={(newAnimationType: any) =>
                  dispatch(
                    updateScreenData({ animationType: newAnimationType })
                  )
                }
              />
              <HelpIcon
                label={t("descFields.imageScreen.imageAnimationTooltip")}
                id="editor-image-animation"
              />
            </div>

            {imageFile && activeScreen.infopoints && (
              <InfopointsTable
                title="Infopointy"
                infopoints={activeScreen.infopoints}
                onInfopointAdd={(dialogFormData) => {
                  dispatch(
                    updateScreenData({
                      infopoints: compact(
                        concat(activeScreen.infopoints, {
                          // Add new infopoint object
                          ...dialogFormData,
                          top: 17,
                          left: 17,
                        })
                      ),
                    })
                  );
                }}
                onInfopointEdit={(infopointIndexToEdit, dialogFormData) => {
                  dispatch(
                    updateScreenData({
                      infopoints: activeScreen.infopoints?.map(
                        (infopoint, infopointIndex) =>
                          infopointIndex === infopointIndexToEdit
                            ? { ...infopoint, ...dialogFormData }
                            : infopoint
                      ),
                    })
                  );
                }}
                onInfopointDelete={(infopointIndexToDelete) => {
                  dispatch(
                    updateScreenData({
                      infopoints: activeScreen.infopoints?.filter(
                        (_ip, ipIndex) => infopointIndexToDelete !== ipIndex
                      ),
                    })
                  );
                }}
                onInfopointAlwaysVisibleChange={(
                  infopointIndexToEdit: number,
                  newIsAlwaysVisibleValue: boolean
                ) => {
                  dispatch(
                    updateScreenData({
                      infopoints: activeScreen.infopoints?.map(
                        (infopoint, infopointIndex) =>
                          infopointIndex === infopointIndexToEdit
                            ? {
                                ...infopoint,
                                alwaysVisible: newIsAlwaysVisibleValue,
                              }
                            : infopoint
                      ),
                    })
                  );
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Image;
