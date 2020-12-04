import React, { Component } from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import {
  compose,
  defaultProps,
  withState,
  branch,
  renderNothing,
  lifecycle
} from "recompose";
import { noop, isEmpty, get, find, isString } from "lodash";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import ReactTooltip from "react-tooltip";
import MenuButton from "react-md/lib/Menus/MenuButton";
import ListItem from "react-md/lib/Lists/ListItem";
import { Button, FontIcon, Card, Divider } from "react-md";

import { setDialog } from "../actions/dialogActions";
import ComponentLoader from "./ComponentLoader";

const TOOLTIP_ID = "image-editor-toolbar-icon-tooltip";

const menuItem = (
  {
    key,
    divider,
    menuItems,
    icon,
    tooltip,
    label,
    className,
    containerClassName,
    ...item
  },
  i
) =>
  divider ? (
    <div key={i} className={`divider ${className}`} />
  ) : !isEmpty(menuItems) ? (
    <div className={containerClassName}>
      <MenuButton
        key={`${tooltip}-${key}`}
        id={`image-editor-menubutton-${tooltip}`}
        flat
        label={label}
        buttonChildren={icon}
        position="tr"
        data-tip={tooltip}
        data-for={TOOLTIP_ID}
        className={`button ${className}`}
      >
        {menuItems.map(({ label, value }) => (
          <ListItem
            key={label}
            primaryText={label}
            onClick={() => item.onClick(value)}
          />
        ))}
      </MenuButton>
    </div>
  ) : (
    <Button
      key={`${tooltip}-${key}`}
      icon
      data-tip={tooltip}
      data-for={TOOLTIP_ID}
      className={`button ${className}`}
      {...item}
    >
      {icon}
    </Button>
  );

class ImageEditor extends Component {
  crop() {
    const canvas = this.refs.cropper.getCroppedCanvas();
    if (canvas.height > 1 && canvas.width > 1) {
      this.refs.cropper.replace(canvas.toDataURL());
    } else {
      this.props.setDialog("Info", {
        content: (
          <h2 className="text-center margin-none">
            Oblast pro oříznutí je příliš malá!
          </h2>
        ),
        autoClose: true,
        autoCloseTime: 2000,
        noDialogMenu: true,
        noToolbar: true,
        big: true
      });
    }
  }

  cropMove() {
    const newIsCrop = !this.props.isCrop;
    this.props.setCrop(newIsCrop);
    this.refs.cropper.setDragMode(newIsCrop ? "crop" : "move");
  }

  zoomIn() {
    this.refs.cropper.zoom(0.1);
  }

  zoomOut() {
    this.refs.cropper.zoom(-0.1);
  }

  rotateLeft() {
    this.refs.cropper.rotate(-90);
  }

  rotateRight() {
    this.refs.cropper.rotate(90);
  }

  scaleHoriz() {
    const newScale = [this.props.scale[0] * -1, this.props.scale[1]];
    this.props.setScale(newScale);
    this.refs.cropper.scale(newScale[0], newScale[1]);
  }

  scaleVert() {
    const newScale = [this.props.scale[0], this.props.scale[1] * -1];
    this.props.setScale(newScale);
    this.refs.cropper.scale(newScale[0], newScale[1]);
  }

