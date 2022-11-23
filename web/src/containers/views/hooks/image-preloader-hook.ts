import { useEffect, useMemo, useState } from "react";

const preloadImage = (src: string) =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(src);
    image.src = src;
    (window as any)[src] = image;
  });

export const useImagePreloader = (imageSources: string[]) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isCancelled = false;

    const preloadAllImages = async () => {
      setLoading(true);

      if (isCancelled) {
        return;
      }

      const imagePromises = imageSources.map((src) => preloadImage(src));

      await Promise.all(imagePromises);

      if (isCancelled) {
        return;
      }

      setLoading(false);
    };

    preloadAllImages();

    return () => {
      isCancelled = true;
    };
  }, [imageSources]);

  return useMemo(() => ({ loading }), [loading]);
};
