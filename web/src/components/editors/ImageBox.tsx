import React, {
  Dispatch,
  SetStateAction,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import ReactMdButton from "react-md/lib/Buttons/Button";
import FontIcon from "react-md/lib/FontIcons";
import HelpIcon from "components/help-icon";
import { Icon } from "components/icon/icon";

import { Tooltip } from "react-tooltip";

import { AppDispatch, AppState } from "store/store";
import { File as IndihuFile, Infopoint, Sequence, Size } from "models";

import { setDialog } from "actions/dialog-actions";
import { showLoader, setImageEditor } from "actions/app-actions";
import cx from "classnames";

import { helpIconText } from "enums/text";
import { dispatch } from "index";
import { DialogType } from "components/dialogs/dialog-types";
import { useTranslation } from "react-i18next";
import { isInfopointOutsideImageBox } from "utils/infopoint-utils";

const infopointSize = 34;

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.activeExpo.id,
  (expoId) => ({ expoId })
);

// - -

type ImageBoxProps = {
  title: string;
  image: IndihuFile | null; // image to be displayed, if null, then select image displayed
  setImage: (img: IndihuFile) => void; // when file choosed in dialog, to structure sets the image: image.id, infopoints: []
  onDelete: (() => void) | (() => Promise<void>); // structure will set to image: null, imageOrigData: null
  onLoad: // responsible for setting to structure the imageOrigData (first loaded image size)
  | ((width: number, height: number) => void)
    | ((width: number, height: number) => Promise<void>);
  helpIconLabel: string;
  helpIconId: string;

  // Infopoints support, optional
  onInfopointMove?: (
    movedInfopointIndex: number,
    newLeftPosition: number,
    newTopPosition: number
  ) => void;
  infopoints?: Infopoint[] | Sequence[];
  infopointTooltipId?: string;

  activePoint?: any;
};

const ImageBox = ({
  title,
  image,
  setImage,
  onLoad,
  onDelete,
  helpIconLabel,
  helpIconId,
  infopoints,
  onInfopointMove,
  infopointTooltipId,
}: ImageBoxProps) => {
  const [currZoom, setCurrZoom] = useState<number>(1);
  const dispatch = useDispatch<AppDispatch>();

  // - -

  const changeImage = useCallback(() => {
    dispatch(
      setDialog(DialogType.ScreenFileChoose, {
        onChoose: (choosedImg) => {
          dispatch(showLoader(true));
          setImage(choosedImg);
        },
        typeMatch: new RegExp(/^image\/.*$/),
        accept: "image/*",
      })
    );
  }, [dispatch, setImage]);

  return (
    <div className="flex">
      <div
        className={cx("flex flex-col", {
          img: !!image,
          "img-none": !image,
        })}
      >
        <div>{title}</div>
        {/* CARD HERE */}
        <ImageContainer
          image={image}
          onLoad={onLoad}
          changeImage={changeImage}
          currZoom={currZoom}
          infopoints={infopoints}
          onInfopointMove={onInfopointMove}
          infopointTooltipId={infopointTooltipId}
        />

        <SettingsPanel
          image={image}
          onDelete={onDelete}
          changeImage={changeImage}
          setCurrZoom={setCurrZoom}
        />
      </div>

      <HelpIcon
        label={helpIconLabel || helpIconText.EDITOR_IMAGE}
        id={helpIconId}
      />
    </div>
  );
};

export default ImageBox;

// - - -

type ImageContainerProps = {
  image: ImageBoxProps["image"];
  onLoad: ImageBoxProps["onLoad"];
  changeImage: () => void;
  currZoom: number;
  infopoints: ImageBoxProps["infopoints"];
  onInfopointMove: ImageBoxProps["onInfopointMove"];
  infopointTooltipId: ImageBoxProps["infopointTooltipId"];
};

