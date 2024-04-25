import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { FontIcon, Button } from "react-md";
import SequenceDialogNew from "components/dialogs/sequence-dialog/SequenceDialogNew";
import SequenceDialogEdit from "components/dialogs/sequence-dialog/SequenceDialogEdit";

import { Sequence } from "models";
import { AppDispatch } from "store/store";
import { SequenceFormData } from "components/dialogs/sequence-dialog/models";

import cx from "classnames";
import { setDialog } from "actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";
import { updateScreenData } from "actions/expoActions";

// - -

interface SequencesTableProps {
  title?: string;
  sequences: Sequence[];
  onSequenceAdd: (dialogFormData: SequenceFormData) => void;
  onSequenceEdit: (
    sequenceIndexToEdit: number,
    dialogFormData: SequenceFormData
  ) => void;
  onSequenceDelete: (sequenceIndexToDelete: number) => void;
}

interface SequenceEditDialogStatus {
  isSequenceDialogEditOpen: boolean;
  sequence: Sequence | undefined;
  sequenceIndex: number | undefined;
}

// - - -

const SequencesTable = ({
  title,
  sequences,
  onSequenceAdd,
  onSequenceEdit,
  onSequenceDelete,
}: SequencesTableProps) => {
  const { t } = useTranslation("expo-editor");
  const dispatch = useDispatch<AppDispatch>();

  const [isSequenceDialogNewOpen, setIsSequenceDialogNewOpen] =
    useState<boolean>(false);

  const closeSequenceDialogNew = () => {
    setIsSequenceDialogNewOpen(false);
  };

  const [sequenceEditDialog, setSequenceEditDialog] =
    useState<SequenceEditDialogStatus>({
      isSequenceDialogEditOpen: false,
      sequence: undefined,
      sequenceIndex: undefined,
    });

  const closeSequenceDialogEdit = () => {
    setSequenceEditDialog({
      isSequenceDialogEditOpen: false,
      sequence: undefined,
      sequenceIndex: undefined,
    });
  };

  return (
    <div className="mt-4">
      <div>{title ?? t("descFields.imageZoomScreen.seqTableTitle")}</div>
      <div className="w-full px-1 py-1 mb-4 flex flex-col gap-2">
        <table style={{ display: "table" }} className="w-[620px] table-fixed">
          <thead
            className="h-12 py-3 text-[#5e5e5e] text-[14px] font-['Work_Sans'] cursor-pointer"
            style={{ borderBottom: "1px solid #ececec" }}
          >
            <tr>
              <th className="w-[4%]"></th>
              <th className="w-[10%]" style={{ textAlign: "start" }}>
                {t("descFields.imageZoomScreen.seqTableOrderCol")}
              </th>
              <th style={{ textAlign: "start" }}>
                {t("descFields.imageZoomScreen.seqTableDescCol")}
              </th>
              <th className="w-[11%]" style={{ textAlign: "end" }}>
                {t("descFields.imageZoomScreen.seqTableActionCol")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sequences.map((seq, currSeqIndex) => (
              <tr
                key={currSeqIndex}
                className="h-12 py-3 text-[14px] font-['Work_Sans'] cursor-pointer hover:bg-[#ececec]"
                style={{ borderBottom: "1px solid #ececec" }}
              >
                <td>{currSeqIndex + 1}.</td>
                <td>
                  <div className="w-full flex justify-start items-center">
                    <FontIcon
                      className={cx("my-auto", {
                        invisible: currSeqIndex === 0,
                      })}
                      onClick={() => {
                        if (currSeqIndex === 0) {
                          return;
                        }
                        const prevSeqIndex = currSeqIndex - 1;
                        dispatch(
                          updateScreenData({
                            sequences: sequences.map((seq, idx) =>
                              idx === prevSeqIndex
                                ? sequences[currSeqIndex]
                                : idx === currSeqIndex
                                ? sequences[prevSeqIndex]
                                : seq
                            ),
                          })
                        );
                      }}
                    >
                      keyboard_arrow_up
                    </FontIcon>
                    <FontIcon
                      className={cx("my-auto", {
                        invisible: currSeqIndex === sequences.length - 1,
                      })}
                      onClick={() => {
                        if (currSeqIndex === sequences.length - 1) {
                          return;
                        }
                        const nextSeqIndex = currSeqIndex + 1;
                        dispatch(
                          updateScreenData({
                            sequences: sequences.map((seq, idx) =>
                              idx === currSeqIndex
                                ? sequences[nextSeqIndex]
                                : idx === nextSeqIndex
                                ? sequences[currSeqIndex]
                                : seq
                            ),
                          })
                        );
                      }}
                    >
                      keyboard_arrow_down
                    </FontIcon>
                  </div>
                </td>
                <td className="nowrap overflow-hidden text-ellipsis">
                  {seq.text}
                </td>
                <td>
                  <div className="w-full flex justify-end items-center">
                    <FontIcon
                      className="my-auto"
                      onClick={() => {
                        setSequenceEditDialog({
                          isSequenceDialogEditOpen: true,
                          sequence: seq,
                          sequenceIndex: currSeqIndex,
                        });
                      }}
                    >
                      edit
                    </FontIcon>
                    <FontIcon
                      className="my-auto"
                      onClick={() => {
                        dispatch(
                          setDialog(DialogType.ConfirmDialog, {
                            title: (
                              <FontIcon className="color-black">
                                delete
                              </FontIcon>
                            ),
                            text: "Opravdu chcete odstranit zvolenú sekvenciu?",
                            onSubmit: () => onSequenceDelete(currSeqIndex),
                          })
                        );
                      }}
                    >
                      delete
                    </FontIcon>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Button
          icon
          className="!text-black"
          onClick={() => setIsSequenceDialogNewOpen(true)}
        >
          add
        </Button>
      </div>

      {/* DIALOGS */}
      {isSequenceDialogNewOpen && (
        <SequenceDialogNew
          closeThisDialog={closeSequenceDialogNew}
          onDialogSubmit={onSequenceAdd}
        />
      )}

      {sequenceEditDialog.isSequenceDialogEditOpen &&
        sequenceEditDialog.sequence &&
        sequenceEditDialog.sequenceIndex !== undefined && (
          <SequenceDialogEdit
            closeThisDialog={closeSequenceDialogEdit}
            onDialogSubmit={onSequenceEdit}
            sequence={sequenceEditDialog.sequence}
            sequenceIndex={sequenceEditDialog.sequenceIndex}
          />
        )}
    </div>
  );
};

export default SequencesTable;
