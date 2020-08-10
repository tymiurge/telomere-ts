import { NoFunctionValue } from './types';

export const getRandomInt = (max: number): number => Math.floor(Math.random() * Math.floor(max));

export const isEmpty = (
  candidate: Record<string, unknown> | unknown[] | null | undefined,
): boolean => {
  if (!candidate) {
    return false;
  }
  if (Array.isArray(candidate)) {
    return candidate.length === 0;
  }
  return isEmpty(Object.values(candidate));
};

export const getRandomValueOf = (source: Record<string, unknown> | unknown[]): NoFunctionValue => {
  if (Array.isArray(source)) {
    const randomIdx = getRandomInt(source.length);
    return source[randomIdx] as NoFunctionValue;
  }
  return getRandomValueOf(Object.values(source));
};