const ImageContainer = ({
  image,
  onLoad,
  changeImage,
  currZoom,
  infopoints,
  onInfopointMove,
  infopointTooltipId,
}: ImageContainerProps) => {
  const { t } = useTranslation("expo-editor");
  const [infopointIndexMouseDown, setInfopointIndexMouseDown] = useState<
    number | null
  >(null);

  const [initImgSize, setInitImgSize] = useState<Size | null>(null);
  const [imgSize, setImgSize] = useState<Size | null>(null);

  const [naturalImgSize, setNaturalImgSize] = useState<Size | null>(null);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  // Every time the image is being zoomed, its dimensions inside the container are changing
  // Set the current dimensions to the state
  useEffect(() => {
    const imgEl = imageRef.current;
    if (imgEl) {
      const imgElRect = imgEl.getBoundingClientRect();
      setImgSize({
        width: imgElRect.width,
        height: imgElRect.height,
      });
    }
  }, [currZoom]);

  // E.g if initial dimensions were 500x500 and now they were zoomed to 750x750..
  // that means that both zooms are 1.5 (by this value infopoints to be shifted)
  const { zoomX, zoomY } = useMemo(() => {
    if (!initImgSize || !imgSize) {
      return { zoomX: 1, zoomY: 1 };
    }
    return {
      zoomX: imgSize.width / initImgSize.width || 1,
      zoomY: imgSize.height / initImgSize.height || 1,
    };
  }, [initImgSize, imgSize]);

  // Handler used in both infopoint icon and underlying image mouse move events
  const onMouseMoveHandler = (e: any) => {
    const imageContainerEl = imageContainerRef.current;
    const imageEl = imageRef.current;
    if (
      infopointIndexMouseDown === null ||
      !imageContainerEl ||
      !imageEl ||
      onInfopointMove === undefined
    ) {
      return;
    }

    const imageElRect = imageEl.getBoundingClientRect();

    // const scrollLeft = imageContainerEl.scrollLeft;
    // const scrollTop = imageContainerEl.scrollTop;
    // Scroll is somehow by imageRect added (- values)
    const leftFromImage = e.clientX - imageElRect.left;
    const topFromImage = e.clientY - imageElRect.top;

    const unZoomedLeftFromImage = leftFromImage / zoomX;
    const unZoomedTopFromImage = topFromImage / zoomY;

    onInfopointMove(
      infopointIndexMouseDown,
      unZoomedLeftFromImage,
      unZoomedTopFromImage
    );
  };

  //
  const releaseInfopointIcon = useCallback(
    () => setInfopointIndexMouseDown(null),
    []
  );

  useEffect(() => {
    document.addEventListener("mouseup", releaseInfopointIcon);
    return () => document.removeEventListener("mouseup", releaseInfopointIcon);
  }, [releaseInfopointIcon]);

  // - -

  if (!image) {
    return (
      <Card className="w-[450px] h-[350px] relative p-0 max-w-full overflow-auto">
        <CardText className="h-full flex flex-col items-center justify-center">
          <FontIcon style={{ fontSize: "18em" }}>image</FontIcon>
          <div className="flex items-center justify-center">
            <ReactMdButton
              raised
              label={t("imageBox.emptySelectLabel")}
              onClick={() => changeImage()}
            />
          </div>
        </CardText>
      </Card>
    );
  }

  return (
    <Card className="p-0">
      <div
        ref={imageContainerRef}
        className="w-[450px] h-[350px] relative overflow-auto"
      >
        <img
          ref={imageRef}
          src={`/api/files/${image.fileId}`}
          alt="img"
          className="max-w-full max-h-full object-contain object-left-top"
          style={{
            transform: `scale(${currZoom})`,
            transformOrigin: "0px 0px",
          }}
          onLoad={(e) => {
            const imageEl = e.currentTarget;
            const imageElRect = imageEl.getBoundingClientRect();
            onLoad(imageElRect.width, imageElRect.height);
            dispatch(showLoader(false));
            setInitImgSize({
              width: imageElRect.width,
              height: imageElRect.height,
            });
            setImgSize({
              width: imageElRect.width,
              height: imageElRect.height,
            });
            setNaturalImgSize({
              width: imageEl.naturalWidth,
              height: imageEl.naturalHeight,
            });
          }}
          onMouseMove={onMouseMoveHandler}
        />

        {/* Render infopoints on top of the image */}
        {infopoints?.map((infopoint, infopointIndex) => {
          if (!("left" in infopoint && "top" in infopoint)) {
            return null;
          }
          if (!initImgSize || !imgSize) {
            return null;
          }

          // Prepare variables
          const infopointPosition = {
            left: infopoint.left,
            top: infopoint.top,
          };
          const imgBoxSize = {
            width: initImgSize?.width ?? 0,
            height: initImgSize?.height ?? 0,
          };
          const imgNaturalSize = {
            width: naturalImgSize?.width ?? 0,
            height: naturalImgSize?.height ?? 0,
          };

          if (
            !imgBoxSize.width ||
            !imgBoxSize.height ||
            !imgNaturalSize.width ||
            !imgNaturalSize.height
          ) {
            return null;
          }

          let xPercentage;
          let yPercentage;

          if (isInfopointOutsideImageBox(infopointPosition, imgBoxSize)) {
            xPercentage = infopointPosition.left / (imgNaturalSize.width / 100);
            yPercentage = infopointPosition.top / (imgNaturalSize.height / 100);
          } else {
            xPercentage = infopointPosition.left / (imgBoxSize.width / 100);
            yPercentage = infopointPosition.top / (imgBoxSize.height / 100);
          }

          const adjustedLeft = xPercentage * (imgSize.width / 100);
          const adjustedTop = yPercentage * (imgSize.height / 100);

          return (
            <React.Fragment key={`infopoint-${infopointIndex}`}>
              <FontIcon
                // Since has onMouseMoveHandler, so the Tooltip will react to position changes
                key={`infopoint-${infopointIndex}-${infopoint.left}-${infopoint.top}`}
                id={
                  infopointTooltipId
                    ? `${infopointTooltipId}-${infopointIndex}`
                    : `screen-image-infopoint-${infopointIndex}`
                }
                className="cursor-pointer"
                style={{
                  fontSize: `${infopointSize}px`,
                  color: "#3366cc",
                  position: "absolute",
                  left: adjustedLeft - infopointSize / 2,
                  top: adjustedTop - infopointSize / 2,
                }}
                onMouseDown={() => setInfopointIndexMouseDown(infopointIndex)}
                onMouseUp={releaseInfopointIcon}
                onMouseMove={onMouseMoveHandler}
                data-tooltip-id={
                  infopointTooltipId
                    ? `${infopointTooltipId}-${infopointIndex}`
                    : `screen-image-infopoint-${infopointIndex}`
                }
                data-tooltip-content={
                  "zoom" in infopoint
                    ? infopoint.text // in this case sequence.. otherwise always infopoint
                    : infopoint.bodyContentType === "IMAGE"
                    ? infopoint.imageFile?.name ?? "Neuveden název obrázku"
                    : infopoint.bodyContentType === "VIDEO"
                    ? infopoint.videoFile?.name ?? "Neuveden název videa"
                    : infopoint.text ?? "Neuvedeno"
                }
              >
                help
              </FontIcon>

              <Tooltip
                id={
                  infopointTooltipId
                    ? `${infopointTooltipId}-${infopointIndex}`
                    : `screen-image-infopoint-${infopointIndex}`
                }
                className="!bg-[#3366cc] !max-w-[150px] whitespace-nowrap overflow-hidden text-ellipsis" // infopoint-tooltip
                variant="dark"
                float={false}
              />
            </React.Fragment>
          );
        })}
      </div>
    </Card>
  );
};

