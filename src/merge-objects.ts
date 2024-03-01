export function deepMerge(target: any, source: any) {
  const mergeArrays = (target: any, source: any) => {
    source.forEach((item: any, index: any) => {
      if (typeof target[index] === "undefined") {
        target[index] = item;
      } else if (Array.isArray(item)) {
        target[index] = deepMerge(target[index], item);
      } else if (typeof item === "object") {
        target[index] = deepMerge({}, item);
      } else {
        target[index] = item;
      }
    });

    return target;
  };

  if (
    typeof target !== "object" ||
    typeof source !== "object" ||
    target === null ||
    source === null
  ) {
    return source;
  }

  if (Array.isArray(target) && !Array.isArray(source)) {
    return source;
  }

  if (!Array.isArray(target) && Array.isArray(source)) {
    return source;
  }

  if (Array.isArray(target) && Array.isArray(source)) {
    return mergeArrays(target.slice(), source.slice());
  }

  const merged: any = {};
  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      merged[key] = target[key];
    }
  }
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (typeof source[key] === "object" && !Array.isArray(source[key])) {
        merged[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        merged[key] = source[key];
      }
    }
  }

  return merged;
}
