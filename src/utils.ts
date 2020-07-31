export const getRandomInt = (max: number): number => Math.floor(Math.random() * Math.floor(max));

export const isEmpty = (candidate: Object | Array<any> | null | undefined): boolean => {
  if (!candidate) {
    return false;
  }
  if (Array.isArray(candidate)) {
    return candidate.length === 0;
  }
  return isEmpty(Object.values(candidate));
};

export const getRandomValueOf = (source: Array<any> | Object): any => {
  if (Array.isArray(source)) {
    const randomIdx = getRandomInt(source.length);
    return source[randomIdx];
  }
  return getRandomValueOf(Object.values(source));
};