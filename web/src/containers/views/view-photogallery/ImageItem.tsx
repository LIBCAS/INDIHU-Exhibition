import { useSpring, animated } from "react-spring";
import { Grid } from "@mui/material";
import { useState } from "react";

type ImageItemProps = {
  imageUrl: string | undefined;
  imageIndex: number;
  openLightBox: (selectedImageIndex: number) => void;
  isLessPhotos: boolean;
};

const ImageItem = ({
  imageUrl,
  imageIndex,
  openLightBox,
  isLessPhotos,
}: ImageItemProps) => {
  const [isImageHovered, setIsImageHovered] = useState<boolean>(false);

  const scaleSpring = useSpring({
    transform: isImageHovered ? "scale(1.1)" : "scale(1)",
  });

  if (!imageUrl) {
    return null;
  }

  return (
    <Grid
      item
      xs={isLessPhotos ? 12 : 12}
      sm={isLessPhotos ? 12 : 12}
      md={isLessPhotos ? 6 : 6}
      lg={isLessPhotos ? 6 : 4}
      xl={isLessPhotos ? 4 : 3}
    >
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
