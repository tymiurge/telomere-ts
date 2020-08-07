import {Tokens, PlainJSON} from './types';
import {extractValue} from './extractors';

/** 
 * builds variables scope
 * @param {object} variablesTemplate: variables scope template
 * @returns {object} object with value generated from their templates
 */
export const buildVariablesScope = (variablesTemplate: PlainJSON): Tokens => Object.keys(variablesTemplate).reduce(
  (accumulator, key) => {
    const value = extractValue(variablesTemplate[key], accumulator);
    return {...accumulator, [key]: value};
  },
  {}
);

/**
 * Assembles object from the data property in template.
 * @param {object} dataTemplate: not parsed object from the data property in template.
 * @param {object} variablesScope: object with keys from the variables scope in templated with parsed values.
 * @returns {object} generated JSON from the data template.
 */
export const assemble = (dataTemplate: PlainJSON, variablesScope: Tokens): PlainJSON => Object.keys(dataTemplate).reduce(
  (accumulator, key) => {
    const value = extractValue(dataTemplate[key], variablesScope);
    return {...accumulator, [key]: value};
  },
  {}
);
