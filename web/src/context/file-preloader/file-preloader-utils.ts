import { get } from "lodash";

// Models
import { Screen } from "models";
import { FileLookupMap } from "containers/views/hooks/files-hook";
import { ScreenPreloadedFiles } from "./file-preloader-provider";

// - - - - - - -

// gets file.id and map like { [file.id]: File }
// retrieve the File from map, fetch the BE endpoint /api/files/file.fileId
// response from BE will be .blob and create "blob:http://..."
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

// - - - - - - - -

type ScreenPreloadedFilesInput = Omit<ScreenPreloadedFiles, "images"> & {
  images: (string | { id: string } | undefined)[];
};

type ScreenFileResolver<TProps = unknown, TReturn = unknown> = (
  props: TProps,
  fileLookupMap: FileLookupMap
) => Promise<TReturn>;

type ScreenFileResolverMap = {
  [Key in keyof ScreenPreloadedFiles]: ScreenFileResolver<
    ScreenPreloadedFilesInput[Key],
    ScreenPreloadedFiles[Key]
  >;
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

// - - - - - - - -

type ScreenPromiseArray = Promise<{
  key: string;
  value: ScreenPreloadedFiles[keyof ScreenPreloadedFiles];
}>[];

// input is some Screen object and fileLookupMap
// go through all defined 'keys' (like image, audio, music, images, ...) in Screen object
// each Screen[key] like Screen.image, Screen.audio has a value as file.id
// use retrieveFileUrl(file.id, fileLookupMap) -> 'blob:http//'
export const extractFiles = async (
  screen: Screen | undefined,
  fileLookupMap: FileLookupMap
): Promise<ScreenPreloadedFiles> => {
  if (!screen) return Promise.resolve({});

  const promises = await Promise.all(
    Object.entries(screenFileResolver).reduce<ScreenPromiseArray>(
      (acc, [key, resolver]) => {
        const idOfFile = get(screen, key); // file.id, but not file.fileId!!
        if (!idOfFile) return acc;

        // can be one file, but in case of 'images' or 'answers'.. multiple files
        const promise = resolver(idOfFile, fileLookupMap).then((files) => ({
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
    {} as ScreenPreloadedFiles
  );
};

// - - - - - - - -

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
