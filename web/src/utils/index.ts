import { format } from "date-fns";
import { get, isEmpty, isArray, cloneDeep } from "lodash";
import { Screen, CollaboratorObj } from "models";
export * from "./routing";

// - -

/**
 * Find if user have ROLE_ADMIN
 * @param {array} roles
 */
export const isAdmin = (roles: string[]) => roles.indexOf("ROLE_ADMIN") >= 0;

export const isProduction = () => process.env.REACT_APP_PROD_VERSION === "true";

/**
 * Checks if variable has value (not undefined, not null, not empty string)
 */
export const hasValue = (value: any) =>
  value !== undefined && value !== null && value !== "";

export const testRegex = (regex: RegExp, value: string) =>
  value && regex.test(value);

export const testDevice = (regex: RegExp) =>
  testRegex(regex, window.navigator.userAgent) ||
  testRegex(regex, window.navigator.platform);

export const isIE = () => testDevice(/MSIE|Trident/);

export const isMobileDevice = () => isAndroid() || isIOS() || isOtherMobile();

export const isAndroid = () => testDevice(/Android/);

export const isIOS = () => testDevice(/iPhone|iPad|iPod/);

export const isOtherMobile = () =>
  testDevice(/webOS|BlackBerry|Opera Mini|Mobi/);

export const openInNewTab = (url: string) => {
  const regex = /^(http:\/\/|https:\/\/).*$/;
  const validatedUrl = regex.test(url) ? url : `https://${url}`;
  window.open(validatedUrl, "_blank")?.focus();
};

/**
 * Open viewer
 */
