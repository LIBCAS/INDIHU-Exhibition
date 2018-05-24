import React from "react";
import { connect } from "react-redux";
import { map, compact, concat, find, filter } from "lodash";
import { compose, withState } from "recompose";

import Image from "../Image";
import InfopointsSequencesTable from "../InfopointsSequencesTable";

import { setDialog } from "../../../actions/dialogActions";
import { updateScreenData } from "../../../actions/expoActions";
import { getFileById } from "../../../actions/fileActions";

const Sequence = ({
  activeScreen,
  setDialog,
  updateScreenData,
  handleSubmit,
  setActivePoint,
  activePoint,
  getFileById
}) => {
  const image = activeScreen.image ? getFileById(activeScreen.image) : null;

  const setImage = image => {
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
                    sequences: null
                  }),
                onLoad: (width, height) =>
                  updateScreenData({
                    imageOrigData: {
                      width,
                      height
                    }
                  }),
                sequences: activeScreen.sequences,
                updateScreenData,
                activePoint
              }}
            />
          </div>
          {image &&
            <InfopointsSequencesTable
              {...{
                label: "Sekvence zoomu",
                infopoints: activeScreen.sequences,
                activePoint,
                onRowClick: i => setActivePoint(activePoint === i ? null : i),
                onArrowUp: i =>
                  updateScreenData({
                    sequences: [
                      ...activeScreen.sequences.slice(0, i - 1),
                      activeScreen.sequences[i],
                      activeScreen.sequences[i - 1],
                      ...activeScreen.sequences.slice(
                        i + 1,
                        activeScreen.sequences.length
                      )
                    ]
                  }),
                onArrowDown: i =>
                  updateScreenData({
                    sequences: [
                      ...activeScreen.sequences.slice(0, i),
                      activeScreen.sequences[i + 1],
                      activeScreen.sequences[i],
                      ...activeScreen.sequences.slice(
                        i + 2,
                        activeScreen.sequences.length
                      )
                    ]
                  }),
                onSubmit: text =>
                  updateScreenData({
                    sequences: map(
                      activeScreen.sequences,
                      sequence =>
                        sequence.edit
                          ? { ...sequence, text, edit: false }
                          : sequence
                    )
                  }),
                onClear: () =>
                  updateScreenData({
                    sequences: map(activeScreen.sequences, sequence => {
                      return { ...sequence, edit: false };
                    })
                  }),
                onEdit: i =>
                  updateScreenData({
                    sequences: map(
                      activeScreen.sequences,
                      (sequence, idx) =>
                        i === idx
                          ? { ...sequence, edit: true }
                          : { ...sequence, edit: false }
                    )
                  }),
                onDelete: i =>
                  updateScreenData({
                    sequences: filter(
                      activeScreen.sequences,
                      (inf, idx) => i !== idx
                    )
                  }),
                onSelect: (i, value) =>
                  updateScreenData({
                    sequences: map(
                      activeScreen.sequences,
                      (sequence, idx) =>
                        i === idx ? { ...sequence, zoom: value } : sequence
                    )
                  }),
                onAdd: () =>
                  updateScreenData({
                    sequences: compact(
                      concat(activeScreen.sequences, {
                        text: "Vložte popis zoomu",
                        zoom: 2,
                        top: 12,
                        left: 12
                      })
                    )
                  }),
                initialValues: {
                  text: find(activeScreen.sequences, i => i.edit)
                    ? find(activeScreen.sequences, i => i.edit).text
                    : undefined
                }
              }}
            />}
        </div>
      </div>
    </div>
  );
};

export default compose(
  connect(null, { setDialog, updateScreenData, getFileById }),
  withState("activePoint", "setActivePoint", null)
)(Sequence);
