import {Tokens, PlainJSON, NoFunctionValue} from './types';
import {operationExecutor, operationFactory} from './operations';

export const parse = (variablesTemplate: PlainJSON): Tokens => Object.keys(variablesTemplate).reduce(
  (accumulator, key) => {
    return {...accumulator, [key]: (variablesTemplate[key])};
  },
  {}
);

/**
 * 
 * @param rawTemplate 
 * @param variablesScope 
 */
const extractTemplateValue = (rawTemplate: string, variablesScope: Tokens): NoFunctionValue => {
  const templateBody = rawTemplate.replace('{{', '').replace('}}', '').trim();
  const pointer = templateBody.charAt(0);
  if (pointer === '@' || pointer === '$') {
    if (templateBody.length === 1) {
      throw new Error('invalid template syntax: no variable name');
    }
    const variableName = templateBody.substr(1, templateBody.length - 1);
    if (pointer === '@') {
      return variablesScope[variableName];
    }
    if (pointer === '$') {
      return operationFactory(variableName, variablesScope);
    }
  }
  return templateBody;
}

/**
 * If valueTemplate is a string enclosed in {{<templateBody>}} then
 *  - either extracts variable templateBody starts from @
 *  - or generates value by applying an appropriated and supported operation.
 * Otherwise returns valueTemplate.
 * @param valueTemplate 
 * @param variablesScope 
 * @returns {any} value of the valueTemplate
 */
const extract = (valueTemplate: NoFunctionValue, variablesScope: Tokens): NoFunctionValue => {
  if (typeof valueTemplate !== 'string') {
    return valueTemplate;
  };

  const templateRegex = /{{.*}}/;
  if (templateRegex.test(valueTemplate)) {
    const matches = templateRegex.exec(valueTemplate) as RegExpExecArray;
    if (matches.length > 1) {
      throw new Error(`invalid value template: value template must match to {{ @variable || $func() }} pattern but it is ${valueTemplate}`);
    }
    return extractTemplateValue(matches[0], variablesScope);
  }

  return valueTemplate;
};

/**
 * Assembles object from the data property in template.
 * @param {object} dataTemplate: not parsed object from the data property in template.
 * @param {object} variablesScope: object with keys from the variables scope in templated with parsed values.
 * @returns {object} generated JSON from the data template.
 */
export const assemble = (dataTemplate: PlainJSON, variablesScope: Tokens): PlainJSON => Object.keys(dataTemplate).reduce(
  (accumulator, key) => {
    const value = extract(dataTemplate[key], variablesScope);
    return {...accumulator, [key]: value};
  },
  {}
);
