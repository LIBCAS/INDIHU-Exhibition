import { useDispatch } from "react-redux";

import SelectField from "react-md/lib/SelectFields";
import ImageBox from "components/editors/ImageBox";
import InfopointsTable from "components/editors/InfopointsTable";
import HelpIcon from "components/help-icon";

import { AppDispatch } from "store/store";
import { ImageChangeScreen, File as IndihuFile } from "models";

import { getFileById } from "actions/file-actions-typed";
import { updateScreenData } from "actions/expoActions/screen-actions-typed";
import { helpIconText } from "enums/text";
import {
  animationOptions,
  rodPositionOptions,
  gradualTransitionBeginPositionOptions,
} from "./enums";
import { animationType } from "enums/animation-type";

type ImagesProps = { activeScreen: ImageChangeScreen };

const Images = ({ activeScreen }: ImagesProps) => {
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
              title="Obrázek před"
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
              helpIconLabel={helpIconText.EDITOR_IMAGE_CHANGE_IMAGE_BEFORE}
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
              title="Infopointy před"
              infopoints={activeScreen.image1Infopoints ?? []}
              onInfopointAdd={async (dialogFormData) => {
                dispatch(
                  updateScreenData({
                    image1Infopoints: [
                      ...(activeScreen.image1Infopoints ?? []),
                      { ...dialogFormData, top: 17, left: 17 },
                    ],
                  })
                );
              }}
              onInfopointEdit={async (infopointIndexToEdit, dialogFormData) => {
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
            />
          </div>

          {/* AFTER */}
          <div className="flex flex-col gap-4">
            <ImageBox
              title="Obrázek po"
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
              helpIconLabel={helpIconText.EDITOR_IMAGE_CHANGE_IMAGE_AFTER}
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
              title="Infopointy po"
              infopoints={activeScreen.image2Infopoints ?? []}
              onInfopointAdd={async (dialogFormData) => {
                dispatch(
                  updateScreenData({
                    image2Infopoints: [
                      ...(activeScreen.image2Infopoints ?? []),
                      { ...dialogFormData, top: 17, left: 17 },
                    ],
                  })
                );
              }}
              onInfopointEdit={async (infopointIndexToEdit, dialogFormData) => {
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
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex">
      <SelectField
        id="screen-image-change-selectfield-animation"
        label="Způsob přechodu mezi obrázky"
        menuItems={animationOptions}
        itemLabel="label"
        itemValue="value"
        position="below"
        defaultValue={animationTypeValue ?? animationType.VERTICAL}
        onChange={(newValue: ImageChangeScreen["animationType"]) => {
          dispatch(updateScreenData({ animationType: newValue }));
        }}
        style={{ width: "290px" }}
      />
      <HelpIcon
        label={helpIconText.EDITOR_IMAGE_CHANGE_ANIMATION}
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
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex">
      <SelectField
        id="screen-image-change-selectfield-rodPosition"
        label="Počáteční pozice táhla na obrazovce"
        menuItems={rodPositionOptions}
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
        label="Zvolte jednu z pěti možností, kde bude táhlo iniciálně na obrazovce umístěno (vzhledem k předchozí volbě)."
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
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex">
      <SelectField
        id="screen-image-change-selectfield-gradualTransitionBeginPosition"
        label="Počáteční pozice pozvolného přechodu"
        menuItems={gradualTransitionBeginPositionOptions}
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
        label="Zvolte jednu ze tří možností odkud začne pozvolný přechod."
        id="editor-image-change-gradualTransitionBeginPosition"
      />
    </div>
  );
};
