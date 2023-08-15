import { connect } from "react-redux";
import { compose } from "recompose";
import SelectField from "react-md/lib/SelectFields";

import Image from "../../../components/editors/image";
import HelpIcon from "../../../components/help-icon";

import { setDialog } from "../../../actions/dialog-actions";
import { getFileById } from "../../../actions/file-actions";
import { updateScreenData } from "../../../actions/expoActions";

import {
  animationType,
  animationTypeText,
} from "../../../enums/animation-type";

import { helpIconText } from "../../../enums/text";
import InfopointsTable from "../../../components/editors/InfopointsTable";

import { compact, concat } from "lodash";

// - - - - -

const animationOptions = [
  { label: animationTypeText.HORIZONTAL, value: animationType.HORIZONTAL },
  { label: animationTypeText.VERTICAL, value: animationType.VERTICAL },
  {
    label: animationTypeText.GRADUAL_TRANSITION,
    value: animationType.GRADUAL_TRANSITION,
  },
  {
    label: "Prolnutí",
    value: animationType.FADE_IN_OUT_TWO_IMAGES,
  },
];

const rodPositionOptions = [
  { label: "Na začátku obrazovky", value: "0" },
  { label: "Ve čtvrtině obrazovky", value: "0.25" },
  { label: "V půlce obrazovky", value: "0.5" },
  { label: "V tričtvrtině obrazovky", value: "0.75" },
  { label: "Na konci obrazovky", value: "1" },
];

const gradualTransitionBeginPositionOptions = [
  { label: "Vertikální shora dolů", value: "VERTICAL_TOP_TO_BOTTOM" },
  { label: "Vertikální zdola nahoru", value: "VERTICAL_BOTTOM_TO_TOP" },
  { label: "Horizontální zleva doprava", value: "HORIZONTAL_LEFT_TO_RIGHT" },
  { label: "Horizontální zprava doleva", value: "HORIZONTAL_RIGHT_TO_LEFT" },
];

// const transitionOptions = [
//   { label: screenTransitionText.ON_TIME, value: screenTransition.ON_TIME },
//   { label: screenTransitionText.ON_BUTTON, value: screenTransition.ON_BUTTON },
// ];

