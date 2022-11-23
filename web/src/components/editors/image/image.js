import { connect } from "react-redux";
import { map, compact, concat, get, find, filter } from "lodash";
import { compose, withState } from "recompose";
import SelectField from "react-md/lib/SelectFields";

import ImageContainer from "../image";
import InfopointsSequencesTable from "../infopoints-sequences-table";
import HelpIcon from "../../help-icon";

import { getFileById } from "../../../actions/file-actions";
import { updateScreenData } from "../../../actions/expoActions";

import {
  animationType,
  animationTypeText,
} from "../../../enums/animation-type";
import { helpIconText } from "../../../enums/text";
import { hasValue } from "../../../utils";

const options = [
  { label: animationTypeText.WITHOUT, value: animationType.WITHOUT },
  {
    label: animationTypeText.WITHOUT_AND_BLUR_BACKGROUND,
    value: animationType.WITHOUT_AND_BLUR_BACKGROUND,
  },
  { label: animationTypeText.FROM_TOP, value: animationType.FROM_TOP },
  { label: animationTypeText.FROM_BOTTOM, value: animationType.FROM_BOTTOM },
  {
    label: animationTypeText.FROM_LEFT_TO_RIGHT,
    value: animationType.FROM_LEFT_TO_RIGHT,
  },
  {
    label: animationTypeText.FROM_RIGHT_TO_LEFT,
    value: animationType.FROM_RIGHT_TO_LEFT,
  },
];

const Image = ({
  activeScreen,
  getFileById,
  updateScreenData,
  setActivePoint,
  activePoint,
}) => {
  if (!activeScreen) return <div />;
  const image = activeScreen.image ? getFileById(activeScreen.image) : null;

  const setImage = (image) => {
    updateScreenData({ image: image.id, infopoints: [] });
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen screen-image">
        <div className="screen-two-cols">
          <div className="flex-row-nowrap one-image-row">
            <ImageContainer
              {...{
                title: "Obrázek na pozadí",
                image,
                setImage,
                onDelete: () =>
                  updateScreenData({ image: null, imageOrigData: null }),
                onLoad: (width, height) =>
                  updateScreenData({
                    imageOrigData: {
                      width,
                      height,
                    },
                  }),
                infopoints: activeScreen.infopoints,
                updateScreenData,
                activePoint,
                helpIconLabel: helpIconText.EDITOR_IMAGE_IMAGE,
                id: "editor-image-image",
              }}
            />
          </div>
          <div className="flex-col half-width-min">
            <div className="flex-row-nowrap flex-centered">
              <SelectField
                id="screen-image-selectfield-animation"
                className="select-field big"
                label="Animace obrázku"
                menuItems={options}
                itemLabel={"label"}
                itemValue={"value"}
                position={"below"}
                defaultValue={activeScreen.animationType}
                onChange={(value) => updateScreenData({ animationType: value })}
              />
              <HelpIcon
                {...{
                  label: helpIconText.EDITOR_IMAGE_ANIMATION,
                  id: "editor-image-animation",
                }}
              />
            </div>
            {image && (
              <InfopointsSequencesTable
                {...{
                  label: "Infopointy",
                  imgIdx: 0,
                  infopoints: activeScreen.infopoints,
                  activePoint,
                  onRowClick: (i) =>
                    setActivePoint(activePoint === i ? null : i),
                  onSubmit: (text) => {
                    updateScreenData({
                      infopoints: map(activeScreen.infopoints, (infopoint) =>
                        infopoint.edit
                          ? { ...infopoint, text, edit: false }
                          : infopoint
                      ),
                    });
                  },
                  onClear: () =>
                    updateScreenData({
                      infopoints: map(activeScreen.infopoints, (infopoint) => ({
                        ...infopoint,
                        edit: false,
                      })),
                    }),
                  onEdit: (i) =>
                    updateScreenData({
                      infopoints: map(
                        activeScreen.infopoints,
                        (infopoint, idx) =>
                          i === idx
                            ? { ...infopoint, edit: true }
                            : { ...infopoint, edit: false }
                      ),
                    }),
                  onCheckbox: (i, value) =>
                    updateScreenData({
                      infopoints: map(
                        activeScreen.infopoints,
                        (infopoint, idx) =>
                          i === idx
                            ? { ...infopoint, alwaysVisible: value }
                            : infopoint
                      ),
                    }),
                  onAdd: () =>
                    updateScreenData({
                      infopoints: compact(
                        concat(activeScreen.infopoints, {
                          text: "Vložte popis infopointu",
                          top: 17,
                          left: 17,
                          alwaysVisible: false,
                        })
                      ),
                    }),
                  onDelete: (i) =>
                    updateScreenData({
                      infopoints: filter(
                        activeScreen.infopoints,
                        (_, idx) => i !== Number(idx)
                      ),
                    }),
                  initialValues: {
                    text:
                      !hasValue(
                        get(
                          find(
                            activeScreen.infopoints,
                            (infopoint) => infopoint.edit
                          ),
                          "text"
                        )
                      ) ||
                      get(
                        find(
                          activeScreen.infopoints,
                          (infopoint) => infopoint.edit
                        ),
                        "text"
                      ) === "Vložte popis infopointu"
                        ? ""
                        : get(
                            find(
                              activeScreen.infopoints,
                              (infopoint) => infopoint.edit
                            ),
                            "text"
                          ),
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default compose(
  connect(null, { getFileById, updateScreenData }),
  withState("activePoint", "setActivePoint", null)
)(Image);
