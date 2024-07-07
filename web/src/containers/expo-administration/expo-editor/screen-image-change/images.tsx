import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import SelectField from "react-md/lib/SelectFields";
import ImageBox from "components/editors/ImageBox";
import InfopointsTable from "components/editors/InfopointsTable";
import HelpIcon from "components/help-icon";

import { AppDispatch } from "store/store";
import { ImageChangeScreen, File as IndihuFile } from "models";

import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions/screen-actions";
import {
  ImageChangeAnimationEnum,
  ImageChangeGradualTransitionBeginPositionEnum,
  ImageChangeRodPositionEnum,
} from "enums/administration-screens";

// - -

type ImagesProps = { activeScreen: ImageChangeScreen };

const Images = ({ activeScreen }: ImagesProps) => {
  const { t } = useTranslation("expo-editor");
  const dispatch = useDispatch<AppDispatch>();
  // const isSmall = useMediaQuery(breakpoints.down("md"));

  const image1File = dispatch(getFileById(activeScreen.image1));
  const image2File = dispatch(getFileById(activeScreen.image2));

  const setImage1File = (img: IndihuFile) => {
    dispatch(updateScreenData({ image1: img.id }));
  };

  const setImage2File = (img: IndihuFile) => {
    dispatch(updateScreenData({ image2: img.id }));
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="w-full mb-8 flex flex-col justify-start items-center gap-4 md:flex-row md:justify-center md:items-center md:gap-8">
          <AnimationSelectField
            animationTypeValue={activeScreen.animationType}
          />

          {activeScreen.animationType === "GRADUAL_TRANSITION" && (
            <GradualTransitionSelectField
              gradualTransitionBeginPositionValue={
                activeScreen.gradualTransitionBeginPosition
              }
            />
          )}

          {(activeScreen.animationType === "HORIZONTAL" ||
            activeScreen.animationType === "VERTICAL") && (
            <RodPositionSelectField
              rodPositionValue={activeScreen.rodPosition}
            />
          )}
        </div>

        <div className="w-full flex flex-col justify-start items-center gap-12 xl:flex-row xl:justify-around xl:items-start xl:gap-8">
          {/* BEFORE */}
          <div className="flex flex-col gap-4">
            <ImageBox
              title={t("descFields.imageChangeScreen.imageBeforeLabel")}
              image={image1File}
              setImage={setImage1File}
              onDelete={() => {
                dispatch(
                  updateScreenData({ image1: null, image1OrigData: null })
                );
              }}
              onLoad={(width, height) => {
                dispatch(
                  updateScreenData({ image1OrigData: { width, height } })
                );
              }}
              helpIconLabel={t(
                "descFields.imageChangeScreen.imageBeforeTooltip"
              )}
              helpIconId="editor-image-change-image-before"
              infopoints={activeScreen.image1Infopoints ?? []}
              onInfopointMove={(
                movedInfopointIndex,
                newLeftPosition,
                newTopPosition
              ) => {
                dispatch(
                  updateScreenData({
                    image1Infopoints: activeScreen.image1Infopoints?.map(
                      (ip, ipIndex) =>
                        ipIndex === movedInfopointIndex
                          ? {
                              ...ip,
                              left: newLeftPosition,
                              top: newTopPosition,
                            }
                          : ip
                    ),
                  })
                );
              }}
              infopointTooltipId={"image-before-infopoint"}
            />

            <InfopointsTable
              key="infopoints-table-before"
              title={t("descFields.imageChangeScreen.infopointsBeforeTitle")}
              infopoints={activeScreen.image1Infopoints ?? []}
              onInfopointAdd={(dialogFormData) => {
                dispatch(
                  updateScreenData({
                    image1Infopoints: [
                      ...(activeScreen.image1Infopoints ?? []),
                      { ...dialogFormData, top: 17, left: 17 },
                    ],
                  })
                );
              }}
              onInfopointEdit={(infopointIndexToEdit, dialogFormData) => {
                dispatch(
                  updateScreenData({
                    image1Infopoints: activeScreen.image1Infopoints?.map(
                      (ip, ipIndex) =>
                        ipIndex === infopointIndexToEdit
                          ? { ...ip, ...dialogFormData }
                          : ip
                    ),
                  })
                );
              }}
              onInfopointDelete={(infopointIndexToDelete) => {
                dispatch(
                  updateScreenData({
                    image1Infopoints: activeScreen.image1Infopoints?.filter(
                      (_ip, ipIndex) => ipIndex !== infopointIndexToDelete
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
                    image1Infopoints: activeScreen.image1Infopoints?.map(
                      (ip, ipIndex) =>
                        ipIndex === infopointIndexToEdit
                          ? { ...ip, alwaysVisible: newIsAlwaysVisibleValue }
                          : ip
                    ),
                  })
                );
              }}
            />
          </div>

          {/* AFTER */}
          <div className="flex flex-col gap-4">
            <ImageBox
              title={t("descFields.imageChangeScreen.imageAfterLabel")}
              image={image2File}
              setImage={setImage2File}
              onDelete={() => {
                dispatch(
                  updateScreenData({ image2: null, image2OrigData: null })
                );
              }}
              onLoad={(width, height) => {
                dispatch(
                  updateScreenData({ image2OrigData: { width, height } })
                );
              }}
              helpIconLabel={t(
                "descFields.imageChangeScreen.imageAfterTooltip"
              )}
              helpIconId="editor-image-change-image-after"
              infopoints={activeScreen.image2Infopoints ?? []}
              onInfopointMove={(
                movedInfopointIndex,
                newLeftPosition,
                newTopPosition
              ) => {
                dispatch(
                  updateScreenData({
                    image2Infopoints: activeScreen.image2Infopoints?.map(
                      (ip, ipIndex) =>
                        ipIndex === movedInfopointIndex
                          ? {
                              ...ip,
                              left: newLeftPosition,
                              top: newTopPosition,
                            }
                          : ip
                    ),
                  })
                );
              }}
              infopointTooltipId={"image-after-infopoint"}
            />

            <InfopointsTable
              key="infopoints-table-after"
              title={t("descFields.imageChangeScreen.infopointsAfterTitle")}
              infopoints={activeScreen.image2Infopoints ?? []}
              onInfopointAdd={(dialogFormData) => {
                dispatch(
                  updateScreenData({
                    image2Infopoints: [
                      ...(activeScreen.image2Infopoints ?? []),
                      { ...dialogFormData, top: 17, left: 17 },
                    ],
                  })
                );
              }}
              onInfopointEdit={(infopointIndexToEdit, dialogFormData) => {
                dispatch(
                  updateScreenData({
                    image2Infopoints: activeScreen.image2Infopoints?.map(
                      (ip, ipIndex) =>
                        ipIndex === infopointIndexToEdit
                          ? { ...ip, ...dialogFormData }
                          : ip
                    ),
                  })
                );
              }}
              onInfopointDelete={(infopointIndexToDelete) => {
                dispatch(
                  updateScreenData({
                    image2Infopoints: activeScreen.image2Infopoints?.filter(
                      (_ip, ipIndex) => ipIndex !== infopointIndexToDelete
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
                    image2Infopoints: activeScreen.image2Infopoints?.map(
                      (ip, ipIndex) =>
                        ipIndex === infopointIndexToEdit
                          ? { ...ip, alwaysVisible: newIsAlwaysVisibleValue }
                          : ip
                    ),
                  })
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Images;

// - -

type AnimationSelectFieldProps = {
  animationTypeValue: ImageChangeScreen["animationType"];
};

const AnimationSelectField = ({
  animationTypeValue,
}: AnimationSelectFieldProps) => {
  const { t } = useTranslation("expo-editor");
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex">
      <SelectField
        id="screen-image-change-selectfield-animation"
        label={t("descFields.imageChangeScreen.animationTypeLabel")}
        menuItems={[
          {
            label: t(
              "descFields.imageChangeScreen.animationHorizontalRodOption"
            ),
            value: ImageChangeAnimationEnum.HORIZONTAL,
          },
          {
            label: t("descFields.imageChangeScreen.animationVerticalRodOption"),
            value: ImageChangeAnimationEnum.VERTICAL,
          },
          {
            label: t("descFields.imageChangeScreen.animationGradualOption"),
            value: ImageChangeAnimationEnum.GRADUAL_TRANSITION,
          },
          {
            label: t(
              "descFields.imageChangeScreen.animationFadeInOutTwoImagesOption"
            ),
            value: ImageChangeAnimationEnum.FADE_IN_OUT_TWO_IMAGES,
          },
        ]}
        itemLabel="label"
        itemValue="value"
        position="below"
        defaultValue={animationTypeValue ?? ImageChangeAnimationEnum.VERTICAL}
        onChange={(newValue: ImageChangeScreen["animationType"]) => {
          dispatch(updateScreenData({ animationType: newValue }));
        }}
        style={{ width: "290px" }}
      />
      <HelpIcon
        label={t("descFields.imageChangeScreen.animationTypeTooltip")}
        id="editor-image-change-animation"
      />
    </div>
  );
};

// - -

type RodPositionSelectFieldProps = {
  rodPositionValue: ImageChangeScreen["rodPosition"];
};

const RodPositionSelectField = ({
  rodPositionValue,
}: RodPositionSelectFieldProps) => {
  const { t } = useTranslation("expo-editor");
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex">
      <SelectField
        id="screen-image-change-selectfield-rodPosition"
        label={t("descFields.imageChangeScreen.initialRodPositionLabel")}
        menuItems={[
          {
            label: t(
              "descFields.imageChangeScreen.initialRodPositionStartOption"
            ),
            value: ImageChangeRodPositionEnum.ZERO,
          },
          {
            label: t(
              "descFields.imageChangeScreen.initialRodPositionQuarterOption"
            ),
            value: ImageChangeRodPositionEnum.QUARTER_ONE,
          },
          {
            label: t(
              "descFields.imageChangeScreen.initialRodPositionHalfOption"
            ),
            value: ImageChangeRodPositionEnum.HALF_ONE,
          },
          {
            label: t(
              "descFields.imageChangeScreen.initialRodPositionThreeQuarterOption"
            ),
            value: ImageChangeRodPositionEnum.THREE_QUARTER_ONE,
          },
          {
            label: t(
              "descFields.imageChangeScreen.initialRodPositionEndOption"
            ),
            value: ImageChangeRodPositionEnum.ONE,
          },
        ]}
        itemLabel="label"
        itemValue="value"
        position="below"
        defaultValue={rodPositionValue ?? "0.5"}
        onChange={(newValue: ImageChangeScreen["rodPosition"]) => {
          dispatch(updateScreenData({ rodPosition: newValue }));
        }}
        style={{ width: "290px" }}
      />
      <HelpIcon
        label={t("descFields.imageChangeScreen.initialRodPositionTooltip")}
        id="editor-image-change-rodPosition"
      />
    </div>
  );
};

// - -

type GradualTransitionSelectFieldProps = {
  gradualTransitionBeginPositionValue: ImageChangeScreen["gradualTransitionBeginPosition"];
};

const GradualTransitionSelectField = ({
  gradualTransitionBeginPositionValue,
}: GradualTransitionSelectFieldProps) => {
  const { t } = useTranslation("expo-editor");
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex">
      <SelectField
        id="screen-image-change-selectfield-gradualTransitionBeginPosition"
        label={t(
          "descFields.imageChangeScreen.initialGradualTransitionPositionLabel"
        )}
        menuItems={[
          {
            label: t(
              "descFields.imageChangeScreen.initialGradualPositionTopToBottom"
            ),
            value:
              ImageChangeGradualTransitionBeginPositionEnum.VERTICAL_TOP_TO_BOTTOM,
          },
          {
            label: t(
              "descFields.imageChangeScreen.initialGradualPositionBottomToTop"
            ),
            value:
              ImageChangeGradualTransitionBeginPositionEnum.VERTICAL_BOTTOM_TO_TOP,
          },
          {
            label: t(
              "descFields.imageChangeScreen.initialGradualPositionLeftToRight"
            ),
            value:
              ImageChangeGradualTransitionBeginPositionEnum.HORIZONTAL_LEFT_TO_RIGHT,
          },
          {
            label: t(
              "descFields.imageChangeScreen.initialGradualPositionRightToLeft"
            ),
            value:
              ImageChangeGradualTransitionBeginPositionEnum.HORIZONTAL_RIGHT_TO_LEFT,
          },
        ]}
        itemLabel="label"
        itemValue="value"
        position="below"
        defaultValue={
          gradualTransitionBeginPositionValue ?? "VERTICAL_TOP_TO_BOTTOM"
        }
        onChange={(
          newValue: ImageChangeScreen["gradualTransitionBeginPosition"]
        ) => {
          dispatch(
            updateScreenData({ gradualTransitionBeginPosition: newValue })
          );
        }}
        style={{ width: "290px" }}
      />
      <HelpIcon
        label={t(
          "descFields.imageChangeScreen.initialGradualTransitionPositionTooltip"
        )}
        id="editor-image-change-gradualTransitionBeginPosition"
      />
    </div>
  );
};
