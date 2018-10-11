import { format } from "date-fns";
import {
  indexOf,
  map,
  get,
  isEmpty,
  filter as lodashFilter,
  forEach
} from "lodash";

export * from "./routing";

/**
 * Find if user have ROLE_ADMIN
 * @param {array} roles 
 */
export const isAdmin = roles => indexOf(roles, "ROLE_ADMIN") >= 0;

/**
 * Open viewer
 */
export const openViewer = url => {
  const a = document.createElement("a");
  a.href = `${window.location.origin}${url}`;
  a.target = "_blank";
  a.className = "hidden";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/**
 * Format timestamp into human eye friendly format
 */
export const formatDate = date => format(date, "DD.MM.YYYY");
export const formatTime = time => format(time, "DD.MM.YYYY HH:mm:ss");

export const secondsToTime = seconds => {
  return {
    h: Math.floor(seconds / 3600),
    m: Math.floor(seconds % 3600 / 60),
    s: Math.floor(seconds % 3600 % 60)
  };
};

export const secondsToFormatedTime = seconds => {
  const time = secondsToTime(seconds);
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
export const giveMeExpoTime = screens => {
  let time = 0;
  map(screens, chapter =>
    map(
      chapter,
      screen =>
        screen.timeAuto && !isNaN(Number(get(screen, "audio.duration")))
          ? (time += Number(get(screen, "audio.duration")))
          : !isNaN(Number(get(screen, "time"))) && Number(screen.time) > 0
            ? (time += Number(screen.time))
            : (time += 20)
    )
  );
  return secondsToFormatedTime(time);
};

/**
 * Linear set volume of musicPtr
 * @param {*} musicPtr music element
 * @param {*} from value
 * @param {*} to value
 */
export const motionVolume = (musicPtr, from, to, propStep, propLoop) => {
  if (musicPtr.volume === from) {
    const step = Math.abs(from - to) / 10;
    musicPtr.volume = from + 0.01;
    motionVolume(musicPtr, from > to ? from - step : from + step, to, step, 10);
  }
  const loop = propLoop - 1;
  if (loop > 0) {
    setTimeout(() => {
      musicPtr.volume = from;
      motionVolume(
        musicPtr,
        from > to ? from - propStep : from + propStep,
        to,
        propStep,
        loop
      );
    }, 200);
  } else if (loop === 0) {
    musicPtr.volume = to;
  }
};

/**
 * Checks if variable has value (not undefined, not null, not empty string)
 */
export const hasValue = value =>
  value !== undefined && value !== null && value !== "";

/**
 * Checks if two objects are equal
 */
export const objectsEqual = (object1, object2) => {
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

  for (let property in object1) {
    if (object1.hasOwnProperty(property) !== object2.hasOwnProperty(property)) {
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

  for (let property in object2) {
    if (typeof object1[property] === "undefined") return false;
  }

  return true;
};

export const createFilter = filterItemsUncleared => {
  const filterItems = lodashFilter(
    filterItemsUncleared,
    param =>
      hasValue(param.field) &&
      hasValue(param.operation) &&
      hasValue(param.value)
  );

  let filterArray = [];

  forEach(filterItems, (item, i) => {
    const { field, operation, value } = item;

    filterArray = [
      ...filterArray,
      { field: `filter[${i}].field`, value: field },
      { field: `filter[${i}].operation`, value: operation },
      { field: `filter[${i}].value`, value }
    ];
  });

  return filterArray;
};

export const createQuery = queryParams => {
  const params = lodashFilter(
    queryParams,
    param => hasValue(param.field) && hasValue(param.value)
  );

  if (!isEmpty(params)) {
    let s = "?";

    forEach(params, (param, i) => {
      s += `${param.field}=${param.value}`;

      if (i + 1 < params.length) {
        s += "&";
      }
    });

    return s;
  }

  return "";
};
