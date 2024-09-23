import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import FontIcon from "react-md/lib/FontIcons";
import ImageBox from "components/editors/ImageBox";
import TextField from "react-md/lib/TextFields";
import HelpIcon from "components/help-icon";
import ScreenChooser from "./ScreenChooser";

import { ReferenceObj, SignpostScreen, File as IndihuFile } from "models";
import { AppDispatch } from "store/store";

import { updateScreenData } from "actions/expoActions";
import { setDialog } from "actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";

import cx from "classnames";
import EditableTextField from "components/editable-text-field/EditableTextField";

// - - -

type LinkItemProps = {
  currLinkObj: ReferenceObj;
  currLinkIndex: number;
  activeScreen: SignpostScreen;
  currLinkImage: IndihuFile | null;
  setCurrLinkImage: (image: IndihuFile) => void;
};

export const LinkItem = ({
  currLinkObj,
  currLinkIndex,
  activeScreen,
  currLinkImage,
  setCurrLinkImage,
}: LinkItemProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.signpostScreen",
  });

  const referenceType = useMemo(
    () => activeScreen.referenceType ?? "TEXT_IMAGES",
    [activeScreen.referenceType]
  );

  return (
    <Accordion
      sx={{
        "& .MuiAccordionSummary-content": { overflowX: "auto" },
      }}
    >
      <AccordionSummary
        id={`accordion-signpost-${currLinkIndex}`}
        expandIcon={
          <Button>
            <Icon
              useMaterialUiIcon
              name="close"
              tooltip={{
                id: "link-close-icon-tooltip",
                content: t("closeIconTooltip"),
                variant: "dark",
              }}
            />
          </Button>
        }
        sx={{
          "& .MuiAccordionSummary-expandIconWrapper": {
            visibility: "hidden",
            "&.Mui-expanded": {
              visibility: "visible",
              transform: "none",
            },
          },
        }}
      >
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col">
            <Button
              className={currLinkIndex === 0 ? "invisible" : undefined}
              onClick={(e) => {
                e.stopPropagation();
                if (currLinkIndex === 0) {
                  return;
                }

                const prevAnswerIndex = currLinkIndex - 1;
                dispatch(
                  updateScreenData({
                    links: activeScreen.links.map((link, linkIndex) =>
                      linkIndex === prevAnswerIndex
                        ? activeScreen.links[currLinkIndex]
                        : linkIndex === currLinkIndex
                        ? activeScreen.links[prevAnswerIndex]
                        : link
                    ),
                  })
                );
              }}
            >
              <Icon useMaterialUiIcon name="keyboard_arrow_up" />
            </Button>

            <Button
              className={
                currLinkIndex === activeScreen.links.length - 1
                  ? "invisible"
                  : undefined
              }
              onClick={(e) => {
                e.stopPropagation();
                if (currLinkIndex === activeScreen.links.length - 1) {
                  return;
                }

                const nextAnswerIndex = currLinkIndex + 1;
                dispatch(
                  updateScreenData({
                    links: activeScreen.links.map((link, linkIndex) =>
                      linkIndex === currLinkIndex
                        ? activeScreen.links[nextAnswerIndex]
                        : linkIndex === nextAnswerIndex
                        ? activeScreen.links[currLinkIndex]
                        : link
                    ),
                  })
                );
              }}
            >
              <Icon useMaterialUiIcon name="keyboard_arrow_down" />
            </Button>
          </div>

          <div className="mx-4 w-full flex justify-center items-center">
            <EditableTextField
              id={`linkItem-${currLinkIndex}-editable-textfield`}
              value={
                currLinkObj.customUserLabel ??
                `${t("reference")} ${currLinkIndex + 1}`
              }
              onCommit={(newCustomLabel: string) => {
                dispatch(
                  updateScreenData({
                    links: activeScreen.links?.map((link, linkIndex) =>
                      linkIndex === currLinkIndex
                        ? { ...link, customUserLabel: newCustomLabel }
                        : link
                    ),
                  })
                );
              }}
              textComponent="h2"
              textComponentClassName="whitespace-nowrap text-center mb-0"
            />
          </div>

          <div className="flex items-center gap-6">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                const linksLength = activeScreen.links.length;
                if (linksLength <= 1) {
                  dispatch(
                    setDialog(DialogType.InfoDialog, {
                      noStornoButton: false,
                      title: t(
                        "deleteLinkDialog.titleErrLessThanOne"
                      ) as string,
                      content: (
                        <div>
                          <p>{t("deleteLinkDialog.textErrLessThanOne")}</p>
                        </div>
                      ),
                    })
                  );
                  return;
                }

                dispatch(
                  setDialog(DialogType.ConfirmDialog, {
                    title: <FontIcon className="color-black">delete</FontIcon>,
                    text: t("deleteLinkDialog.textConfirm"),
                    onSubmit: () =>
                      dispatch(
                        updateScreenData({
                          links: activeScreen.links.filter(
                            (l, lidx) => currLinkIndex !== lidx
                          ),
                        })
                      ),
                  })
                );
              }}
            >
              <Icon
                useMaterialUiIcon
                name="delete"
                iconStyle={{ fontSize: "24px" }}
                tooltip={{
                  id: "link-delete-icon-tooltip",
                  content: t("deleteIconTooltip"),
                  variant: "dark",
                }}
              />
            </Button>
          </div>
        </div>
      </AccordionSummary>

      <AccordionDetails>
        <div className="px-2 py-2 flex flex-col lg:flex-row items-center lg:items-start gap-6">
          {referenceType !== "ONLY_TEXT" && (
            <div>
              <ImageBox
                title={t("imageLabel")}
                image={currLinkImage}
                setImage={setCurrLinkImage}
                onDelete={() =>
                  dispatch(
                    updateScreenData({
                      links: activeScreen.links?.map((l, lidx) =>
                        currLinkIndex === lidx
                          ? { ...l, image: null, imageOrigData: null }
                          : l
                      ),
                    })
                  )
                }
                onLoad={(width: number, height: number) =>
                  dispatch(
                    updateScreenData({
                      links: activeScreen.links?.map((l, lidx) =>
                        currLinkIndex === lidx
                          ? { ...l, imageOrigData: { width, height } }
                          : l
                      ),
                    })
                  )
                }
                helpIconLabel={t("imageTooltip")}
                helpIconId={`editor-signpost-screen-reference-${currLinkIndex}`}
              />
            </div>
          )}

          <div className="w-full flex flex-col gap-6">
            {referenceType !== "ONLY_IMAGES" && (
              <div className={cx("flex w-full")}>
                <TextField
                  id={`signpost-screen-textfield-text-${currLinkIndex}`}
                  label={t("linkTextLabel")}
                  rows={2}
                  maxRows={2}
                  value={currLinkObj.text ?? ""}
                  onChange={(newText: string) =>
                    dispatch(
                      updateScreenData({
                        links: activeScreen.links?.map((l, lidx) =>
                          currLinkIndex === lidx ? { ...l, text: newText } : l
                        ),
                      })
                    )
                  }
                />
                <HelpIcon
                  label={t("linkTextTooltip")}
                  id={`signpost-screen-reference-text-${currLinkIndex}`}
                />
              </div>
            )}

            <div className="w-full">
              <ScreenChooser
                label={t("linkScreenLabel")}
                value={activeScreen.links?.[currLinkIndex]?.reference ?? null}
                onChange={(newScreenId) =>
                  dispatch(
                    updateScreenData({
                      links: activeScreen.links.map((l, lidx) =>
                        lidx === currLinkIndex
                          ? { ...l, reference: newScreenId }
                          : l
                      ),
                    })
                  )
                }
              />
            </div>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default LinkItem;
