import { connect } from "react-redux";
import { map, compact, concat, filter, get, find } from "lodash";
import { compose, withState } from "recompose";
import { SelectField } from "react-md";

import Image from "../image";
import InfopointsSequencesTable from "../infopoints-sequences-table";
import HelpIcon from "../../help-icon";

import { setDialog } from "../../../actions/dialog-actions";
import { updateScreenData } from "../../../actions/expoActions";
import { getFileById } from "../../../actions/file-actions";
import { hasValue } from "../../../utils";
import { helpIconText } from "../../../enums/text";
import {
  zoomInTooltipPosition,
  zoomInTooltipPositionText,
} from "../../../enums/screen-enums";

const Sequence = ({
  activeScreen,
  updateScreenData,
  setActivePoint,
  activePoint,
  getFileById,
}) => {
  const image = activeScreen.image ? getFileById(activeScreen.image) : null;

  const setImage = (image) => {
    updateScreenData({ image: image.id, sequences: [] });
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen screen-image">
        <div className="screen-two-cols">
          <div className="flex-row-nowrap one-image-row">
            <Image
              {...{
                title: "Obrázek",
                image,
                setImage,
                onDelete: () =>
                  updateScreenData({
                    image: null,
                    imageOrigData: null,
                    sequences: null,
                  }),
                onLoad: (width, height) =>
                  updateScreenData({
                    imageOrigData: {
                      width,
                      height,
                    },
                  }),
                sequences: activeScreen.sequences,
                updateScreenData,
                activePoint,
                helpIconLabel: helpIconText.EDITOR_ZOOM_IN_IMAGE,
                id: "editor-zoom-in-image",
              }}
            />
          </div>
          <div className="flex-row-nowrap flex-centered">
            <SelectField
              id="screen-zoom-in-tooltip-position"
              className="select-field bigger"
              label="Pozice popisu zoomu"
              menuItems={map(zoomInTooltipPosition, (value) => ({
                value,
                label: get(zoomInTooltipPositionText, value),
              }))}
              defaultValue={activeScreen.tooltipPosition}
              itemLabel={"label"}
              itemValue={"value"}
              position={"below"}
              onChange={(tooltipPosition) =>
                updateScreenData({
                  tooltipPosition,
                })
              }
            />
            <HelpIcon
              {...{
                label: helpIconText.EDITOR_ZOOM_IN_TOOLTIP_POSITION,
                id: "editor-zoom-in-tooltip-position",
              }}
            />
          </div>
          {image && (
            <InfopointsSequencesTable
              {...{
                label: "Sekvence zoomu",
                infopoints: activeScreen.sequences,
                activePoint,
                onRowClick: (i) => setActivePoint(activePoint === i ? null : i),
                onArrowUp: (i) =>
                  updateScreenData({
                    sequences: [
                      ...activeScreen.sequences.slice(0, i - 1),
                      activeScreen.sequences[i],
                      activeScreen.sequences[i - 1],
                      ...activeScreen.sequences.slice(
                        i + 1,
                        activeScreen.sequences.length
                      ),
                    ],
                  }),
                onArrowDown: (i) =>
                  updateScreenData({
                    sequences: [
                      ...activeScreen.sequences.slice(0, i),
                      activeScreen.sequences[i + 1],
                      activeScreen.sequences[i],
                      ...activeScreen.sequences.slice(
                        i + 2,
                        activeScreen.sequences.length
                      ),
                    ],
                  }),
                onSubmit: (text) =>
                  updateScreenData({
                    sequences: map(activeScreen.sequences, (sequence) =>
                      sequence.edit
                        ? { ...sequence, text, edit: false }
                        : sequence
                    ),
                  }),
                onClear: () =>
                  updateScreenData({
                    sequences: map(activeScreen.sequences, (sequence) => {
                      return { ...sequence, edit: false };
                    }),
                  }),
                onEdit: (i) =>
                  updateScreenData({
                    sequences: map(activeScreen.sequences, (sequence, idx) =>
                      i === idx
                        ? { ...sequence, edit: true }
                        : { ...sequence, edit: false }
                    ),
                  }),
                onDelete: (i) =>
                  updateScreenData({
                    sequences: filter(
                      activeScreen.sequences,
                      (_, idx) => i !== idx
                    ),
                  }),
                onSelect: (i, value) =>
                  updateScreenData({
                    sequences: map(activeScreen.sequences, (sequence, idx) =>
                      i === idx ? { ...sequence, zoom: value } : sequence
                    ),
                  }),
                onEditTime: (i, value) => {
                  const time = Number(value);
                  updateScreenData({
                    sequences: map(activeScreen.sequences, (sequence, idx) =>
                      i === idx
                        ? {
                            ...sequence,
                            time,
                            timeError:
                              isNaN(time) || time < 1 || time > 1000000,
                          }
                        : sequence
                    ),
                  });
                },
                onAdd: () =>
                  updateScreenData({
                    sequences: compact(
                      concat(activeScreen.sequences, {
                        text: "Vložte popis zoomu",
                        zoom: 2,
                        top: 17,
                        left: 17,
                        time: 1,
                      })
                    ),
                  }),
                initialValues: {
                  text:
                    !hasValue(
                      get(
                        find(
                          activeScreen.sequences,
                          (infopoint) => infopoint.edit
                        ),
                        "text"
                      )
                    ) ||
                    get(
                      find(
                        activeScreen.sequences,
                        (infopoint) => infopoint.edit
                      ),
                      "text"
                    ) === "Vložte popis zoomu"
                      ? ""
                      : get(
                          find(
                            activeScreen.sequences,
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
  );
};

export default compose(
  connect(null, { setDialog, updateScreenData, getFileById }),
  withState("activePoint", "setActivePoint", null)
)(Sequence);
