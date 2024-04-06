function isObject(item: object) {
  return item && typeof item === "object" && !Array.isArray(item);
}

// eslint-disable-next-line
export function mergeDeepObj(target: any, ...sources: any[]) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeepObj(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeepObj(target, ...sources);
}
