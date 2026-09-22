import { useSpring, animated } from "react-spring";
import { Grid } from "@mui/material";
import { useState } from "react";
import { getResponsiveGridItemProps } from "utils/grid-sizing";

type ImageItemProps = {
  imageUrl: string | undefined;
  imageIndex: number;
  numberOfPhotos: number;
  openLightBox: (selectedImageIndex: number) => void;
};

const ImageItem = ({
  imageUrl,
  imageIndex,
  numberOfPhotos,
  openLightBox,
}: ImageItemProps) => {
  const [isImageHovered, setIsImageHovered] = useState<boolean>(false);

  const scaleSpring = useSpring({
    transform: isImageHovered ? "scale(1.1)" : "scale(1)",
  });

  const isLessPhotos = numberOfPhotos <= 6;

  if (!imageUrl) {
    return null;
  }

  return (
    <Grid item {...getResponsiveGridItemProps(numberOfPhotos, isLessPhotos)}>
      <animated.div
        className="w-full h-full cursor-pointer"
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
        onClick={() => openLightBox(imageIndex)}
        style={{ ...scaleSpring }}
      >
        <img
          src={imageUrl}
          alt={`photogallery-image-${imageIndex}`}
          className="w-full h-full object-cover"
        />
      </animated.div>
    </Grid>
  );
};

export default ImageItem;
