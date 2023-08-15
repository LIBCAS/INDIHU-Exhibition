import { useDispatch } from "react-redux";

// Components
import Carousel from "../carousel";
import { Card, CardText, FontIcon } from "react-md";

// Models
import { SlideshowImages, PhotogalleryImages, ParallaxImages } from "models";
import { AppDispatch } from "store/store";

// Utils
import cx from "classnames";
import { getFileById } from "../../actions/file-actions";
import { setDialog } from "../../actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";
import { isEmpty } from "lodash";

type CarouselContainerProps = {
  images?: SlideshowImages | PhotogalleryImages | ParallaxImages;
  activeImageIndex: number;
  onClickCard: (i: number) => void;
  onClickLeft: (i: number) => void;
  onClickRight: (i: number) => void;
  onDelete: (i: number) => void;
  onAdd: () => void;
};

const CarouselContainer = ({
  images,
  activeImageIndex,
  onClickCard,
  onClickLeft,
  onClickRight,
  onDelete,
  onAdd,
}: CarouselContainerProps) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="carousel-container">
      <Carousel>
        {images?.map((currImageItem, currImageIndex) => {
          const currImageFileId =
            currImageItem === null || isEmpty(currImageItem)
              ? null
              : typeof currImageItem === "string"
              ? dispatch(getFileById(currImageItem))?.fileId // parallax screen directly contains array of ids
              : dispatch(getFileById(currImageItem?.id))?.fileId;

          return (
            <Card
              key={currImageIndex}
              raise
              className={cx("carousel-card", {
                active: currImageIndex === activeImageIndex,
              })}
              onClick={() => onClickCard(currImageIndex)}
            >
              <CardText className="carousel-card-text">
                <div className="carousel-card-text-image">
                  {currImageFileId && (
                    <img src={`/api/files/${currImageFileId}`} alt="img" />
                  )}
                </div>

                {currImageIndex === activeImageIndex && activeImageIndex > 0 ? (
                  <FontIcon
                    className="icon-left"
                    onClick={(e: Event) => {
                      e.stopPropagation();
                      onClickLeft(currImageIndex);
                    }}
                  >
                    keyboard_arrow_left
                  </FontIcon>
                ) : (
                  <div className="icon-placeholder" />
                )}

                {currImageIndex === activeImageIndex &&
                activeImageIndex < images.length - 1 ? (
                  <FontIcon
                    className="icon-middle"
                    onClick={(e: Event) => {
                      e.stopPropagation();
                      onClickRight(currImageIndex);
                    }}
                  >
                    keyboard_arrow_right
                  </FontIcon>
                ) : (
                  <div className="icon-placeholder" />
                )}

                {currImageIndex === activeImageIndex && (
                  <FontIcon
                    className="icon-right"
                    onClick={(e: Event) => {
                      e.stopPropagation();
                      dispatch(
                        setDialog(DialogType.ConfirmDialog, {
                          title: (
                            <FontIcon className="color-black">delete</FontIcon>
                          ),
                          text: "Opravdu chcete odstranit zvolený obrázek?",
                          onSubmit: () => onDelete(currImageIndex),
                        })
                      );
                    }}
                  >
                    delete
                  </FontIcon>
                )}
              </CardText>
            </Card>
          );
        })}

        <Card raise className="carousel-card" onClick={() => onAdd()}>
          <CardText className="card-text">
            <FontIcon className="card-icon">add</FontIcon>
          </CardText>
        </Card>
      </Carousel>
    </div>
  );
};

export default CarouselContainer;
