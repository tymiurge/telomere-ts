import { Tokens, NoFunctionValue } from './types';
import { extractValue } from './operations';

/**
 * builds variables scope
 * @param {object} variablesTemplate: variables scope template
 * @returns {object} object with value generated from their templates
 */
export const buildVariablesScope = (variablesTemplate: Record<string, NoFunctionValue>): Tokens => {
  const scope: Record<string, NoFunctionValue> = {};
  Object.entries(variablesTemplate).forEach(([key, template]) => {
    const value = extractValue(template, scope);
    scope[key] = value;
  });
  return scope;
};

/**
 * Assembles object from the data property in template.
 * @param {object} dataTemplate: not parsed object from the data property in template.
 * @param {object} variablesScope: object with keys from the variables scope in templated with
 *        parsed values.
 * @returns {object} generated JSON from the data template.
 */
export const assemble = (
  dataTemplate: Record<string, NoFunctionValue>,
  variablesScope: Tokens,
): Record<string, NoFunctionValue> => {
  const scope: Record<string, NoFunctionValue> = {};
  Object.entries(dataTemplate).forEach(([key, template]) => {
    const value = extractValue(template, variablesScope);
    scope[key] = value;
  });
  return scope;
};
