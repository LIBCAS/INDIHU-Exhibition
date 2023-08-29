import React, {
  Dispatch,
  SetStateAction,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { useDispatch } from "react-redux";

import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import Button from "react-md/lib/Buttons/Button";
import FontIcon from "react-md/lib/FontIcons";
import HelpIcon from "components/help-icon";

import { Tooltip } from "react-tooltip";

import { AppDispatch } from "store/store";
import { File as IndihuFile, Infopoint } from "models";

import { setDialog } from "actions/dialog-actions";
import { showLoader } from "actions/app-actions";
import cx from "classnames";

import { helpIconText } from "enums/text";
import { dispatch } from "index";
import { DialogType } from "components/dialogs/dialog-types";

const infopointSize = 34;

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
  infopoints?: Infopoint[];
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
    <div className="flex flex-row" style={{ flexWrap: "nowrap" }}>
      <div
        className={cx("flex flex-col card-image-container", {
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

type Size = { width: number; height: number };

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
  const [infopointIndexMouseDown, setInfopointIndexMouseDown] = useState<
    number | null
  >(null);

  const [initImgSize, setInitImgSize] = useState<Size | null>(null);
  const [imgSize, setImgSize] = useState<Size | null>(null);
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

  if (!image) {
    return (
      <Card className="w-[450px] h-[350px] relative p-0 max-w-full overflow-auto">
        <CardText className="h-full flex flex-col items-center justify-center">
          <FontIcon style={{ fontSize: "18em" }}>image</FontIcon>
          <div className="flex items-center justify-center">
            <Button raised label="Vybrat" onClick={() => changeImage()} />
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
          }}
          onMouseMove={(e) => {
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
          }}
        />

        {/* Render infopoints on top of the image */}
        {infopoints?.map((infopoint, infopointIndex) => {
          if (!("left" in infopoint && "top" in infopoint)) {
            return null;
          }

          return (
            <React.Fragment key={`infopoint-${infopointIndex}`}>
              <FontIcon
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
                  left: infopoint.left * zoomX - infopointSize / 2,
                  top: infopoint.top * zoomY - infopointSize / 2,
                }}
                onMouseDown={() => setInfopointIndexMouseDown(infopointIndex)}
                onMouseUp={() => setInfopointIndexMouseDown(null)}
                data-tooltip-id={
                  infopointTooltipId
                    ? `${infopointTooltipId}-${infopointIndex}`
                    : `screen-image-infopoint-${infopointIndex}`
                }
                data-tooltip-content={infopoint.text ?? ""}
              >
                help
              </FontIcon>

              <Tooltip
                id={
                  infopointTooltipId
                    ? `${infopointTooltipId}-${infopointIndex}`
                    : `screen-image-infopoint-${infopointIndex}`
                }
                className="infopoint-tooltip"
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
  if (!image) {
    return null;
  }

  return (
    <div className="w-full flex flex-wrap justify-between">
      {/* Left side with zooming icons */}
      <div>
        <FontIcon
          className="p-1 inline-block cursor-pointer"
          onClick={() => {
            setCurrZoom((prevZoom) => prevZoom + 0.2);
          }}
        >
          zoom_in
        </FontIcon>

        <FontIcon
          className="p-1 inline-block cursor-pointer"
          onClick={() => {
            setCurrZoom(1);
          }}
        >
          search
        </FontIcon>

        <FontIcon
          className="p-1 inline-block cursor-pointer"
          onClick={() => {
            setCurrZoom((prevZoom) =>
              prevZoom <= 1 ? prevZoom : prevZoom - 0.2
            );
          }}
        >
          zoom_out
        </FontIcon>
      </div>

      {/* Right side with edit and delete icon */}
      <div>
        <FontIcon
          className="p-1 inline-block cursor-pointer"
          onClick={() => {
            changeImage();
          }}
        >
          mode_edit
        </FontIcon>

        <FontIcon
          className="p-1 inline-block cursor-pointer"
          onClick={() => {
            dispatch(
              setDialog(DialogType.ConfirmDialog, {
                title: <FontIcon className="color-black">delete</FontIcon>,
                text: "Opravdu chcete odstranit obrázek?",
                onSubmit: () => onDelete(),
              })
            );
          }}
        >
          delete
        </FontIcon>
      </div>
    </div>
  );
};