export const openViewer = (url: string) => {
  const a = document.createElement("a");
  a.href = `${window.location.origin}${url}`;
  a.target = "_blank";
  a.className = "hidden";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// - -

/**
 * Takes currently logged in userName and array of all collaborators (people with whom the expo is shared with) + author of the expo itself
 * If currently logged in user with its userName has access to this exposition (either collaborator or author or admin), then do not show error or prepared screen
 */
export const haveAccessToExpo = (
  role: string[],
  userName: string | null, // user, logged in or logged out, if logged out, immediately cannot be creator
  authorUsername?: string,
  collaborators?: CollaboratorObj[]
): boolean => {
  if (!userName) {
    return false;
  }

  if (isAdmin(role)) {
    return true;
  }

  if (authorUsername === userName) {
    return true;
  }
  if (!collaborators || collaborators.length === 0) {
    return false;
  }

  let isCollaborator = false;
  for (let i = 0; i < collaborators.length; i++) {
    const currCollaborator = collaborators[i];
    if (currCollaborator?.collaborator?.username === userName) {
      isCollaborator = true;
    }
  }

  return isCollaborator;
};

export const parseUrlSection = (sectionIndex: string) => {
  if (sectionIndex === "start") {
    return "start" as const;
  }
  if (sectionIndex === "finish") {
    return "finish" as const;
  }

  const parsedSection = parseInt(sectionIndex);
  return isNaN(parsedSection) ? undefined : parsedSection;
};

export const parseUrlScreen = (screenIndex: string) => {
  const parsedScreen = parseInt(screenIndex);
  return isNaN(parsedScreen) ? undefined : parsedScreen;
};

// - -

/**
 * Downloads file from URL
 */
export const downloadFileFromUrl = (url: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = "";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const blobToFile = (blob: Blob, fileName: string) => {
  const date = new Date();
  return new File([blob], fileName, {
    type: blob.type,
    lastModified: date.getTime(),
    // lastModifiedDate: date,
  });
};

/**
 * Downloads a file
 *
 * @param file blob object or URL for the file
 * @param filename name for the file that will be downloaded
 */
export const downloadFile = (file: Blob | string, filename: string) => {
  const url =
    typeof file === "string" ? file : window.URL.createObjectURL(file);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};

// - -

/**
 * Format timestamp into human eye friendly format
 */
export const formatDate = (date: Date | string | number) =>
  format(date, "DD.MM.YYYY");
export const formatTime = (time: Date | string | number) =>
  format(time, "DD.MM.YYYY HH:mm:ss");

export const secondsToTime = (seconds: number) => {
  return {
    h: Math.floor(seconds / 3600),
    m: Math.floor((seconds % 3600) / 60),
    s: Math.floor((seconds % 3600) % 60),
  };
};

export const secondsToFormatedTime = (
  seconds: number,
  includeSeconds = true
) => {
  const time = secondsToTime(seconds);

  if (!includeSeconds) {
    time.m = time.m + ((time.m === 0 && time.s > 0) || time.s >= 30 ? 1 : 0);
    time.s = 0;
  }

  return time.h > 0 || time.m > 0 || time.s > 0
    ? (time.h > 0 ? `${time.h} hod` : "") +
        (time.h > 0 && (time.m > 0 || time.s > 0) ? " " : "") +
        (time.m > 0 ? `${time.m} min` : "") +
        ((time.h > 0 || time.m > 0) && time.s > 0 ? " " : "") +
        (time.s > 0 ? `${time.s} s` : "")
    : "0 min";
};

/**
 * Count time of expo screens
 */
export const giveMeExpoTime = (screens: Screen[][]) => {
  let time = 0;

  screens.forEach((chapter) =>
    chapter.forEach((screen) => {
      const screenTime = "time" in screen ? Number(screen.time) : null;
      if (screenTime && !isNaN(screenTime)) {
        time += screenTime;
      } else {
        time += 20;
      }
    })
  );

  return secondsToFormatedTime(time, false);
};

export const secondsToVideoDuration = (seconds: number) => {
  const totalMinutes = Math.floor(seconds / 60);
  const totalSeconds = Math.floor(seconds - totalMinutes * 60);

  const paddedMinutes = totalMinutes.toString().padStart(2, "0");
  const paddedSeconds = totalSeconds.toString().padStart(2, "0");
  return `${paddedMinutes}:${paddedSeconds}`;
};

// - -

/**
 * Checks if two objects are equal
 */
export const objectsEqual = (object1: any, object2: any) => {
  if (isEmpty(object1) && isEmpty(object2)) {
    return true;
  }

  if (isEmpty(object1)) {
    return false;
  }

  if (isEmpty(object2)) {
    return false;
  }

  if (get(object1, "length") !== get(object2, "length")) {
    return false;
  }

  for (const property in object1) {
    if (
      Object.prototype.hasOwnProperty.call(object1, property) !==
      Object.prototype.hasOwnProperty.call(object2, property)
    ) {
      return false;
    }

    switch (typeof object1[property]) {
      case "object":
        if (!objectsEqual(object1[property], object2[property])) return false;
        break;
      case "function":
        if (
          typeof object2[property] === "undefined" ||
          object1[property].toString() !== object2[property].toString()
        )
          return false;
        break;
      default:
        if (object1[property] !== object2[property]) return false;
    }
  }

  for (const property in object2) {
    if (typeof object1[property] === "undefined") return false;
  }

  return true;
};

// - - - - - -

type QueryParam = { field: string; value: any };

export const createQuery = (queryParams: QueryParam[]) => {
  const filteredQueryParams = queryParams.filter(
    (qp) => hasValue(qp.field) && hasValue(qp.value)
  );

  if (isEmpty(filteredQueryParams)) {
    return "";
  }

  const paramPairs = filteredQueryParams.map(
    (queryParam) => `${queryParam.field}=${queryParam.value}`
  );
  const queryString = "?" + paramPairs.join("&");
  return queryString;
};

// - - - - - -

type QueryFilterParam = { field: string; operation: string; value: any };

export const createFilter = (filterItemsUncleared: QueryFilterParam[]) => {
  const filteredItems = filterItemsUncleared.filter(
    (param) =>
      hasValue(param.field) &&
      hasValue(param.operation) &&
      hasValue(param.value)
  );

  // in the end looks like [{field: 'filter[0].field', value: 'title'}, {field: 'filter[0].operation', value: 'CONTAINS'}, {field: 'filter[0].value', value: 'something'}]
  let filterArray: QueryParam[] = [];

  filteredItems.forEach((item, idx) => {
    filterArray = [
      ...filterArray,
      { field: `filter[${idx}].field`, value: item.field },
      { field: `filter[${idx}].operation`, value: item.operation },
      { field: `filter[${idx}].value`, value: item.value },
    ];
  });

  return filterArray;
};

// - - - - - -

export const asyncForEach = async (array: any, callback: any) => {
  if (isArray(array)) {
    for (let index = 0; index < array.length; index++) {
      if (!(await callback(array[index], index, array))) {
        return false;
      }
    }
  }

  return true;
};

// - - - - - -

/**
 * Accepts two object arguments and matches the missing keys of the first object against the second with false values
 * E.q. obj1 = { name: 'John' }, obj2 = { name: 'John', isStudent: true }
 * return value will be following object: { name: 'John', isStudent: false }
 */
export const alignObject = (objA: any, objB: any) => {
  const clonedObjA = cloneDeep(objA);
  alignClonedObject(clonedObjA, objB);
  return clonedObjA;
};

const alignClonedObject = (objA: any, objB: any) => {
  const bKeys = Object.keys(objB);
  for (const keyOfB of bKeys) {
    if (typeof objA[keyOfB] === "object") {
      alignClonedObject(objA[keyOfB], objB[keyOfB]);
    }

    if (objA[keyOfB] === undefined) {
      objA[keyOfB] = false;
    }
  }
};
