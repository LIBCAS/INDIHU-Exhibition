import { get } from "lodash";

import { FileLookupMap } from "containers/views/hooks/files-hook";
import { Screen } from "models";

import { ScreenFileResolverMap, ScreenFiles } from "./file-preloader-types";

const retrieveFileUrl = async (
  id: string | undefined,
  fileLookupMap: FileLookupMap
) => {
  if (!id) return;

  const file = fileLookupMap[id];
  if (!file) return;

  try {
    const res = await fetch(`/api/files/${file.fileId}`);
    const blob = await res.blob();
    return window.URL.createObjectURL(blob);
  } catch (err) {
    // Noop
    console.error(err);
  }
};

const screenFileResolver: ScreenFileResolverMap = {
  image: retrieveFileUrl,
  audio: retrieveFileUrl,
  image1: retrieveFileUrl,
  image2: retrieveFileUrl,
  image3: retrieveFileUrl,
  music: retrieveFileUrl,
  object: retrieveFileUrl,
  video: retrieveFileUrl,
  images: async (images, fileLookupMap) =>
    Promise.all(
      images?.map((image) =>
        retrieveFileUrl(
          typeof image === "object" ? image.id : image,
          fileLookupMap
        )
      ) ?? []
    ),
  answers: async (answers, fileLookupMap) =>
    Promise.all(
      answers?.map(async (answer) => ({
        image: await retrieveFileUrl(answer.image, fileLookupMap),
      })) ?? []
    ),
};

type ScreenPromiseArray = Promise<{
  key: string;
  value: ScreenFiles[keyof ScreenFiles];
}>[];

export const extractFiles = async (
  screen: Screen | undefined,
  fileLookupMap: FileLookupMap
): Promise<ScreenFiles> => {
  if (!screen) return Promise.resolve({});

  const promises = await Promise.all(
    Object.entries(screenFileResolver).reduce<ScreenPromiseArray>(
      (acc, [key, resolver]) => {
        const value = get(screen, key);
        if (!value) return acc;

        const promise = resolver(value, fileLookupMap).then((files) => ({
          key,
          value: files,
        }));

        return [...acc, promise] as ScreenPromiseArray;
      },
      []
    )
  );

  return promises.reduce(
    (acc, { key, value }) => ({ ...acc, [key]: value }),
    {} as ScreenFiles
  );
};

export const clearObjectUrls = (
  item: object | object[] | string | string[]
) => {
  if (Array.isArray(item)) {
    item.forEach((i) => clearObjectUrls(i));
    return;
  }

  if (typeof item === "object") {
    Object.values(item).forEach((i) => clearObjectUrls(i));
    return;
  }

  window.URL.revokeObjectURL(item);
};