const Images = ({ activeScreen, getFileById, updateScreenData }) => {
  // image objects with { created, fileId, id, name, size, thumbnailId, type }
  const image1 = activeScreen.image1 ? getFileById(activeScreen.image1) : null;
  const image2 = activeScreen.image2 ? getFileById(activeScreen.image2) : null;

  const setImage1 = (image1) => {
    updateScreenData({ image1: image1.id });
  };
  const setImage2 = (image2) => {
    updateScreenData({ image2: image2.id });
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen" style={{ marginBottom: "10em" }}>
        {/* 1. Two images right to each other */}
        <div className="screen-two-cols">
          {/* First image */}
          <div className="flex-row-nowrap one-image-row">
            <Image
              {...{
                title: "Obrázek před",
                image: image1,
                setImage: setImage1,
                onDelete: () =>
                  updateScreenData({ image1: null, image1OrigData: null }),
                onLoad: (width, height) =>
                  updateScreenData({
                    image1OrigData: {
                      width,
                      height,
                    },
                  }),
                image1Infopoints: activeScreen.image1Infopoints,
                updateScreenData,
                helpIconLabel: helpIconText.EDITOR_IMAGE_CHANGE_IMAGE_BEFORE,
                id: "editor-image-change-image-before",
              }}
            />
          </div>

          {/* Second image */}
          <div className="flex-row-nowrap one-image-row">
            <Image
              {...{
                title: "Obrázek po",
                image: image2,
                setImage: setImage2,
                onDelete: () =>
                  updateScreenData({ image2: null, image2OrigData: null }),
                onLoad: (width, height) => {
                  updateScreenData({
                    image2OrigData: {
                      width,
                      height,
                    },
                  });
                },
                image2Infopoints: activeScreen.image2Infopoints,
                updateScreenData,
                helpIconLabel: helpIconText.EDITOR_IMAGE_CHANGE_IMAGE_AFTER,
                id: "editor-image-change-image-after",
              }}
            />
          </div>
        </div>

        {/* 2. Two infopoints table, for both images */}
        <div className="w-11/12 mx-auto mt-6 flex-col gap-8">
          <InfopointsTable
            title="Infopointy Pred"
            infopoints={activeScreen.image1Infopoints ?? []}
            onInfopointAdd={(dialogFormData) =>
              updateScreenData({
                image1Infopoints: compact(
                  concat(activeScreen.image1Infopoints, {
                    // Add new infopoint object
                    ...dialogFormData,
                    top: 17,
                    left: 17,
                  })
                ),
              })
            }
            onInfopointEdit={(infopointIndexToEdit, dialogFormData) =>
              updateScreenData({
                image1Infopoints: activeScreen.image1Infopoints?.map(
                  (infopoint, infopointIndex) =>
                    infopointIndex === infopointIndexToEdit
                      ? { ...infopoint, ...dialogFormData }
                      : { ...infopoint }
                ),
              })
            }
            onInfopointDelete={(infopointIndexToDelete) =>
              updateScreenData({
                image1Infopoints: activeScreen.image1Infopoints?.filter(
                  (_infopoint, infopointIndex) =>
                    infopointIndex !== infopointIndexToDelete
                ),
              })
            }
          />

          {/* Second table */}
          <InfopointsTable
            title="Infopointy Po"
            infopoints={activeScreen.image2Infopoints ?? []}
            onInfopointAdd={(dialogFormData) =>
              updateScreenData({
                image2Infopoints: compact(
                  concat(activeScreen.image2Infopoints, {
                    // Add new infopoint object
                    ...dialogFormData,
                    top: 17,
                    left: 17,
                  })
                ),
              })
            }
            onInfopointEdit={(infopointIndexToEdit, dialogFormData) =>
              updateScreenData({
                image2Infopoints: activeScreen.image2Infopoints?.map(
                  (infopoint, infopointIndex) =>
                    infopointIndex === infopointIndexToEdit
                      ? { ...infopoint, ...dialogFormData }
                      : { ...infopoint }
                ),
              })
            }
            onInfopointDelete={(infopointIndexToDelete) =>
              updateScreenData({
                image2Infopoints: activeScreen.image2Infopoints?.filter(
                  (_infopoint, infopointIndex) =>
                    infopointIndex !== infopointIndexToDelete
                ),
              })
            }
          />
        </div>

        {/* 3. Selectfields */}
        <div className="full-width">
          <div className="flex-row-nowrap flex-centered full-width">
            <SelectField
              id="screen-image-change-selectfield-animation"
              className="select-field"
              label="Způsob přechodu mezi obrázky"
              menuItems={animationOptions}
              itemLabel={"label"}
              itemValue={"value"}
              position={"below"}
              defaultValue={
                activeScreen.animationType ?? animationType.VERTICAL
              }
              onChange={(value) => updateScreenData({ animationType: value })}
              style={{ minWidth: 280 }}
            />
            <HelpIcon
              label={helpIconText.EDITOR_IMAGE_CHANGE_ANIMATION}
              id="editor-image-change-animation"
            />
          </div>

          <div className="flex-row-nowrap flex-centered full-width">
            {activeScreen.animationType === "GRADUAL_TRANSITION" ? (
              <>
                <SelectField
                  id="screen-image-change-selectfield-gradualTransitionBeginPosition"
                  className="select-field"
                  label="Počáteční pozice pozvolného přechodu"
                  menuItems={gradualTransitionBeginPositionOptions}
                  itemLabel={"label"}
                  itemValue={"value"}
                  position={"below"}
                  defaultValue={
                    activeScreen.gradualTransitionBeginPosition ??
                    "VERTICAL_TOP_TO_BOTTOM"
                  }
                  value={activeScreen.gradualTransitionBeginPosition}
                  onChange={(value) =>
                    updateScreenData({ gradualTransitionBeginPosition: value })
                  }
                  style={{ minWidth: 280 }}
                />
                <HelpIcon
                  label="Zvolte jednu ze tří možností odkud začne pozvolný přechod."
                  id="editor-image-change-gradualTransitionBeginPosition"
                />
              </>
            ) : activeScreen.animationType === "HORIZONTAL" ||
              activeScreen.animationType === "VERTICAL" ? (
              <>
                <SelectField
                  id="screen-image-change-selectfield-rodPosition"
                  className="select-field"
                  label="Počáteční pozice táhla na obrazovce"
                  menuItems={rodPositionOptions}
                  itemLabel={"label"}
                  itemValue={"value"}
                  position={"below"}
                  defaultValue={activeScreen.rodPosition ?? "0.5"}
                  value={activeScreen.rodPosition}
                  onChange={(value) => updateScreenData({ rodPosition: value })}
                  style={{ minWidth: 280 }}
                />
                <HelpIcon
                  label="Zvolte jednu z pěti možností, kde bude táhlo iniciálně na obrazovce umístěno (vzhledem k předchozí volbě)."
                  id="editor-image-change-rodPosition"
                />
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default compose(
  connect(null, {
    setDialog,
    getFileById,
    updateScreenData,
  })
)(Images);