// - - -

type SettingsPanelProps = {
  image: ImageBoxProps["image"];
  onDelete: ImageBoxProps["onDelete"];
  changeImage: () => void;
  setCurrZoom: Dispatch<SetStateAction<number>>;
};

const SettingsPanel = ({
  image,
  onDelete,
  changeImage,
  setCurrZoom,
}: SettingsPanelProps) => {
  const { expoId } = useSelector(stateSelector);
  const { t } = useTranslation("expo-editor");

  if (!image) {
    return null;
  }

  return (
    <div className="mt-1 w-full flex flex-wrap justify-between">
      {/* Left side with zooming icons */}
      <div className="flex gap-1">
        <Icon
          useMaterialUiIcon
          name="zoom_in"
          style={{ fontSize: "24px", opacity: 0.6 }}
          onClick={() => {
            setCurrZoom((prevZoom) => prevZoom + 0.2);
          }}
          tooltipId="zoom-in-icon-button"
          tooltipText={t("imageBox.zoomInTooltip")}
          tooltipVariant="dark"
        />

        <Icon
          useMaterialUiIcon
          name="search"
          style={{ fontSize: "24px", opacity: 0.6 }}
          onClick={() => {
            setCurrZoom(1);
          }}
          tooltipId="reset-zoom-icon-button"
          tooltipText={t("imageBox.zoomResetTooltip")}
          tooltipVariant="dark"
        />

        <Icon
          useMaterialUiIcon
          name="zoom_out"
          style={{ fontSize: "24px", opacity: 0.6 }}
          onClick={() => {
            setCurrZoom((prevZoom) =>
              prevZoom <= 1 ? prevZoom : prevZoom - 0.2
            );
          }}
          tooltipId="zoom-out-icon-button"
          tooltipText={t("imageBox.zoomOutTooltip")}
          tooltipVariant="dark"
        />
      </div>

      {/* Right side with edit and delete icon */}
      <div className="flex gap-1">
        <Icon
          useMaterialUiIcon
          name="folder"
          style={{ fontSize: "24px", opacity: 0.6 }}
          onClick={() => {
            changeImage();
          }}
          tooltipId="explorer-icon-button"
          tooltipText={t("imageBox.openFileExplorerTooltip")}
          tooltipVariant="dark"
        />

        <Icon
          useMaterialUiIcon
          name="palette"
          style={{ fontSize: "24px", opacity: 0.6 }}
          onClick={() => {
            const imageEditorObj = {
              expoId: expoId,
              src: `/api/files/${image.fileId}`,
              type: image.type,
              onClose: undefined,
            };
            dispatch(setImageEditor(imageEditorObj));
          }}
          tooltipId="image-editor-icon-button"
          tooltipText={t("imageBox.openImageEditorTooltip")}
          tooltipVariant="dark"
        />

        <Icon
          useMaterialUiIcon
          name="delete"
          style={{ fontSize: "24px", opacity: 0.6 }}
          onClick={() => {
            dispatch(
              setDialog(DialogType.ConfirmDialog, {
                title: <FontIcon className="color-black">delete</FontIcon>,
                text: "Opravdu chcete odstranit obrázek?",
                onSubmit: () => onDelete(),
              })
            );
          }}
          tooltipId="delete-icon-button"
          tooltipText={t("imageBox.deleteImageFromBox")}
          tooltipVariant="dark"
        />
      </div>
    </div>
  );
};
