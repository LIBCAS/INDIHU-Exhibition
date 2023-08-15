import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";

// Components
import Carousel from "components/editors/carousel";
import Image from "components/editors/image";

// Models
import { ScreenPhotoGalleryProps } from "./screen-photogallery-new";
import { AppDispatch } from "store/store";
import { File as IndihuFile } from "models";

// Utils
import { isEmpty } from "lodash";
import { getFileById } from "actions/file-actions";

const Photogallery = (props: ScreenPhotoGalleryProps) => {
  const { activeScreen, updateScreenData } = props;
  const dispatch = useDispatch<AppDispatch>();

  // Carousel contains one card for each image from activeScreen.images
  // activeImageIndex is the index of currently active image from activeScreen.images
  // Set by clicking or manipulating with the Carousel cards
  const [activeImageIndex, setActiveImageIndex] = useState<number>(-1);

  // Based on activeScreen.images[index].id, get the corresponding IndihuFile
  const activeImageFile = useMemo<IndihuFile | null>(() => {
    const activeImageObj = activeScreen.images?.find(
      (currImage, currImageIndex) =>
        currImageIndex === activeImageIndex &&
        !isEmpty(currImage) &&
        currImage.id
    );

    if (activeImageIndex !== -1 && activeImageObj) {
      const activeImageFile = dispatch(getFileById(activeImageObj.id)); // IndihuFile
      return activeImageFile;
    }
    return null;
  }, [activeImageIndex, activeScreen.images, dispatch]);

  // Used when choosing (onChoose) the file with the dialog
  // Retrieves the IndihuFile from dialog, only extracts the id from it and leaves the other props from our model
  const setActiveImageFile = (img: IndihuFile) => {
    if (!activeScreen.images) {
      return;
    }
    updateScreenData({
      images: activeScreen.images.map((currImage, currImageIndex) =>
        activeImageIndex === currImageIndex
          ? { ...currImage, id: img.id }
          : currImage
      ),
    });
  };

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <Carousel
          images={activeScreen.images}
          activeImageIndex={activeImageIndex}
          onAdd={() => {
            updateScreenData({
              images: activeScreen.images
                ? [
                    ...activeScreen.images.map((currImg) => ({
                      ...currImg,
                      active: false,
                    })),
                    { active: true },
                  ]
                : [{ active: true }],
            });
            //
            if (!activeScreen.images) {
              setActiveImageIndex(0);
            } else {
              setActiveImageIndex(activeScreen.images.length);
            }
          }}
          onClickCard={(i) => {
            setActiveImageIndex(activeImageIndex === i ? -1 : i);
            updateScreenData({
              images: activeScreen.images?.map((currImage, currImageIndex) =>
                i === currImageIndex
                  ? activeImageIndex === i
                    ? { ...currImage, active: false }
                    : { ...currImage, active: true }
                  : { ...currImage, active: false }
              ),
            });
          }}
          onClickLeft={(i) => {
            if (activeScreen.images) {
              updateScreenData({
                images: [
                  ...activeScreen.images.slice(0, i - 1),
                  activeScreen.images[i],
                  activeScreen.images[i - 1],
                  ...activeScreen.images.slice(
                    i + 1,
                    activeScreen.images.length
                  ),
                ],
              });
              setActiveImageIndex(activeImageIndex - 1);
            }
          }}
          onClickRight={(i) => {
            if (activeScreen.images) {
              updateScreenData({
                images: [
                  ...activeScreen.images.slice(0, i),
                  activeScreen.images[i + 1],
                  activeScreen.images[i],
                  ...activeScreen.images.slice(
                    i + 2,
                    activeScreen.images.length
                  ),
                ],
              });
              setActiveImageIndex(activeImageIndex + 1);
            }
          }}
          onDelete={(i) => {
            if (activeScreen.images) {
              updateScreenData({
                images: activeScreen.images.filter(
                  (_currImg, currImgIndex) => currImgIndex !== i
                ),
              });
            }
          }}
        />

        {/* Clicked image from carousel, also counts for new image for uploading */}
        {activeScreen.images && activeImageIndex !== -1 && (
          <div className="screen-image">
            <div className="screen-two-cols">
              {/* Left panel */}
              <div className="flex-row-nowra one-image-row">
                <Image
                  key={`image-${activeImageIndex}`}
                  title="Obrázek"
                  image={activeImageFile}
                  setImage={setActiveImageFile}
                  onDelete={() => {
                    if (!activeScreen.images) {
                      return;
                    }
                    updateScreenData({
                      images: activeScreen.images.map(
                        (currImage, currImageIndex) =>
                          currImageIndex === activeImageIndex ? {} : currImage
                      ),
                    });
                  }}
                  updateScreenData={updateScreenData}
                  id="editor-photogallery-image"
                  helpIconLabel="Test helpIconLabel"
                  images={activeScreen.images}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Photogallery;