  render() {
    const {
      src,
      aspectRatio,
      aspectRatioOptions,
      setAspectRatio,
      onClose,
      guides,
      setGuides,
      isCrop,
      cropperState,
      setCropperState,
      setDialog,
      expoId,
      folder,
      menuOpen,
      setMenuOpen,
      loading,
      setLoading,
      type
    } = this.props;

    const saveAction = className => ({
      tooltip: "Uložit",
      icon: "save",
      onClick: () => {
        const croppedCavnas = this.refs.cropper.getCroppedCanvas(
          !type || type === "image/png"
            ? {}
            : {
                fillColor: "#fff"
              }
        );

        const dataUrl = croppedCavnas.toDataURL(type);

        croppedCavnas.toBlob(blob =>
          setDialog("ImageEditorSave", {
            expoId,
            folder,
            blob,
            dataUrl,
            onSave: filename => {
              setLoading(false);
              onClose();
              setDialog("Info", {
                content: (
                  <h2 className="text-center margin-none">
                    Soubor uložen jako <strong>{filename}</strong>.
                  </h2>
                ),
                autoClose: true,
                autoCloseTime: 3000,
                noDialogMenu: true,
                noToolbar: true,
                big: true
              });
            },
            onError: () => {
              setLoading(false);
              setDialog("Info", {
                content: (
                  <h2 className="text-center margin-none invalid">
                    Soubor se nepodařilo uložit!
                  </h2>
                ),
                autoClose: true,
                autoCloseTime: 3000,
                noDialogMenu: true,
                noToolbar: true,
                big: true
              });
            },
            onSubmitStart: () => {
              setMenuOpen(false);
              setLoading("Ukládá se...");
            }
          })
        );
      },
      className
    });
    const closeAction = className => ({
      tooltip: "Zavřít editor",
      icon: "close",
      onClick: () =>
        setDialog("ConfirmDialog", {
          title: "Zavření editoru",
          content: (
            <div>
              <p>Opravdu chcete zavřít editor?</p>
              <div className="flex-row-nowrap flex-center">
                <FontIcon className="color-red">priority_high</FontIcon>
                <p>
                  <strong style={{ fontSize: "0.9em" }}>
                    Provedené změny nebudou uloženy!
                  </strong>
                </p>
              </div>
            </div>
          ),
          onSubmit: onClose
        }),
      className
    });
    const resetAction = className => ({
      tooltip: "Zobrazit původní obrázek",
      icon: "cached",
      onClick: () =>
        setDialog("ConfirmDialog", {
          title: "Zobrazit původní obrázek",
          content: (
            <div>
              <p>Opravdu chcete zobrazit původní obrázek?</p>
              <div className="flex-row-nowrap flex-center">
                <FontIcon className="color-red">priority_high</FontIcon>
                <p>
                  <strong style={{ fontSize: "0.9em" }}>
                    Provedené změny nebudou uloženy!
                  </strong>
                </p>
              </div>
            </div>
          ),
          onSubmit: () => {
            setMenuOpen(false);
            setLoading(true);
            setCropperState(!cropperState);
          }
        }),
      className
    });
    const guidesAction = className => ({
      key: guides,
      tooltip: guides ? "Skrýt mřížku" : "Zobrazit mřížku",
      icon: guides ? "grid_off" : "grid_on",
      onClick: () =>
        setDialog("ConfirmDialog", {
          title: guides ? "Skrýt mřížku" : "Zobrazit mřížku",
          content: (
            <div>
              <p>Opravdu chcete akci provést?</p>
              <div className="flex-row-nowrap flex-center">
                <FontIcon className="color-red">priority_high</FontIcon>
                <p>
                  <strong style={{ fontSize: "0.9em" }}>
                    Provedené změny nebudou uloženy!
                  </strong>
                </p>
              </div>
            </div>
          ),
          onSubmit: () => {
            setMenuOpen(false);
            setLoading(true);
            setGuides(!guides);
          }
        }),
      className
    });
    const cropMoveAction = className => ({
      tooltip: isCrop ? "Režim pohybu" : "Režim ořezu",
      icon: isCrop ? "zoom_out_map" : "crop_free",
      onClick: this.cropMove.bind(this),
      className
    });
    const aspectRatioAction = className => ({
      key: aspectRatio,
      tooltip: "Poměr stran ořezu",
      label: get(
        find(aspectRatioOptions, ({ value }) => aspectRatio === value),
        "label",
        "Vlastní"
      ),
      icon: "aspect_ratio",
      onClick: value => setAspectRatio(value),
      menuItems: aspectRatioOptions,
      className,
      containerClassName: "image-editor-aspect-ratio"
    });
    const cropAction = className => ({
      tooltip: "Oříznout",
      icon: "crop",
      onClick: this.crop.bind(this),
      className
    });
    const zoomInAction = className => ({
      tooltip: "Zvětšit",
      icon: "zoom_in",
      onClick: this.zoomIn.bind(this),
      className
    });
    const zoomOutAction = className => ({
      tooltip: "Zmenšit",
      icon: "zoom_out",
      onClick: this.zoomOut.bind(this),
      className
    });
    const rotateLeftAction = className => ({
      tooltip: "Otočit doleva o 90°",
      icon: "rotate_left",
      onClick: this.rotateLeft.bind(this),
      className
    });
    const rotateRightAction = className => ({
      tooltip: "Otočit doprava o 90°",
      icon: "rotate_right",
      onClick: this.rotateRight.bind(this),
      className
    });
    const swapHorizAction = className => ({
      tooltip: "Překlopit horizontálně",
      icon: "swap_horiz",
      onClick: this.scaleHoriz.bind(this),
      className
    });
    const swapVertAction = className => ({
      tooltip: "Překlopit vertikálně",
      icon: "swap_vert",
      onClick: this.scaleVert.bind(this),
      className
    });
    const menuAction = className => ({
      tooltip: "Menu",
      icon: "menu",
      onClick: () => setMenuOpen(true),
      className
    });

    const divider = className => ({ divider: true, className });

    return (
      <div className={"image-editor"}>
        <div className="image-editor-toolbar">
          <h3
            className={classNames("image-editor-title", {
              "screen-small-min": !loading
            })}
          >
            Editor obrázků
          </h3>
          {loading
            ? [divider(), closeAction(), divider()].map(menuItem)
            : [
                divider("screen-small-min screen-big-max"),
                menuAction("screen-big-max"),
                divider("screen-big-min"),
                saveAction("screen-big-min"),
                closeAction("screen-big-min"),
                resetAction("screen-big-min"),
                divider("screen-big-min"),
                guidesAction("screen-big-min"),
                divider("screen-big-min"),
                cropMoveAction("screen-big-min"),
                divider("screen-big-min"),
                aspectRatioAction("screen-big-min"),
                divider("screen-big-min"),
                cropAction("screen-big-min"),
                divider(),
                zoomInAction(),
                zoomOutAction(),
                divider(),
                rotateLeftAction(),
                rotateRightAction(),
                divider("screen-big-min"),
                swapHorizAction("screen-big-min"),
                swapVertAction("screen-big-min")
              ].map(menuItem)}
          {loading && (
            <h3 className="image-editor-loading-title">
              {isString(loading) ? loading : "Načítá se..."}
            </h3>
          )}
        </div>
        <div className="image-editor-container">
          <div className="image-editor-inner">
            <Cropper
              {...{
                key: `${cropperState}-${guides}`,
                src,
                ref: "cropper",
                aspectRatio,
                guides,
                viewMode: 1,
                style: { height: "100%", width: "100%" },
                ready: () => setLoading(false)
              }}
            />
          </div>
          {loading && (
            <div className="component-loader-container">
              <ComponentLoader />
            </div>
          )}
        </div>
        {menuOpen && (
          <Card className="menu-dialog">
            <div className="padding">
              <div className="flex-row flex-space-between flex-center">
                <h4 className="margin-left-small margin-bottom-none">Menu</h4>
                <Button
                  icon
                  data-tip="Zavřít menu"
                  data-for={TOOLTIP_ID}
                  onClick={() => setMenuOpen(false)}
                >
                  close
                </Button>
              </div>
            </div>
            <Divider />
            <div className="padding">
              <div className="flex-row flex-centered">
                {[
                  saveAction(),
                  closeAction(),
                  resetAction(),
                  guidesAction(),
                  cropMoveAction(),
                  aspectRatioAction(),
                  cropAction(),
                  swapHorizAction(),
                  swapVertAction()
                ].map(menuItem)}
              </div>
            </div>
          </Card>
        )}
        <ReactTooltip
          key={`${guides}-${aspectRatio}-${isCrop}-${menuOpen}-${loading}`}
          id={TOOLTIP_ID}
          type="dark"
          effect="solid"
        />
      </div>
    );
  }
}

export default compose(
  defaultProps({
    open: false,
    onClose: noop,
    aspectRatioOptions: [
      { label: "16:10", value: 16 / 10 },
      { label: "16:9", value: 16 / 9 },
      { label: "11:8", value: 11 / 8 },
      { label: "7:3", value: 7 / 3 },
      { label: "6:5", value: 6 / 5 },
      { label: "5:4", value: 5 / 4 },
      { label: "5:3", value: 5 / 3 },
      { label: "4:3", value: 4 / 3 },
      { label: "3:2", value: 3 / 2 },
      { label: "1:1", value: 1 },
      { label: "Vlastní", value: null }
    ]
  }),
  lifecycle({
    componentWillReceiveProps({ open }) {
      if (open && !this.props.open) {
        document.body.style.overflow = "hidden";
      }
    },
    componentWillUnmount() {
      document.body.style.overflow = "auto";
    }
  }),
  branch(({ open }) => !open, renderNothing),
  connect(
    null,
    { setDialog }
  ),
  withState("loading", "setLoading", true),
  withState("menuOpen", "setMenuOpen", false),
  withState("isCrop", "setCrop", true),
  withState("guides", "setGuides", true),
  withState("cropperState", "setCropperState", true),
  withState("scale", "setScale", [1, 1]),
  withState("aspectRatio", "setAspectRatio", 16 / 9)
)(ImageEditor);
